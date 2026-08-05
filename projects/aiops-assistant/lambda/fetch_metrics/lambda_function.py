import json
import urllib.request
import urllib.parse
from datetime import datetime


PROMETHEUS_URL = "http://aa540d4e0ab704fa18c3b7a31982c910-282801422.us-east-1.elb.amazonaws.com:9090"

DEFAULT_NAMESPACE = "knicks"


METRIC_QUERIES = {

    "pod_cpu_utilization": '''
    sum(
        rate(
            container_cpu_usage_seconds_total{{
                namespace="{namespace}",
                container!="POD",
                image!=""
            }}[5m]
        )
    ) by (pod)
    ''',


    "pod_memory_utilization": '''
    sum(
        container_memory_working_set_bytes{{
            namespace="{namespace}",
            container!="POD",
            image!=""
        }}
    ) by (pod)
    ''',


    "pod_restarts": '''
    increase(
        kube_pod_container_status_restarts_total{{
            namespace="{namespace}"
        }}[1h]
    )
    ''',


    "deployment_replicas_unavailable": '''
    kube_deployment_status_replicas_unavailable{{
        namespace="{namespace}"
    }}
    ''',


    "deployment_replicas_available": '''
    kube_deployment_status_replicas_available{{
        namespace="{namespace}"
    }}
    ''',


    "node_cpu_utilization": '''
    100 -
    (
        avg by(instance)
        (
            rate(
                node_cpu_seconds_total{{
                    mode="idle"
                }}[5m]
            )
        ) * 100
    )
    ''',


    "node_memory_utilization": '''
    (
        1 -
        (
            node_memory_MemAvailable_bytes
            /
            node_memory_MemTotal_bytes
        )
    ) * 100
    '''
}



def prometheus_query(query):

    url = (
        f"{PROMETHEUS_URL}/api/v1/query"
        f"?query={urllib.parse.quote(query)}"
    )

    with urllib.request.urlopen(url, timeout=10) as resp:
        data = json.loads(resp.read())

    return data["data"]["result"]




def prometheus_range_query(query, hours_back, step="5m"):

    end = int(datetime.utcnow().timestamp())

    start = end - (hours_back * 3600)


    url = (
        f"{PROMETHEUS_URL}/api/v1/query_range"
        f"?query={urllib.parse.quote(query)}"
        f"&start={start}"
        f"&end={end}"
        f"&step={step}"
    )


    with urllib.request.urlopen(url, timeout=10) as resp:
        data = json.loads(resp.read())


    return data["data"]["result"]




def lambda_handler(event, context):

    params = {}

    for param in event.get("parameters", []):

        params[param["name"]] = param["value"]



    metric_name = params.get(
        "metric_name",
        "pod_cpu_utilization"
    )


    namespace = params.get(
        "namespace",
        DEFAULT_NAMESPACE
    )


    hours_back = int(
        params.get(
            "hours_back",
            "1"
        )
    )


    try:

        if metric_name in METRIC_QUERIES:

            query = METRIC_QUERIES[metric_name].format(
                namespace=namespace
            )

        else:

            query = metric_name.format(
                namespace=namespace
            )


        results = prometheus_range_query(
            query,
            hours_back
        )



        if not results:

            result = {

                "status": "no_data",

                "metric": metric_name,

                "namespace": namespace,

                "message": "No Prometheus data found"

            }



        else:

            series = []


            for r in results[:20]:

                labels = r.get(
                    "metric",
                    {}
                )


                name = (

                    labels.get("pod")

                    or labels.get("deployment")

                    or labels.get("instance")

                    or "unknown"

                )


                values = [

                    float(v[1])

                    for v in r.get(
                        "values",
                        []
                    )

                ]


                if not values:
                    continue


                current = values[-1]

                average = sum(values) / len(values)

                maximum = max(values)



                # CPU cores -> millicores

                if metric_name == "pod_cpu_utilization":

                    current *= 1000

                    average *= 1000

                    maximum *= 1000



                # Bytes -> MB

                if metric_name == "pod_memory_utilization":

                    current /= 1024 ** 2

                    average /= 1024 ** 2

                    maximum /= 1024 ** 2



                series.append({

                    "resource": name,

                    "current": round(current, 2),

                    "average": round(average, 2),

                    "maximum": round(maximum, 2)

                })



            result = {

                "status": "success",

                "metric": metric_name,

                "namespace": namespace,

                "datapoints": len(series),

                "data": series

            }



    except Exception as e:

        result = {

            "status": "error",

            "message": str(e)

        }




    return {

        "messageVersion": "1.0",

        "response": {

            "actionGroup": event.get(
                "actionGroup",
                ""
            ),

            "apiPath": event.get(
                "apiPath",
                ""
            ),

            "httpMethod": event.get(
                "httpMethod",
                ""
            ),

            "httpStatusCode": 200,


            "responseBody": {

                "application/json": {

                    "body": json.dumps(
                        result,
                        separators=(",", ":")
                    )

                }

            }

        }

    }
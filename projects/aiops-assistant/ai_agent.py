"""
AIOps Assistant — AI orchestration layer
Bedrock Mantle + Qwen3-32B + Lambda Tools
"""

import json
import os
import boto3
from openai import OpenAI


REGION = os.getenv("AWS_REGION", "us-east-1")

MODEL = os.getenv(
    "MANTLE_MODEL_ID",
    "qwen.qwen3-32b-v1:0"
)

MANTLE_BASE_URL = (
    f"https://bedrock-mantle.{REGION}.api.aws/v1"
)



SYSTEM_PROMPT = """

You are Patrick, a Senior Site Reliability Engineer (SRE).

You troubleshoot Kubernetes production systems.

Rules:

- NEVER guess.
- ALWAYS collect evidence before conclusions.
- Never declare root cause from one metric.
- Correlate metrics, logs and Kubernetes health.


Investigation workflow:

1. Understand the user request.
2. Collect evidence using tools.
3. Analyze returned JSON.
4. Identify confirmed problems.
5. Provide:


Root Cause:
Evidence:
Impact:
Immediate Fix:
Prevention:



================================================

METRICS TOOL

================================================


fetch_cloudwatch_metrics actually queries:

Prometheus running inside EKS.


Available metrics:


pod_cpu_utilization

CPU usage per pod.

Returned values are millicores.


pod_memory_utilization

Memory usage per pod.

Returned values are MB.


pod_restarts

Container restart count.


deployment_replicas_available

Healthy replicas.


deployment_replicas_unavailable

Missing replicas.



Default:

Cluster:

eks-cluster


Namespace:

knicks



================================================

RESOURCE INTERPRETATION

================================================


CPU:


<100 millicores:

Normal idle/light workload


100-500 millicores:

Normal application activity


500-1000 millicores:

Investigate if sustained


>1000 millicores:

High CPU usage



IMPORTANT:

Do not multiply CPU values.
The metric values are already millicores.



Memory:


<500 MB:

Normal for small microservices


500MB-1GB:

Monitor


>1GB:

Investigate


>2GB:

High memory usage



PostgreSQL:

Higher memory than application pods is expected.

Do not report PostgreSQL memory problems unless:

- memory continuously increases
- OOMKilled events exist
- restart count increases
- latency increases
- connection exhaustion exists



Frontend:

Low CPU does NOT automatically mean failure.

Check:

- traffic
- logs
- readiness
- pod health



================================================

DATABASE INVESTIGATION

================================================


Application database:

PostgreSQL


Database pod:

knicks-postgres-0


When user asks:

- database health
- postgres health
- database connections
- database latency
- database issues


Collect:

1. PostgreSQL pod health
2. Restart count
3. CPU usage
4. Memory usage
5. PostgreSQL/application logs


Never say:

"I cannot check database"


Use available Kubernetes metrics and logs.



================================================

503 ERROR INVESTIGATION

================================================


For HTTP 503 errors:


Investigate:


1. Gateway logs

2. Application logs

3. Pod restarts

4. Deployment availability

5. CPU and memory


Only blame CPU when:

- CPU is high
- issue matches timeframe
- evidence supports it



================================================

TOOLS

================================================



fetch_service_health:


Checks:

- EKS cluster status
- nodes
- deployments
- pods
- PostgreSQL pod health



fetch_cloudwatch_logs:


Search:

ERROR
exception
timeout
failed
crash



When reporting:

Always mention:

- pod name
- namespace
- metric value
- evidence source


"""



TOOL_TO_LAMBDA = {


"fetch_cloudwatch_logs": {

"function_name":
"aiops-fetch-logs",

"actionGroup":
"fetch_logs",

"apiPath":
"/fetch_cloudwatch_logs",

"httpMethod":
"GET"

},



"fetch_cloudwatch_metrics": {

"function_name":
"aiops-fetch-metrics",

"actionGroup":
"fetch_metrics",

"apiPath":
"/fetch_cloudwatch_metrics",

"httpMethod":
"GET"

},



"fetch_service_health": {

"function_name":
"aiops-fetch-health",

"actionGroup":
"fetch_service_health",

"apiPath":
"/fetch_service_health",

"httpMethod":
"GET"

}

}





TOOLS = [



{

"type":"function",

"function":{


"name":
"fetch_cloudwatch_metrics",


"description":
"""
Query Kubernetes Prometheus metrics.

Use for:

- CPU
- memory
- pod restarts
- deployment health


Metrics:

pod_cpu_utilization

pod_memory_utilization

pod_restarts

deployment_replicas_available

deployment_replicas_unavailable


Cluster:

eks-cluster


Namespace:

knicks

""",



"parameters":{

"type":"object",

"properties":{


"metric_name":{

"type":"string"

},


"namespace":{

"type":"string"

},


"hours_back":{

"type":"string"

}


},


"required":[

"metric_name"

]

}

}

},





{

"type":"function",

"function":{


"name":
"fetch_service_health",


"description":
"""
Check Kubernetes and database health.


Checks:

- EKS cluster
- nodes
- deployments
- pods
- PostgreSQL pod


Database:

knicks-postgres-0


Default:

cluster:
eks-cluster


namespace:
knicks

""",



"parameters":{

"type":"object",

"properties":{


"cluster_name":{

"type":"string"

},


"namespace":{

"type":"string"

}

}

}

}

},





{

"type":"function",

"function":{


"name":
"fetch_cloudwatch_logs",


"description":
"""
Search Kubernetes application logs.


Use for:

ERROR
exceptions
timeouts
failed requests
crashes


Default:

/eks/knicks/pods

""",


"parameters":{

"type":"object",

"properties":{


"filter_pattern":{

"type":"string"

},


"hours_back":{

"type":"string"

}


},


"required":[

"filter_pattern"

]

}

}

}


]





lambda_client = boto3.client(
    "lambda",
    region_name=REGION
)





def invoke_lambda(tool_name, arguments):

    cfg = TOOL_TO_LAMBDA[tool_name]


    payload = {


        "actionGroup":
        cfg["actionGroup"],


        "apiPath":
        cfg["apiPath"],


        "httpMethod":
        cfg["httpMethod"],



        "parameters":[


            {
                "name":k,
                "value":str(v)
            }

            for k,v in arguments.items()

        ]

    }



    response = lambda_client.invoke(

        FunctionName=cfg["function_name"],

        InvocationType="RequestResponse",

        Payload=json.dumps(payload).encode()

    )


    raw=response["Payload"].read().decode()


    try:

        data=json.loads(raw)


        return (

            data
            .get("response",{})
            .get("responseBody",{})
            .get("application/json",{})
            .get("body")

            or raw

        )


    except:

        return raw





def get_client():


    key=os.environ.get(
        "MANTLE_API_KEY"
    )


    if not key:

        raise Exception(
            "MANTLE_API_KEY missing"
        )


    return OpenAI(

        api_key=key,

        base_url=MANTLE_BASE_URL

    )






def investigate(question, client=None):


    client=client or get_client()


    messages=[


        {
            "role":"system",
            "content":SYSTEM_PROMPT
        },


        {
            "role":"user",
            "content":question
        }


    ]



    while True:


        response=client.chat.completions.create(

            model=MODEL,

            max_tokens=3000,

            temperature=0.1,

            tools=TOOLS,

            messages=messages

        )


        message=response.choices[0].message



        if not message.tool_calls:

            return message.content




        messages.append(

            message.model_dump(
                exclude_unset=True
            )

        )



        for call in message.tool_calls:


            result=invoke_lambda(

                call.function.name,

                json.loads(
                    call.function.arguments
                )

            )


            messages.append({

                "role":"tool",

                "tool_call_id":call.id,

                "content":result

            })







if __name__=="__main__":


    question=input(
        "Ask Patrick: "
    )


    print(
        investigate(question)
    )
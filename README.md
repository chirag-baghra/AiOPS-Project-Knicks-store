# 🏀 NY Knicks Store

## Cloud Native Microservices Application with AI Powered AIOps Monitoring

A production-style cloud-native e-commerce platform deployed on **AWS EKS** using **Docker, Kubernetes, ArgoCD, Prometheus, CloudWatch, and Generative AI**.

This project demonstrates how modern **DevOps + SRE + AI automation** can be combined to build, deploy, monitor, and troubleshoot distributed applications.

---

# 📌 Project Overview

NY Knicks Store is a microservices-based e-commerce application designed to simulate a real production environment.

The platform includes:

* Containerized microservices
* Kubernetes orchestration
* GitOps-based deployments
* Monitoring and observability
* AI-powered incident troubleshooting

The goal of this project is to demonstrate a complete cloud engineering workflow:

```
Developer
    |
    |
Git Repository
    |
    |
Docker Containers
    |
    |
Kubernetes / AWS EKS
    |
    |
ArgoCD GitOps Deployment
    |
    |
Monitoring + AI Incident Response
```

---

# 🏗️ Application Architecture

```
                    Users
                      |
                      |
                 Frontend UI
                      |
                      |
                 API Gateway
                      |
 ------------------------------------------------
 |             |              |                 |
Auth       Product        Orders            Users
Service    Service        Service           Service
 |
 |
PostgreSQL Database


              AWS EKS Cluster

                      |
                      |
              KIRA AI SRE Agent

                      |
        --------------------------------
        |              |               |
   Prometheus     CloudWatch       Kubernetes
    Metrics          Logs             API
```

---

# 🧩 Microservices

The application contains:

| Service         | Purpose              |
| --------------- | -------------------- |
| Frontend        | User interface       |
| Gateway         | API routing layer    |
| Auth Service    | Authentication       |
| User Service    | User management      |
| Product Service | Product catalog      |
| Order Service   | Order processing     |
| Orders Service  | Order management     |
| PostgreSQL      | Application database |

---

# 🐳 Containerization

All services are containerized using Docker.

Example:

```bash
docker compose up -d
```

Check running containers:

```bash
docker ps
```

Docker provides:

* Consistent environments
* Easy deployment
* Application isolation

---

# ☸️ Kubernetes Deployment

The application is deployed on Kubernetes running on Amazon EKS.

Namespace:

```
knicks
```

Check application pods:

```bash
kubectl get pods -n knicks
```

Example:

```
frontend
gateway
auth-service
product-service
order-service
user-service
knicks-postgres
```

---

# ☁️ AWS EKS Infrastructure

Cloud platform:

**Amazon Elastic Kubernetes Service (EKS)**

Used services:

* Amazon EKS
* EC2 Worker Nodes
* IAM
* CloudWatch
* Lambda
* Amazon Bedrock

The Kubernetes cluster manages:

* Application workloads
* Service discovery
* Scaling
* Health checks

---

# 🔄 GitOps Deployment with ArgoCD

ArgoCD is used for continuous delivery.

Deployment flow:

```
GitHub Repository

        |

        |

      ArgoCD

        |

        |

 Kubernetes Cluster
```

Whenever Kubernetes manifests change:

1. ArgoCD detects changes
2. Compares desired state
3. Syncs resources
4. Updates the cluster

Access ArgoCD:

```bash
kubectl port-forward svc/argocd-server -n argocd 9000:80
```

Open:

```
http://localhost:9000
```

---

# 📊 Monitoring & Observability

The platform collects production metrics and logs.

## Prometheus Metrics

KIRA uses Kubernetes metrics:

### CPU Monitoring

Metric:

```
pod_cpu_utilization
```

Example:

```
gateway pod

CPU:
3.1 millicores
```

---

### Memory Monitoring

Metric:

```
pod_memory_utilization
```

Example:

```
knicks-postgres-0

Memory:
87 MB
```

---

### Pod Stability

Metric:

```
pod_restarts
```

Used to identify:

* Application crashes
* Restart loops
* Unstable services

---

# ☁️ CloudWatch Logging

Application logs are collected through:

```
CloudWatch Logs
```

Used for detecting:

* Exceptions
* Errors
* Failed requests
* Application crashes

---

# ⚡ KIRA — AI SRE Assistant

KIRA is an AI-powered Site Reliability Engineering assistant built on top of the NY Knicks Store platform.

It helps engineers troubleshoot production issues using evidence instead of guessing.

---

# 🤖 AI Investigation Workflow

User asks:

```
Why is the API slow?
```

KIRA:

1. Understands the issue
2. Collects Kubernetes evidence
3. Queries metrics
4. Searches logs
5. Analyzes failures
6. Generates Root Cause Analysis

Response format:

```
Root Cause:

Evidence:

Impact:

Immediate Fix:

Prevention:
```

---

# 🧠 AI Architecture

```
              User

               |

          Streamlit UI

               |

          KIRA AI Agent

               |

      Bedrock Mantle + Qwen3

               |

        Tool Calling Layer

      ----------------------

      |          |          |

   Metrics     Logs     Health

   Lambda    Lambda    Lambda

      |          |          |

 Prometheus CloudWatch Kubernetes

```

---

# 🛠️ AI Tools

## fetch_cloudwatch_metrics

Collects:

* CPU utilization
* Memory usage
* Pod restarts
* Deployment health

---

## fetch_cloudwatch_logs

Collects:

* Application errors
* Exceptions
* Failed requests
* Crashes

---

## fetch_service_health

Checks:

* Kubernetes nodes
* Deployments
* Pods
* Cluster health

---

# 🔍 Example Investigation

Question:

```
Check CPU and memory utilization across all services
```

KIRA analyzes:

```
gateway pod

CPU:
3.1 millicores


knicks-postgres-0

Memory:
87 MB
```

Then provides:

```
Root Cause

Evidence

Impact

Fix

Prevention
```

---

# 🔐 Security Practices

Implemented:

* IAM based AWS access
* Kubernetes RBAC
* Secure service communication
* Least privilege permissions
* Kubernetes secrets

---

# 🚀 Local Setup

Clone repository:

```bash
git clone <repository-url>
```

Move into project:

```bash
cd ny-knicks-store
```

Start application:

```bash
docker compose up -d
```

Verify:

```bash
docker ps
```

---

# 📚 Technologies Used

## Cloud

* AWS EKS
* AWS Lambda
* CloudWatch
* Amazon Bedrock

## DevOps

* Docker
* Kubernetes
* Helm
* ArgoCD
* GitOps

## Monitoring

* Prometheus
* CloudWatch Logs

## AI

* Qwen3-32B
* Bedrock Mantle
* AI Agents
* Tool Calling

## Development

* Python
* Streamlit
* Node.js

---

# 🎯 Skills Demonstrated

This project demonstrates:

✅ Cloud Engineering
✅ AWS Infrastructure
✅ Kubernetes Administration
✅ EKS Deployment
✅ GitOps with ArgoCD
✅ CI/CD Concepts
✅ Monitoring & Observability
✅ SRE Troubleshooting
✅ Generative AI Integration
✅ Production Incident Response

---

# 🔮 Future Improvements

Planned:

* Automated Kubernetes remediation
* Slack incident notifications
* Grafana dashboards
* AI log anomaly detection
* Automated rollback using ArgoCD
* Multi-cluster monitoring
* RAG based troubleshooting runbooks

---

# 👨‍💻 Author

**Chirag Baghra**

Cloud Engineer | DevOps | Kubernetes | AI Automation


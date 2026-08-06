# ⚡ KIRA — AI-Powered AIOps + DevOps Platform
### NY Knicks Store · Cloud-Native Microservices Application

![AWS](https://img.shields.io/badge/AWS-EKS-orange)
![Kubernetes](https://img.shields.io/badge/Kubernetes-1.34-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-red)
![AI](https://img.shields.io/badge/AI-Bedrock%20Mantle%20%2B%20Qwen3--32B-purple)

---

## 📌 Project Overview

A complete, enterprise-style **cloud-native application** built to demonstrate end-to-end DevOps and AIOps engineering:

- Microservices architecture
- Docker containerization
- Kubernetes orchestration on Amazon EKS
- GitOps deployment with ArgoCD
- CI/CD automation
- CloudWatch observability (Fluent Bit + Container Insights)
- An AI-powered incident-troubleshooting agent — **KIRA**

The platform simulates a production NBA merchandise store while layering an intelligent AIOps assistant on top:

> ## ⚡ KIRA
> **K**ubernetes **I**ntelligent **R**oot cause **A**nalyzer

KIRA investigates incidents by pulling real evidence — logs, metrics, and cluster health — before diagnosing anything, then reports:

- Root cause
- Supporting evidence
- Immediate fix
- Prevention recommendations

---

## 🏗️ High-Level Architecture

```
                        Users
                          |
                AWS Application Load Balancer
                          |
                   Kubernetes Ingress
                          |
        ┌─────────────────┴─────────────────┐
     Frontend                          API Gateway
   React · :3000                     Node.js · :3001
                                            |
        ┌───────────────┬───────────────┬───┴───────────┐
      Auth           Product          Orders          Users
     :3002            :3003            :3005          :3006
        └───────────────┴───────────────┴───────────────┘
                          |
                    PostgreSQL
                          |
              ────────────────────────
                 Observability Layer
              ────────────────────────
                          |
              CloudWatch Container Insights
                          |
                      Fluent Bit
                          |
                    Logs / Metrics
                          |
              ────────────────────────
                    KIRA AI Agent
              ────────────────────────
                          |
        Bedrock Mantle → Qwen3-32B → Lambda Tools
```

---

## 🌎 Live Application

**Frontend:**
http://k8s-knicks-knicksfr-168b0d894d-1921552031.us-east-1.elb.amazonaws.com

**Products page:**
http://k8s-knicks-knicksfr-168b0d894d-1921552031.us-east-1.elb.amazonaws.com/products

---

## 🚀 Technology Stack

**Frontend**
- React, TypeScript, Material UI, Axios

**Backend** — Node.js microservices
- Express.js, TypeScript, REST APIs

**Cloud Infrastructure (AWS)**
- Amazon EKS
- EC2 worker nodes
- Application Load Balancer
- Amazon ECR
- PostgreSQL (in-cluster)
- CloudWatch (Logs, Metrics, Container Insights)

**DevOps**
- Docker, Kubernetes, Helm, ArgoCD, GitHub Actions

**AI / AIOps**
- Amazon Bedrock Mantle
- Qwen3-32B (dense) — reasoning and tool-calling
- Custom Lambda diagnostic tools
- CloudWatch + EKS API-driven analysis

---

## 📂 Repository Structure

```
AIOps-Project-Knicks-Store/
│
├── frontend/
├── backend/
│   ├── gateway/
│   ├── auth/
│   ├── product-service/
│   ├── orders/
│   └── user-service/
│
├── kubernetes/
├── argocd/
│
├── aiops-assistant/
│   ├── ai_agent.py          # Bedrock Mantle + Qwen3-32B orchestration
│   ├── app.py                # Streamlit UI (KIRA)
│   ├── lambda/
│   │   ├── fetch_logs/
│   │   ├── fetch_metrics/
│   │   └── fetch_health/
│   └── schemas/               # OpenAPI tool schemas
│
└── README.md
```

---

## ☁️ AWS Infrastructure

**Kubernetes Cluster**

| | |
|---|---|
| Cluster | `eks-cluster` |
| Region | `us-east-1` |
| Kubernetes version | 1.34 |
| Node group | `eks-node-group` |

**Container Registry** — Amazon ECR
`frontend`, `gateway`, `auth`, `product-service`, `orders`, `user-service`

**Example image URI:**
```
625242091771.dkr.ecr.us-east-1.amazonaws.com/frontend
```

---

## ☸️ Kubernetes Services

**Namespace:** `knicks`

| Service | Port |
|---|---|
| frontend | 3000 |
| gateway | 3001 |
| auth | 3002 |
| product-service | 3003 |
| orders | 3005 |
| user-service | 3006 |
| postgres | 5432 |

---

## 🔥 API Gateway

All backend requests route through the gateway:
```
http://<gateway-url>:3001
```

**Product APIs**
```
GET /api/products
GET /api/products/:id
```

Example response:
```json
{
  "success": true,
  "data": { "products": [] }
}
```

**Auth APIs**
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
```

**Orders APIs**
```
POST /api/orders
GET  /api/orders
```

**Users APIs**
```
GET /api/users/:id
```

---

## 🔄 CI/CD Pipeline

```
Developer → GitHub Push → Docker Build → Push to ECR
    → Kubernetes Deployment → ArgoCD Sync → Production
```

**GitOps with ArgoCD**
```
Git Repository → ArgoCD Controller → EKS Cluster → Running Pods
```
ArgoCD continuously monitors Kubernetes manifests, image versions, and application health.

---

## 📊 Observability

**Logs**
```
Application Logs → Fluent Bit → CloudWatch Logs (/eks/knicks/pods)
```

**Metrics** — CPU, memory, pod health, node status, application performance, via CloudWatch Container Insights.

---

## 🤖 KIRA AI Agent

**Purpose:** an AI-powered Kubernetes troubleshooting assistant that investigates before it answers.

**Flow:**
```
User Question → KIRA (Qwen3-32B on Bedrock Mantle)
    → Lambda Tools (fetch_logs / fetch_metrics / fetch_service_health)
    → CloudWatch + EKS API
    → Root Cause Analysis
```

**Example questions:**
- "Check CPU and memory utilization"
- "Is the database healthy?"
- "Why is my pod crashing?"
- "Analyze application errors in the last hour"

**Example KIRA response:**
```
Root Cause:
Postgres pod exceeded its memory limit and entered CrashLoopBackOff.

Evidence:
- 15 database connection errors in the last hour
- Pod restart count: 6
- Memory utilization: 95% at time of failure

Immediate Fix:
Increase the Postgres pod memory limit.

Prevention:
Add memory-based alerting and horizontal pod autoscaling.
```

---

## 🛠️ Local Development

**Backend**
```bash
npm install
npm run dev
```

**Frontend**
```bash
npm install
npm start
```

**Kubernetes deployment**
```bash
kubectl create namespace knicks
kubectl apply -f kubernetes/
kubectl get pods -n knicks
```

**Useful commands**
```bash
kubectl get svc -n knicks
kubectl get ingress -n knicks
kubectl logs deployment/<service> -n knicks
kubectl rollout restart deployment/<service> -n knicks
```

**Run the AI agent locally**
```bash
cd aiops-assistant
export ANTHROPIC_API_KEY="<your Bedrock API key>"
export AWS_REGION=us-east-1
streamlit run app.py
```

---

## 🩺 Troubleshooting Examples

**Pod not starting**
```bash
kubectl describe pod <pod-name>
```

**Service not accessible**
```bash
kubectl get endpoints -n knicks
```

**Application errors**
```bash
kubectl logs deployment/<service> -n knicks
```

---

## 🔒 Security

- IAM-based AWS access
- Kubernetes namespace isolation
- Private service-to-service communication
- Container isolation
- JWT authentication

---

## 🔮 Future Improvements

- Automated remediation triggered directly by KIRA
- Horizontal Pod Autoscaling (HPA)
- Terraform-managed infrastructure
- Multi-region deployment
- Advanced alerting and on-call integration

---

## 👤 Author

**Chirag Baghra**
Cloud Engineer · DevOps · AIOps

- GitHub: [github.com/chirag-baghra](https://github.com/chirag-baghra)
- Project repository: [github.com/chirag-baghra/AiOPS-Project-Knicks-store](https://github.com/chirag-baghra/AiOPS-Project-Knicks-store)

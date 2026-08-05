#!/usr/bin/env bash
# =============================================================================
# AIOps Assistant — Bedrock Agent Deployment (Qwen3 32B)
#
# Creates:
#   - Amazon Bedrock Agent
#   - Lambda Action Groups
#   - Agent Alias
#
# Required before running:
#   - Lambda functions:
#       aiops-fetch-logs
#       aiops-fetch-metrics
#       aiops-fetch-health
#
#   - IAM Role:
#       aiops-bedrock-agent-role
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh
# =============================================================================

set -euo pipefail


REGION="us-east-1"

ACCOUNT_ID=$(aws sts get-caller-identity \
--query Account \
--output text)

AGENT_NAME="aiops-assistant"

AGENT_ROLE_NAME="aiops-bedrock-agent-role"

# Qwen3 32B
FOUNDATION_MODEL="qwen.qwen3-32b-v1:0"


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"


echo ""
echo "============================================="
echo " AIOps Bedrock Agent Deployment"
echo " Model   : $FOUNDATION_MODEL"
echo " Account : $ACCOUNT_ID"
echo " Region  : $REGION"
echo "============================================="
echo ""


# ---------------------------------------------------------
# Step 0: Checks
# ---------------------------------------------------------

echo "[0/4] Checking prerequisites..."


for FUNC in \
aiops-fetch-logs \
aiops-fetch-metrics \
aiops-fetch-health

do

if ! aws lambda get-function \
--function-name "$FUNC" \
--region "$REGION" >/dev/null 2>&1

then
    echo "ERROR: Lambda $FUNC missing"
    exit 1
fi


echo "✓ Lambda $FUNC"

done



if ! aws iam get-role \
--role-name "$AGENT_ROLE_NAME" >/dev/null 2>&1

then

echo "ERROR: IAM role missing: $AGENT_ROLE_NAME"
exit 1

fi


AGENT_ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$AGENT_ROLE_NAME"


echo "✓ IAM role found"



# ---------------------------------------------------------
# Step 1: Lambda permissions
# ---------------------------------------------------------

echo ""
echo "[1/4] Configuring Lambda permissions"



for FUNC in \
aiops-fetch-logs \
aiops-fetch-metrics \
aiops-fetch-health

do


aws lambda update-function-configuration \
--function-name "$FUNC" \
--timeout 30 \
--region "$REGION" \
>/dev/null



aws lambda add-permission \
--function-name "$FUNC" \
--statement-id "bedrock-agent-${FUNC}" \
--action lambda:InvokeFunction \
--principal bedrock.amazonaws.com \
--region "$REGION" \
2>/dev/null || true



echo "✓ $FUNC"

done



# ---------------------------------------------------------
# Step 2: Create Agent
# ---------------------------------------------------------

echo ""
echo "[2/4] Creating Bedrock Agent"



AGENT_INSTRUCTION='
You are Patrick, a senior Site Reliability Engineer.

You have 12 years of experience managing AWS production systems,
Kubernetes clusters, distributed systems, databases, networking,
and incident response.

You have access to three tools:

1. fetch_logs
   - CloudWatch application logs

2. fetch_metrics
   - CPU, memory, latency, errors

3. fetch_service_health
   - EKS cluster, nodes and pods


Incident response process:

Step 1:
Understand the reported symptom.

Step 2:
Create possible hypotheses.

Step 3:
Collect evidence using tools.

Step 4:
Correlate logs, metrics and service health.

Step 5:
Provide:

- Root cause
- Evidence
- Immediate remediation
- Long-term prevention


Rules:

- Never guess.
- Never invent logs, metrics, pod names or timestamps.
- Always use available evidence.
- If data is unavailable, clearly say so.
'



EXISTING_AGENT_ID=$(aws bedrock-agent list-agents \
--region "$REGION" \
--query "agentSummaries[?agentName=='$AGENT_NAME'].agentId | [0]" \
--output text)



if [[ "$EXISTING_AGENT_ID" != "None" && -n "$EXISTING_AGENT_ID" ]]

then

AGENT_ID="$EXISTING_AGENT_ID"

echo "✓ Existing agent: $AGENT_ID"


else


AGENT_ID=$(aws bedrock-agent create-agent \
--agent-name "$AGENT_NAME" \
--agent-resource-role-arn "$AGENT_ROLE_ARN" \
--foundation-model "$FOUNDATION_MODEL" \
--instruction "$AGENT_INSTRUCTION" \
--region "$REGION" \
--query agent.agentId \
--output text)


echo "✓ Agent created: $AGENT_ID"


fi



# ---------------------------------------------------------
# Step 3: Action Groups
# ---------------------------------------------------------

echo ""
echo "[3/4] Creating action groups"



python <<PYEOF

import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

import boto3

client = boto3.client(
    "bedrock-agent",
    region_name="$REGION"
)

agent_id = "$AGENT_ID"

groups = [
    {
        "name": "fetch_logs",
        "lambda": "aiops-fetch-logs",
        "schema": "fetch_logs.json",
        "description": "Search CloudWatch logs",
    },
    {
        "name": "fetch_metrics",
        "lambda": "aiops-fetch-metrics",
        "schema": "fetch_metrics.json",
        "description": "Retrieve CloudWatch metrics",
    },
    {
        "name": "fetch_service_health",
        "lambda": "aiops-fetch-health",
        "schema": "fetch_health.json",
        "description": "Check EKS health",
    },
]

existing = client.list_agent_action_groups(
    agentId=agent_id,
    agentVersion="DRAFT",
)
existing_names = [
    x["actionGroupName"]
    for x in existing.get("actionGroupSummaries", [])
]

for g in groups:
    if g["name"] in existing_names:
        print("✓ Exists:", g["name"])
        continue

    with open(
        __import__("os").path.join("$SCRIPT_DIR", "schemas", g["schema"])
    ) as f:
        schema = f.read()

    client.create_agent_action_group(
        agentId=agent_id,
        agentVersion="DRAFT",
        actionGroupName=g["name"],
        description=g["description"],
        actionGroupExecutor={
            "lambda": f"arn:aws:lambda:$REGION:$ACCOUNT_ID:function:{g['lambda']}"
        },
        apiSchema={"payload": schema},
    )

    print("✓ Created:", g["name"])

PYEOF



# ---------------------------------------------------------
# Step 4: Prepare + Alias
# ---------------------------------------------------------

echo ""
echo "[4/4] Preparing agent"



aws bedrock-agent prepare-agent \
--agent-id "$AGENT_ID" \
--region "$REGION"



ALIAS_ID=$(aws bedrock-agent create-agent-alias \
--agent-id "$AGENT_ID" \
--agent-alias-name production \
--region "$REGION" \
--query agentAlias.agentAliasId \
--output text)



echo ""
echo "============================================="
echo " Deployment Complete"
echo "============================================="

echo "Agent ID : $AGENT_ID"
echo "Alias ID : $ALIAS_ID"
echo "Model    : $FOUNDATION_MODEL"
echo "Region   : $REGION"

echo ""
echo "Add to .env:"
echo ""
echo "BEDROCK_AGENT_ID=$AGENT_ID"
echo "BEDROCK_AGENT_ALIAS_ID=$ALIAS_ID"
echo ""
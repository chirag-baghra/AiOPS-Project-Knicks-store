# =============================================================================
# AIOps Assistant - Permanent Environment Setup (Windows)
#
# Writes .env, persists the Mantle API key to AWS Secrets Manager, and
# auto-discovers the Bedrock Agent ID + Alias. Re-runnable; idempotent.
#
# Usage (one-time interactive):
#     .\scripts\setup-env.ps1
#
# Usage (non-interactive, CI / future runs):
#     .\scripts\setup-env.ps1 -MantleKey "mle_xxx..."  -Region us-east-1
#     .\scripts\setup-env.ps1 -Region us-east-1          # only re-sync agent IDs
#
# What it does:
#   1. Verifies AWS CLI + PowerShell are reachable.
#   2. Stores MANTLE_API_KEY in Secrets Manager (aiops/mantle-api-key).
#   3. Resolves BEDROCK_AGENT_ID and BEDROCK_AGENT_ALIAS_ID via AWS API.
#   4. Writes a complete .env next to app.py.
#   5. Confirms everything by reading it back.
#
# After first run, .env can be deleted - app.py and ai_agent.py will
# automatically fall back to Secrets Manager for MANTLE_API_KEY.
# =============================================================================

[CmdletBinding()]
param(
    [string]$MantleKey        = "",
    [string]$Region           = "us-east-1",
    [string]$SecretName       = "aiops/mantle-api-key",
    [string]$AgentName        = "aiops-assistant",
    [string]$AliasName        = "production",
    [switch]$SkipMantle       # do not touch Secrets Manager / .env Mantle key
)

$ErrorActionPreference = "Stop"

# -----------------------------------------------------------------------------
# Paths
# -----------------------------------------------------------------------------
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir  = Split-Path -Parent $ScriptDir
$EnvPath     = Join-Path $ProjectDir ".env"
$EnvExample  = Join-Path $ProjectDir ".env.example"

function Write-Step([string]$msg) { Write-Host "" ; Write-Host "[setup-env] $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg)   { Write-Host "  OK   $msg" -ForegroundColor Green }
function Write-Warn([string]$msg) { Write-Host "  WARN $msg" -ForegroundColor Yellow }
function Write-Err([string]$msg)  { Write-Host "  ERR  $msg" -ForegroundColor Red }

# -----------------------------------------------------------------------------
# 1. Prerequisites
# -----------------------------------------------------------------------------
Write-Step "Checking prerequisites..."

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Err "AWS CLI not found in PATH. Install: https://awscli.amazonaws.com/"
    exit 1
}
Write-Ok "aws CLI present"

try {
    $AccountId = aws sts get-caller-identity --query Account --output text 2>$null
    if (-not $AccountId) { throw "empty account" }
    Write-Ok "authenticated as AWS account $AccountId"
} catch {
    Write-Err "AWS CLI not authenticated. Run: aws sso login   (or)   aws configure"
    exit 1
}

# -----------------------------------------------------------------------------
# 2. Mantle key -> Secrets Manager
# -----------------------------------------------------------------------------
$MantleFromSecrets = $false

if (-not $SkipMantle) {
    if ([string]::IsNullOrWhiteSpace($MantleKey)) {
        Write-Step "Reading MANTLE_API_KEY from console (input is hidden)..."
        $secure = Read-Host "  Paste your Mantle bearer token" -AsSecureString
        $bstr   = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
        $MantleKey = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) | Out-Null
    }

    if ([string]::IsNullOrWhiteSpace($MantleKey)) {
        Write-Err "No Mantle key supplied. Pass -MantleKey or run interactively."
        exit 1
    }

    Write-Step "Persisting MANTLE_API_KEY to Secrets Manager at '$SecretName'..."

    $jsonBody = @{ MANTLE_API_KEY = $MantleKey } | ConvertTo-Json -Compress

    $secretExists = $false
    try {
        $null = aws secretsmanager describe-secret --secret-id $SecretName --region $Region 2>&1
        if ($LASTEXITCODE -eq 0) { $secretExists = $true }
    } catch { }

    if ($secretExists) {
        aws secretsmanager put-secret-value `
            --secret-id    $SecretName `
            --secret-string $jsonBody `
            --region       $Region | Out-Null
        Write-Ok "Secret updated: $SecretName"
    } else {
        aws secretsmanager create-secret `
            --name         $SecretName `
            --secret-string $jsonBody `
            --region       $Region `
            --description  "Mantle bearer token for KIRA AIOps assistant" | Out-Null
        Write-Ok "Secret created: $SecretName"
    }

    $MantleKey = $null
    [System.GC]::Collect()
} else {
    Write-Warn "SkipMantle set - Secrets Manager will not be touched"
    try {
        $null = aws secretsmanager describe-secret --secret-id $SecretName --region $Region 2>&1
        if ($LASTEXITCODE -eq 0) {
            $MantleFromSecrets = $true
            Write-Ok "Found existing secret: $SecretName (will skip env var in .env)"
        } else {
            Write-Warn "SkipMantle set but secret '$SecretName' does not exist; .env Mantle key will be blank"
        }
    } catch {
        Write-Warn "SkipMantle set but secret '$SecretName' does not exist; .env Mantle key will be blank"
    }
}

# -----------------------------------------------------------------------------
# 3. Discover Bedrock Agent + Alias IDs
# -----------------------------------------------------------------------------
Write-Step "Resolving Bedrock Agent '$AgentName' in $Region..."

# IMPORTANT: single-quoted strings here, otherwise PowerShell tries to
# type-cast the JMESPath [?...] brackets.
$agentQuery = "agentSummaries[?agentName=='$AgentName'].agentId | [0]"

$agentId = aws bedrock-agent list-agents `
    --region $Region `
    --query $agentQuery `
    --output text 2>$null

if ([string]::IsNullOrWhiteSpace($agentId) -or $agentId -eq "None") {
    Write-Warn "No Bedrock Agent named '$AgentName' found. Run deploy.sh first."
    Write-Warn "Writing placeholder. Edit .env later or re-run this script."
    $agentId  = ""
    $aliasId  = "TSTALIASID"
} else {
    Write-Ok "Agent ID : $agentId"
    $aliasQuery = "agentAliasSummaries[?agentAliasName=='$AliasName'].agentAliasId | [0]"
    $aliasId = aws bedrock-agent list-agent-aliases `
        --agent-id $agentId `
        --region   $Region `
        --query    $aliasQuery `
        --output   text 2>$null

    if ([string]::IsNullOrWhiteSpace($aliasId) -or $aliasId -eq "None") {
        Write-Warn "Alias '$AliasName' not found for agent $agentId. Defaulting to TSTALIASID."
        $aliasId = "TSTALIASID"
    } else {
        Write-Ok "Alias ID : $aliasId"
    }
}

# -----------------------------------------------------------------------------
# 4. Write .env
# -----------------------------------------------------------------------------
Write-Step "Writing .env to $EnvPath..."

$existing = @{}
if (Test-Path $EnvPath) {
    Get-Content $EnvPath | ForEach-Object {
        if ($_ -match '^\s*([^=#]+?)\s*=\s*(.*?)\s*$') {
            $existing[$Matches[1]] = $Matches[2]
        }
    }
}

function Get-EnvValue([string]$key, [string]$default = "") {
    if ($existing.ContainsKey($key) -and -not [string]::IsNullOrWhiteSpace($existing[$key])) {
        return $existing[$key]
    }
    return $default
}

# Always leave MANTLE_API_KEY blank in .env - the canonical source is Secrets Manager.
$mantleLine = ""

$lines = @(
    "# Generated by scripts/setup-env.ps1 on $(Get-Date -Format o)"
    "# Mantle bearer token: stored in AWS Secrets Manager '$SecretName'."
    "# This file is a fallback - the app reads Secrets Manager first."
    ""
    "AWS_REGION=$Region"
    "BEDROCK_AGENT_ID=$agentId"
    "BEDROCK_AGENT_ALIAS_ID=$aliasId"
    "MANTLE_API_KEY=$mantleLine"
    ""
    "# Optional: only needed if NOT using ~/.aws/credentials, SSO, or IAM role."
    "# Leave blank to use the default AWS credential provider chain."
    "AWS_ACCESS_KEY_ID=$(Get-EnvValue 'AWS_ACCESS_KEY_ID')"
    "AWS_SECRET_ACCESS_KEY=$(Get-EnvValue 'AWS_SECRET_ACCESS_KEY')"
    "AWS_SESSION_TOKEN=$(Get-EnvValue 'AWS_SESSION_TOKEN')"
    ""
)

if (Test-Path $EnvPath) {
    $backup = "$EnvPath.bak.$(Get-Date -Format yyyyMMddHHmmss)"
    Move-Item $EnvPath $backup -Force
    Write-Ok "Backed up previous .env to $backup"
}

Set-Content -Path $EnvPath -Value $lines -Encoding UTF8
Write-Ok ".env written"

# -----------------------------------------------------------------------------
# 5. Verify
# -----------------------------------------------------------------------------
Write-Step "Verifying..."

if (-not (Test-Path $EnvExample)) {
    Write-Warn ".env.example missing - future re-runs may not have a template"
}

$readBack = Get-Content $EnvPath | Where-Object { $_ -match '^[A-Z]' }
$ok = $true
foreach ($k in @("AWS_REGION", "BEDROCK_AGENT_ALIAS_ID")) {
    if (-not ($readBack -match "^$k=")) {
        Write-Warn "Missing key in .env: $k"
        $ok = $false
    }
}
if ($ok) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "  READY - start the UI with:"               -ForegroundColor Green
    Write-Host "     streamlit run app.py"                  -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
} else {
    Write-Err ".env is incomplete. Edit $EnvPath and re-run."
    exit 1
}
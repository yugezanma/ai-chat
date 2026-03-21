#!/bin/bash
# GCP Cloud Run 初期セットアップスクリプト
# 実行前に: gcloud auth login && gcloud config set project YOUR_PROJECT_ID

set -e

PROJECT_ID=$(gcloud config get-value project)
REGION="asia-northeast1"
SERVICE_NAME="ai-chat"
REPO_NAME="ai-chat"

echo "=== GCP セットアップ開始 ==="
echo "Project: $PROJECT_ID / Region: $REGION"

# 必要な API を有効化
echo "→ API を有効化..."
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com

# Artifact Registry リポジトリ作成
echo "→ Artifact Registry を作成..."
gcloud artifacts repositories create $REPO_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="AI Chat Docker images" \
  --quiet 2>/dev/null || echo "  (既存のリポジトリを使用)"

# Secret Manager にシークレットを登録
echo "→ Secret Manager にシークレットを登録..."

echo "ANTHROPIC_API_KEY を入力してください:"
read -s ANTHROPIC_API_KEY
echo -n "$ANTHROPIC_API_KEY" | gcloud secrets create ANTHROPIC_API_KEY \
  --data-file=- --replication-policy=automatic 2>/dev/null || \
  echo -n "$ANTHROPIC_API_KEY" | gcloud secrets versions add ANTHROPIC_API_KEY --data-file=-

echo "DATABASE_URL を入力してください:"
read -s DATABASE_URL
echo -n "$DATABASE_URL" | gcloud secrets create DATABASE_URL \
  --data-file=- --replication-policy=automatic 2>/dev/null || \
  echo -n "$DATABASE_URL" | gcloud secrets versions add DATABASE_URL --data-file=-

# Cloud Run サービスアカウントに Secret アクセス権を付与
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "→ サービスアカウント ($SA) に Secret へのアクセス権を付与..."
for SECRET in ANTHROPIC_API_KEY DATABASE_URL; do
  gcloud secrets add-iam-policy-binding $SECRET \
    --member="serviceAccount:$SA" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet
done

echo ""
echo "=== セットアップ完了 ==="
echo ""
echo "次のステップ:"
echo "1. GitHub リポジトリの Settings → Secrets に以下を追加:"
echo "   - GCP_PROJECT_ID: $PROJECT_ID"
echo "   - GCP_WORKLOAD_IDENTITY_PROVIDER: (Workload Identity Pool のプロバイダーURL)"
echo "   - GCP_SERVICE_ACCOUNT: $SA"
echo ""
echo "2. main ブランチに push すると自動デプロイが実行されます"

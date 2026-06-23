# ArbVision-AI Deployment Guide

## Prerequisites

- Python 3.9+
- Node.js 16+
- Docker & Docker Compose
- Kubernetes cluster (for production)
- PostgreSQL 12+
- Redis 6.0+

## Local Development Deployment

### 1. Clone Repository
```bash
git clone https://github.com/PAYEXTRA/ArbVision-AI.git
cd ArbVision-AI
```

### 2. Set Up Environment
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Initialize Database
```bash
python scripts/init_db.py
```

### 5. Run Application
```bash
python -m arbvision.main
```

## Docker Deployment

### Build Image
```bash
docker build -f docker/Dockerfile -t arbvision-ai:latest .
```

### Run Container
```bash
docker run -d \
  --name arbvision \
  -p 8000:8000 \
  -e ETHEREUM_RPC_URL=$ETHEREUM_RPC_URL \
  -e PRIVATE_KEY=$PRIVATE_KEY \
  --env-file .env \
  arbvision-ai:latest
```

### Docker Compose Setup
```bash
docker-compose -f docker/docker-compose.yml up -d
```

**docker-compose.yml** includes:
- API service
- Worker services
- PostgreSQL database
- Redis cache
- Prometheus monitoring

## Kubernetes Deployment

### 1. Create Namespace
```bash
kubectl create namespace arbvision
```

### 2. Create Secrets
```bash
kubectl create secret generic arbvision-secrets \
  --from-literal=private_key=$PRIVATE_KEY \
  --from-literal=ethereum_rpc_url=$ETHEREUM_RPC_URL \
  -n arbvision
```

### 3. Deploy Services
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/database.yaml
kubectl apply -f k8s/cache.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/worker-deployment.yaml
kubectl apply -f k8s/service.yaml
```

### 4. Verify Deployment
```bash
kubectl get pods -n arbvision
kubectl logs -n arbvision deployment/api
```

### 5. Expose Service
```bash
kubectl expose deployment api \
  --type=LoadBalancer \
  --port=80 \
  --target-port=8000 \
  -n arbvision
```

## Cloud Platform Deployments

### AWS Deployment

#### Using ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

docker tag arbvision-ai:latest $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/arbvision:latest
docker push $AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/arbvision:latest

# Deploy using CloudFormation or AWS Console
```

#### Using Lambda
```bash
# For serverless deployment
serverless deploy
```

### Google Cloud Deployment

#### Using Cloud Run
```bash
gcloud run deploy arbvision \
  --image gcr.io/PROJECT_ID/arbvision-ai \
  --platform managed \
  --region us-central1 \
  --set-env-vars ETHEREUM_RPC_URL=$ETHEREUM_RPC_URL
```

#### Using GKE
```bash
gcloud container clusters create arbvision-cluster \
  --zone us-central1-a \
  --num-nodes 3

kubectl apply -f k8s/
```

### Heroku Deployment

```bash
heroku login
heroku create arbvision-ai
git push heroku main
```

## Production Configuration

### Environment Variables
```env
# Core Configuration
ENVIRONMENT=production
LOG_LEVEL=INFO
DEBUG=False

# Blockchain
ETHEREUM_RPC_URL=wss://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
POLYGON_RPC_URL=wss://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
ARBITRUM_RPC_URL=wss://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Security
PRIVATE_KEY=your_encrypted_key
API_KEY_SECRET=your_secret_key

# Database
DATABASE_URL=postgresql://user:password@db-server:5432/arbvision
DATABASE_POOL_SIZE=20

# Cache
REDIS_URL=redis://cache-server:6379/0

# Trading
MAX_POSITION_SIZE=1000000
SLIPPAGE_TOLERANCE=0.5
MIN_PROFIT_THRESHOLD=100

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
DATADOG_API_KEY=your_datadog_key
```

## Monitoring & Logging

### Prometheus Metrics
```bash
# Access metrics at http://localhost:9090
# Metrics include: trades executed, profit, gas fees, errors
```

### ELK Stack
```bash
# Deploy ELK with Docker Compose
docker-compose -f monitoring/docker-compose.yml up
# Access Kibana at http://localhost:5601
```

### Grafana Dashboards
```bash
# Pre-built dashboards available in grafana/dashboards/
# Import via UI or API
```

## Security Hardening

### 1. Network Security
```yaml
# Restrict ingress to API gateway only
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: restrict-traffic
spec:
  podSelector: {}
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress
```

### 2. Secret Management
```bash
# Use Vault for secret management
vault write secret/arbvision \
  private_key=$PRIVATE_KEY \
  api_key=$API_KEY
```

### 3. SSL/TLS Configuration
```bash
# Use Let's Encrypt with cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.0.0/cert-manager.yaml
```

### 4. Rate Limiting
```yaml
# Configure rate limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=60
```

## Scaling

### Horizontal Scaling
```bash
# Scale API deployment
kubectl scale deployment api --replicas=5 -n arbvision

# Scale workers
kubectl scale deployment worker --replicas=10 -n arbvision
```

### Auto-scaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-autoscaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Backup & Recovery

### Database Backup
```bash
# PostgreSQL backup
pg_dump -U postgres arbvision > backup.sql

# AWS RDS backup
aws rds create-db-snapshot \
  --db-instance-identifier arbvision \
  --db-snapshot-identifier arbvision-backup-$(date +%Y%m%d)
```

### Recovery
```bash
# Restore from backup
psql -U postgres arbvision < backup.sql
```

## Disaster Recovery

### RTO & RPO Targets
- **RTO (Recovery Time Objective)**: < 15 minutes
- **RPO (Recovery Point Objective)**: < 5 minutes

### Multi-Region Setup
```bash
# Deploy to multiple regions for redundancy
# Use CloudFront or similar for failover
```

## Health Checks

### Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
```

### Readiness Probe
```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 5
```

## Rollback Procedures

```bash
# Check deployment history
kubectl rollout history deployment/api -n arbvision

# Rollback to previous version
kubectl rollout undo deployment/api -n arbvision

# Rollback to specific revision
kubectl rollout undo deployment/api --to-revision=2 -n arbvision
```

## Cost Optimization

- Use spot instances for non-critical workloads
- Implement resource quotas
- Use auto-scaling to match demand
- Cache responses appropriately
- Optimize database queries

## Support & Troubleshooting

- Check logs: `kubectl logs -n arbvision deployment/api`
- Describe pod: `kubectl describe pod <pod-name> -n arbvision`
- Port forward: `kubectl port-forward svc/api 8000:8000 -n arbvision`

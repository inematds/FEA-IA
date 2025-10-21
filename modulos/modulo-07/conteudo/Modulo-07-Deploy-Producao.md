# Módulo 7: Deploy e Produção

## Levando Agentes de IA para o Mundo Real

> "Em desenvolvimento, tudo funciona. Em produção, tudo o que pode dar errado, dará errado. Prepare-se." - Lei de Murphy aplicada a sistemas de produção

---

## 📋 Índice

1. [Introdução ao Deploy em Produção](#71-introdução-ao-deploy-em-produção)
2. [Arquitetura para Produção](#72-arquitetura-para-produção)
3. [Containerização com Docker](#73-containerização-com-docker)
4. [Orquestração com Kubernetes](#74-orquestração-com-kubernetes)
5. [Deploy em Cloud Providers](#75-deploy-em-cloud-providers)
6. [Monitoramento e Observabilidade](#76-monitoramento-e-observabilidade)
7. [Performance e Otimização](#77-performance-e-otimização)
8. [Custos e Otimização Financeira](#78-custos-e-otimização-financeira)
9. [Segurança em Produção](#79-segurança-em-produção)
10. [CI/CD para Sistemas de Agentes](#710-cicd-para-sistemas-de-agentes)
11. [Projeto Prático: Deploy Completo](#711-projeto-prático)
12. [Resumo e Próximos Passos](#712-resumo-e-próximos-passos)

---

## 7.1 Introdução ao Deploy em Produção

### 7.1.1 O Que Significa "Produção"?

**Produção** é o ambiente onde seu sistema de agentes atende usuários reais, processando dados reais, com consequências reais.

**Diferenças fundamentais:**

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| **Escala** | 1-10 requisições/dia | 1.000-1.000.000+ req/dia |
| **Disponibilidade** | Pode cair sem problema | 99.9%+ uptime necessário |
| **Dados** | Dados de teste/mock | Dados sensíveis de clientes |
| **Custos** | Mínimos | Podem ser significativos |
| **Segurança** | Básica | Crítica |
| **Monitoramento** | Opcional | Essencial |
| **Recuperação** | Manual | Automática |

### 7.1.2 Desafios Únicos de Agentes de IA em Produção

**1. Não-determinismo**

```python
# ❌ PROBLEMA: Mesmo input pode gerar outputs diferentes
response1 = agent.run("Analise este relatório")
response2 = agent.run("Analise este relatório")
# response1 != response2 (em alguns casos isso é problemático)

# ✅ SOLUÇÃO: Use temperature=0 para tarefas que precisam de consistência
agent = Agent(
    model="claude-3-7-sonnet-20250219",
    temperature=0  # Máxima determinismo
)
```

**2. Latência Variável**

```python
# Agentes podem levar de 1s a 60s+ dependendo da complexidade
# Isso requer:
- Timeouts apropriados
- Async processing para operações longas
- Feedback de progresso para o usuário
- Circuit breakers para evitar cascading failures
```

**3. Custos Variáveis**

```python
# Cada chamada ao LLM tem custo
# Exemplo: 1M tokens com Claude Sonnet = ~$3-15 USD
# Sistema com 10k usuários pode gerar custos significativos

# Estratégias de controle:
- Cache de respostas comuns
- Rate limiting por usuário
- Monitoramento de custos em tempo real
- Fallback para modelos mais baratos quando apropriado
```

**4. Dependências Externas**

```python
# Agentes dependem de:
- APIs de LLMs (Anthropic, OpenAI, etc.) - podem ter outages
- Servidores MCP - podem falhar
- Bancos de dados - podem ficar lentos
- APIs de terceiros - podem ter rate limits

# Requer:
- Retry logic robusto
- Graceful degradation
- Fallback strategies
```

### 7.1.3 Checklist de Produção

Antes de fazer deploy, garanta que você tem:

**Funcional:**
- [ ] Testes unitários passando (>80% coverage)
- [ ] Testes de integração passando
- [ ] Testes de carga realizados
- [ ] Tratamento de erros robusto
- [ ] Logging estruturado
- [ ] Métricas instrumentadas

**Infraestrutura:**
- [ ] Containerização (Docker)
- [ ] Orquestração (Kubernetes/ECS/Cloud Run)
- [ ] Load balancer configurado
- [ ] Auto-scaling configurado
- [ ] Health checks implementados

**Segurança:**
- [ ] Autenticação e autorização
- [ ] Secrets em variáveis de ambiente (não hardcoded)
- [ ] HTTPS configurado
- [ ] Rate limiting implementado
- [ ] Validação de inputs

**Observabilidade:**
- [ ] Logs centralizados
- [ ] Métricas (latência, throughput, erros)
- [ ] Dashboards
- [ ] Alertas configurados
- [ ] Distributed tracing

**Operacional:**
- [ ] Runbooks documentados
- [ ] Plano de rollback
- [ ] Backup e recovery testados
- [ ] Monitoramento de custos
- [ ] On-call rotation definida

---

## 7.2 Arquitetura para Produção

### 7.2.1 Arquitetura de Referência

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                               │
│  │   Internet   │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────────────┐                                       │
│  │   Load Balancer      │  ◄─── Health Checks                  │
│  │   (HTTPS, WAF)       │                                       │
│  └──────────┬───────────┘                                       │
│             │                                                   │
│     ┌───────┴────────┐                                          │
│     │                │                                          │
│     ▼                ▼                                          │
│  ┌─────┐        ┌─────┐        ┌─────┐                         │
│  │ API │        │ API │        │ API │  ◄─── Auto-scaling      │
│  │ Pod │        │ Pod │        │ Pod │                          │
│  └──┬──┘        └──┬──┘        └──┬──┘                         │
│     │              │              │                            │
│     └──────────────┴──────────────┘                            │
│                    │                                            │
│         ┌──────────┼──────────┐                                │
│         │          │          │                                │
│         ▼          ▼          ▼                                │
│  ┌──────────┐ ┌─────────┐ ┌──────────┐                        │
│  │ Agent    │ │ Cache   │ │ Message  │                        │
│  │ Workers  │ │ (Redis) │ │ Queue    │                        │
│  └────┬─────┘ └─────────┘ └────┬─────┘                        │
│       │                         │                              │
│       └─────────────┬───────────┘                              │
│                     │                                          │
│         ┌───────────┼───────────┐                              │
│         │           │           │                              │
│         ▼           ▼           ▼                              │
│  ┌──────────┐ ┌─────────┐ ┌──────────┐                        │
│  │ Database │ │ LLM API │ │   MCP    │                        │
│  │(Postgres)│ │(Claude) │ │ Servers  │                        │
│  └──────────┘ └─────────┘ └──────────┘                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         OBSERVABILITY LAYER                             │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐   │   │
│  │  │ Logging │  │ Metrics │  │ Tracing │  │ Alerting │   │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └──────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2.2 Padrões Arquiteturais

**1. Padrão: API Gateway + Workers**

```python
# API Gateway (FastAPI) - recebe requisições HTTP
from fastapi import FastAPI, BackgroundTasks
from celery import Celery

app = FastAPI()
celery_app = Celery('tasks', broker='redis://localhost:6379')

@app.post("/api/analyze")
async def analyze_document(
    file_url: str,
    background_tasks: BackgroundTasks
):
    # Criar tarefa assíncrona
    task = celery_app.send_task(
        'analyze_document',
        args=[file_url]
    )

    return {
        "task_id": task.id,
        "status": "processing"
    }

@app.get("/api/status/{task_id}")
async def get_status(task_id: str):
    task = celery_app.AsyncResult(task_id)

    return {
        "task_id": task_id,
        "status": task.status,
        "result": task.result if task.ready() else None
    }

# Worker (Celery) - processa tarefas
@celery_app.task(name='analyze_document')
def analyze_document(file_url: str):
    # Processar com agente
    from agno import Agent

    agent = Agent(
        name="Document Analyzer",
        model="claude-3-7-sonnet-20250219"
    )

    result = agent.run(f"Analyze the document at {file_url}")

    return result
```

**Vantagens:**
- API responde rapidamente (não espera processamento)
- Workers podem escalar independentemente
- Tarefas longas não bloqueiam API
- Retry automático de tarefas falhas

**2. Padrão: Event-Driven Architecture**

```python
# Publisher - publica eventos
from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Quando novo documento é enviado
def on_document_upload(document_id: str):
    event = {
        "event_type": "document_uploaded",
        "document_id": document_id,
        "timestamp": datetime.utcnow().isoformat()
    }

    producer.send('documents', value=event)

# Consumer - processa eventos
from kafka import KafkaConsumer

consumer = KafkaConsumer(
    'documents',
    bootstrap_servers=['localhost:9092'],
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    event = message.value

    if event['event_type'] == 'document_uploaded':
        # Processar com agente
        process_document(event['document_id'])
```

**Vantagens:**
- Desacoplamento total entre componentes
- Fácil adicionar novos consumers
- Replay de eventos para debugging
- Escalabilidade horizontal

**3. Padrão: Circuit Breaker**

```python
from pybreaker import CircuitBreaker

# Proteger chamadas à API do LLM
llm_breaker = CircuitBreaker(
    fail_max=5,        # Abrir após 5 falhas consecutivas
    timeout_duration=60  # Fechar após 60s
)

@llm_breaker
def call_llm(prompt: str):
    """Chama LLM com proteção de circuit breaker"""
    response = anthropic.messages.create(
        model="claude-3-7-sonnet-20250219",
        messages=[{"role": "user", "content": prompt}]
    )
    return response

# Uso
try:
    result = call_llm("Analyze this data...")
except CircuitBreakerError:
    # Circuit está aberto - usar fallback
    result = use_cached_response() or use_simpler_model()
```

### 7.2.3 Stateless vs Stateful

**Stateless (Recomendado para APIs):**

```python
# ✅ BOM: Agente sem estado persistente
@app.post("/api/chat")
async def chat(message: str, session_id: str):
    # Buscar contexto do Redis/DB
    context = await redis.get(f"session:{session_id}")

    # Processar
    agent = Agent(model="claude-3-7-sonnet-20250219")
    response = agent.run(message, context=context)

    # Salvar novo contexto
    await redis.set(f"session:{session_id}", new_context)

    return {"response": response}
```

**Vantagens:**
- Fácil escalar horizontalmente
- Qualquer pod pode atender qualquer requisição
- Load balancer pode distribuir livremente
- Simples fazer rolling updates

**Stateful (Quando necessário):**

```python
# Agente com estado interno (sessão WebSocket)
class StatefulAgent:
    def __init__(self):
        self.conversation_history = []
        self.context = {}

    async def handle_message(self, message: str):
        # Processar com contexto interno
        self.conversation_history.append(message)
        # ...

# Requer sticky sessions no load balancer
```

---

## 7.3 Containerização com Docker

### 7.3.1 Dockerfile para Agente de IA

**Dockerfile otimizado:**

```dockerfile
# Usar imagem base Python slim
FROM python:3.11-slim

# Metadados
LABEL maintainer="seu-email@exemplo.com"
LABEL version="1.0"
LABEL description="Agent API Service"

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema (mínimas)
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro (cache layer)
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar usuário não-root
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expor porta
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Comando de início
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**requirements.txt:**

```
fastapi==0.109.0
uvicorn[standard]==0.27.0
agno==0.1.0
anthropic==0.18.0
pydantic==2.6.0
redis==5.0.1
celery==5.3.6
prometheus-client==0.19.0
python-json-logger==2.0.7
```

### 7.3.2 Multi-Stage Build

Para imagens menores:

```dockerfile
# Stage 1: Builder
FROM python:3.11 as builder

WORKDIR /app

COPY requirements.txt .

# Instalar dependências em um virtualenv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Copiar virtualenv do builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copiar código
COPY . .

# Usuário não-root
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Resultado:**
- Imagem final: ~200MB (vs ~1GB sem multi-stage)
- Sem ferramentas de build desnecessárias
- Mais seguro

### 7.3.3 Docker Compose para Desenvolvimento Local

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  # API Principal
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - DATABASE_URL=postgresql://user:pass@db:5432/agentdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./app:/app/app  # Hot reload em dev
    command: uvicorn main:app --host 0.0.0.0 --reload

  # Worker Celery
  worker:
    build: .
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - DATABASE_URL=postgresql://user:pass@db:5432/agentdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
      - db
    command: celery -A tasks worker --loglevel=info

  # Banco de Dados
  db:
    image: postgres:16
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=agentdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis (Cache + Message Broker)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Prometheus (Métricas)
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  # Grafana (Dashboards)
  grafana:
    image: grafana/grafana:latest
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3000:3000"

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:
```

**Comandos úteis:**

```bash
# Subir todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Escalar workers
docker-compose up -d --scale worker=5

# Parar tudo
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build
```

### 7.3.4 Boas Práticas Docker

**1. .dockerignore**

```
# .dockerignore
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.gitignore
.mypy_cache
.pytest_cache
.hypothesis
*.db
*.sqlite
```

**2. Cache de Layers**

```dockerfile
# ❌ RUIM - invalida cache toda vez que código muda
COPY . .
RUN pip install -r requirements.txt

# ✅ BOM - cache de dependências preservado
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

**3. Imagens Específicas**

```dockerfile
# ❌ RUIM
FROM python:latest

# ✅ BOM - versão específica
FROM python:3.11.7-slim
```

---

## 7.4 Orquestração com Kubernetes

### 7.4.1 Manifesto Kubernetes Básico

**deployment.yaml:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-api
  labels:
    app: agent-api
spec:
  replicas: 3  # 3 pods para alta disponibilidade
  selector:
    matchLabels:
      app: agent-api
  template:
    metadata:
      labels:
        app: agent-api
    spec:
      containers:
      - name: api
        image: your-registry/agent-api:v1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: anthropic-api-key
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: agent-api-service
spec:
  selector:
    app: agent-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer

---
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
type: Opaque
stringData:
  anthropic-api-key: "sk-ant-..."
  database-url: "postgresql://..."
```

### 7.4.2 Horizontal Pod Autoscaling

**hpa.yaml:**

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: agent-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: agent-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
      - type: Pods
        value: 2
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 25
        periodSeconds: 60
```

### 7.4.3 ConfigMap para Configurações

**configmap.yaml:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-config
data:
  config.yaml: |
    agent:
      model: "claude-3-7-sonnet-20250219"
      temperature: 0.7
      max_tokens: 4096

    cache:
      enabled: true
      ttl: 3600

    rate_limit:
      requests_per_minute: 60
      burst_size: 10

    logging:
      level: "INFO"
      format: "json"
```

**Usar no Deployment:**

```yaml
spec:
  containers:
  - name: api
    # ...
    volumeMounts:
    - name: config
      mountPath: /app/config
  volumes:
  - name: config
    configMap:
      name: agent-config
```

### 7.4.4 StatefulSet para Workers com Estado

**statefulset.yaml:**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: agent-worker
spec:
  serviceName: "agent-worker"
  replicas: 3
  selector:
    matchLabels:
      app: agent-worker
  template:
    metadata:
      labels:
        app: agent-worker
    spec:
      containers:
      - name: worker
        image: your-registry/agent-worker:v1.0.0
        volumeMounts:
        - name: worker-storage
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: worker-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

### 7.4.5 Comandos Úteis Kubernetes

```bash
# Aplicar manifests
kubectl apply -f deployment.yaml

# Ver status dos pods
kubectl get pods

# Ver logs de um pod
kubectl logs -f agent-api-5d7c8f9b4-xkj2m

# Escalar manualmente
kubectl scale deployment agent-api --replicas=5

# Ver eventos
kubectl get events --sort-by=.metadata.creationTimestamp

# Executar comando em pod
kubectl exec -it agent-api-5d7c8f9b4-xkj2m -- /bin/bash

# Port forward para debugging
kubectl port-forward svc/agent-api-service 8000:80

# Deletar recursos
kubectl delete -f deployment.yaml
```

---

## 7.5 Deploy em Cloud Providers

### 7.5.1 AWS (Amazon Web Services)

**Opção 1: AWS ECS (Elastic Container Service)**

```bash
# 1. Build e push para ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

docker build -t agent-api .
docker tag agent-api:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/agent-api:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/agent-api:latest

# 2. Criar task definition
cat > task-definition.json <<EOF
{
  "family": "agent-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/agent-api:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "ANTHROPIC_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT:secret:anthropic-api-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/agent-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition.json

# 3. Criar serviço
aws ecs create-service \
  --cluster my-cluster \
  --service-name agent-api \
  --task-definition agent-api \
  --desired-count 3 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

**Opção 2: AWS Lambda (para cargas menores)**

```python
# lambda_handler.py
import json
from agno import Agent

agent = Agent(
    name="Lambda Agent",
    model="claude-3-7-sonnet-20250219"
)

def lambda_handler(event, context):
    """Handler para AWS Lambda"""

    # Extrair input do evento
    body = json.loads(event['body'])
    user_message = body['message']

    # Processar com agente
    response = agent.run(user_message)

    # Retornar resposta
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'response': response
        })
    }
```

**Deploy Lambda:**

```bash
# 1. Criar pacote de deployment
pip install -r requirements.txt -t package/
cp lambda_handler.py package/
cd package
zip -r ../lambda-package.zip .

# 2. Criar função Lambda
aws lambda create-function \
  --function-name agent-api \
  --runtime python3.11 \
  --role arn:aws:iam::ACCOUNT:role/lambda-execution-role \
  --handler lambda_handler.lambda_handler \
  --zip-file fileb://../lambda-package.zip \
  --timeout 60 \
  --memory-size 1024 \
  --environment Variables={ANTHROPIC_API_KEY=sk-ant-...}

# 3. Criar API Gateway
aws apigatewayv2 create-api \
  --name agent-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:ACCOUNT:function:agent-api
```

### 7.5.2 Google Cloud Platform (GCP)

**Cloud Run (Recomendado para começar):**

```bash
# 1. Build com Cloud Build
gcloud builds submit --tag gcr.io/PROJECT_ID/agent-api

# 2. Deploy no Cloud Run
gcloud run deploy agent-api \
  --image gcr.io/PROJECT_ID/agent-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production \
  --set-secrets=ANTHROPIC_API_KEY=anthropic-key:latest \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --concurrency 80
```

**Cloud Functions (para funções simples):**

```python
# main.py
import functions_framework
from agno import Agent

@functions_framework.http
def agent_endpoint(request):
    """Cloud Function endpoint"""

    request_json = request.get_json(silent=True)

    if not request_json or 'message' not in request_json:
        return {'error': 'Invalid request'}, 400

    agent = Agent(model="claude-3-7-sonnet-20250219")
    response = agent.run(request_json['message'])

    return {'response': response}, 200
```

**Deploy:**

```bash
gcloud functions deploy agent-endpoint \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars ANTHROPIC_API_KEY=sk-ant-... \
  --memory 1024MB \
  --timeout 60s
```

### 7.5.3 Azure

**Azure Container Instances:**

```bash
# 1. Login no Azure Container Registry
az acr login --name myregistry

# 2. Build e push
docker build -t agent-api .
docker tag agent-api myregistry.azurecr.io/agent-api:v1
docker push myregistry.azurecr.io/agent-api:v1

# 3. Deploy no ACI
az container create \
  --resource-group my-resource-group \
  --name agent-api \
  --image myregistry.azurecr.io/agent-api:v1 \
  --cpu 1 \
  --memory 1 \
  --registry-login-server myregistry.azurecr.io \
  --registry-username myregistry \
  --registry-password PASSWORD \
  --dns-name-label agent-api-demo \
  --ports 8000 \
  --environment-variables ANTHROPIC_API_KEY=sk-ant-...
```

**Azure Functions:**

```python
# __init__.py
import logging
import azure.functions as func
from agno import Agent

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processing request')

    message = req.params.get('message')
    if not message:
        try:
            req_body = req.get_json()
            message = req_body.get('message')
        except ValueError:
            pass

    if message:
        agent = Agent(model="claude-3-7-sonnet-20250219")
        response = agent.run(message)

        return func.HttpResponse(
            body=response,
            status_code=200
        )
    else:
        return func.HttpResponse(
            "Please provide a message",
            status_code=400
        )
```

### 7.5.4 Comparação de Cloud Providers

| Critério | AWS | GCP | Azure |
|----------|-----|-----|-------|
| **Facilidade** | Média | Alta | Média |
| **Custo** | $$$ | $$ | $$$ |
| **Serverless** | Lambda | Cloud Run/Functions | Functions |
| **Containers** | ECS/EKS | Cloud Run/GKE | ACI/AKS |
| **Free Tier** | Limitado | Generoso | Limitado |
| **Melhor para** | Enterprise | Startups/Desenvolvedores | Empresas Microsoft |

**Recomendação:**
- **Iniciantes**: GCP Cloud Run (mais simples)
- **Enterprise**: AWS ECS/EKS (mais maduro)
- **Microsoft Shop**: Azure (integração)

---

## 7.6 Monitoramento e Observabilidade

### 7.6.1 Os Três Pilares da Observabilidade

**1. Logs** - O que aconteceu
**2. Métricas** - Quão bem está funcionando
**3. Traces** - Como as requisições fluem

### 7.6.2 Logging Estruturado

**Implementação:**

```python
import logging
from pythonjsonlogger import jsonlogger
import sys

# Configurar logger estruturado
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Handler JSON
logHandler = logging.StreamHandler(sys.stdout)
formatter = jsonlogger.JsonFormatter(
    '%(timestamp)s %(level)s %(name)s %(message)s'
)
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

# Uso
logger.info(
    "Agent request processed",
    extra={
        "user_id": "user123",
        "agent_name": "document_analyzer",
        "duration_ms": 1234,
        "tokens_used": 456,
        "cost_usd": 0.012
    }
)
```

**Output:**

```json
{
  "timestamp": "2025-01-15T10:30:45.123Z",
  "level": "INFO",
  "name": "agent_api",
  "message": "Agent request processed",
  "user_id": "user123",
  "agent_name": "document_analyzer",
  "duration_ms": 1234,
  "tokens_used": 456,
  "cost_usd": 0.012
}
```

**Centralização de Logs:**

```yaml
# Fluentd config para enviar logs para Elasticsearch
<source>
  @type forward
  port 24224
</source>

<match **>
  @type elasticsearch
  host elasticsearch
  port 9200
  logstash_format true
  logstash_prefix agent-logs
</match>
```

### 7.6.3 Métricas com Prometheus

**Instrumentação:**

```python
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# Definir métricas
agent_requests_total = Counter(
    'agent_requests_total',
    'Total de requisições ao agente',
    ['agent_name', 'status']
)

agent_request_duration_seconds = Histogram(
    'agent_request_duration_seconds',
    'Duração das requisições ao agente',
    ['agent_name']
)

agent_tokens_used_total = Counter(
    'agent_tokens_used_total',
    'Total de tokens consumidos',
    ['agent_name', 'model']
)

agent_cost_usd_total = Counter(
    'agent_cost_usd_total',
    'Custo total em USD',
    ['agent_name']
)

active_requests = Gauge(
    'agent_active_requests',
    'Requisições ativas no momento'
)

# Usar métricas
def process_with_agent(agent, message):
    """Processar mensagem com métricas"""

    active_requests.inc()
    start_time = time.time()

    try:
        response = agent.run(message)

        # Métricas de sucesso
        agent_requests_total.labels(
            agent_name=agent.name,
            status='success'
        ).inc()

        # Duração
        duration = time.time() - start_time
        agent_request_duration_seconds.labels(
            agent_name=agent.name
        ).observe(duration)

        # Tokens e custo (se disponível)
        if hasattr(response, 'usage'):
            tokens = response.usage.total_tokens
            agent_tokens_used_total.labels(
                agent_name=agent.name,
                model=agent.model
            ).inc(tokens)

            cost = calculate_cost(tokens, agent.model)
            agent_cost_usd_total.labels(
                agent_name=agent.name
            ).inc(cost)

        return response

    except Exception as e:
        # Métricas de erro
        agent_requests_total.labels(
            agent_name=agent.name,
            status='error'
        ).inc()
        raise

    finally:
        active_requests.dec()

# Expor métricas
start_http_server(9090)  # Métricas em http://localhost:9090/metrics
```

**prometheus.yml:**

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'agent-api'
    static_configs:
      - targets: ['api:9090']
    metrics_path: '/metrics'
```

### 7.6.4 Distributed Tracing

**Com OpenTelemetry:**

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.requests import RequestsInstrumentor

# Configurar tracer
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Exportar para Jaeger
jaeger_exporter = JaegerExporter(
    agent_host_name="jaeger",
    agent_port=6831,
)
trace.get_tracer_provider().add_span_processor(
    BatchSpanProcessor(jaeger_exporter)
)

# Instrumentar requests automaticamente
RequestsInstrumentor().instrument()

# Usar tracing
@tracer.start_as_current_span("process_user_request")
def process_user_request(user_id, message):
    with tracer.start_as_current_span("load_user_context") as span:
        span.set_attribute("user_id", user_id)
        context = load_user_context(user_id)

    with tracer.start_as_current_span("call_agent") as span:
        span.set_attribute("agent_name", "assistant")
        span.set_attribute("message_length", len(message))

        response = agent.run(message, context=context)

        span.set_attribute("response_length", len(response))
        span.set_attribute("tokens_used", response.usage.total_tokens)

    with tracer.start_as_current_span("save_conversation"):
        save_to_database(user_id, message, response)

    return response
```

**Visualização no Jaeger:**

```
User Request [1234ms]
├─ Load User Context [45ms]
├─ Call Agent [1150ms]
│  ├─ Call Anthropic API [1100ms]
│  └─ Process Response [50ms]
└─ Save Conversation [39ms]
```

### 7.6.5 Dashboards com Grafana

**Dashboard JSON (exemplo):**

```json
{
  "dashboard": {
    "title": "Agent API Monitoring",
    "panels": [
      {
        "title": "Requests per Second",
        "targets": [
          {
            "expr": "rate(agent_requests_total[1m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "P95 Latency",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, agent_request_duration_seconds_bucket)"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(agent_requests_total{status=\"error\"}[5m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Cost (USD/hour)",
        "targets": [
          {
            "expr": "rate(agent_cost_usd_total[1h]) * 3600"
          }
        ],
        "type": "singlestat"
      }
    ]
  }
}
```

### 7.6.6 Alertas

**alert-rules.yml:**

```yaml
groups:
  - name: agent_alerts
    interval: 30s
    rules:
      # Alta taxa de erro
      - alert: HighErrorRate
        expr: rate(agent_requests_total{status="error"}[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Alta taxa de erro detectada"
          description: "Taxa de erro acima de 5% por 5 minutos"

      # Latência alta
      - alert: HighLatency
        expr: histogram_quantile(0.95, agent_request_duration_seconds_bucket) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Latência P95 acima de 5s"

      # Custo alto
      - alert: HighCost
        expr: rate(agent_cost_usd_total[1h]) * 720 > 1000
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Projeção de custo acima de $1000/mês"
          description: "Taxa de gasto atual: ${{ $value }}/mês"

      # Sem requisições (possível outage)
      - alert: NoRequests
        expr: rate(agent_requests_total[5m]) == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Nenhuma requisição nos últimos 5 minutos"
```

---

## 7.7 Performance e Otimização

### 7.7.1 Estratégias de Cache

**1. Cache de Respostas:**

```python
import redis
import hashlib
import json

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

def get_cached_or_compute(prompt: str, agent, ttl: int = 3600):
    """Busca no cache ou processa com agente"""

    # Criar chave baseada no hash do prompt
    cache_key = f"agent_response:{hashlib.sha256(prompt.encode()).hexdigest()}"

    # Tentar buscar no cache
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    # Não encontrado - processar
    response = agent.run(prompt)

    # Salvar no cache
    redis_client.setex(
        cache_key,
        ttl,
        json.dumps(response)
    )

    return response
```

**2. Cache de Embeddings:**

```python
from functools import lru_cache

@lru_cache(maxsize=10000)
def get_embedding(text: str):
    """Cache de embeddings em memória"""
    # Gerar embedding (operação cara)
    embedding = model.encode(text)
    return embedding
```

**3. Cache Warming:**

```python
# Pré-carregar cache com queries comuns
common_queries = [
    "Qual é o horário de funcionamento?",
    "Como faço para cancelar minha assinatura?",
    "Esqueci minha senha"
]

for query in common_queries:
    get_cached_or_compute(query, agent)
```

### 7.7.2 Otimização de Prompts

**Antes (ineficiente):**

```python
# Prompt verboso desnecessário
prompt = """
Por favor, analise cuidadosamente o seguinte documento em detalhes.
Leia cada linha com atenção e extraia as informações principais.
Certifique-se de não perder nenhum detalhe importante.

Documento: {document}

Após ler completamente o documento acima, por favor me forneça um
resumo abrangente e detalhado de todos os pontos principais encontrados,
organizados de forma clara e concisa.
"""
# Tokens: ~100
```

**Depois (otimizado):**

```python
# Prompt conciso e direto
prompt = """Resumir pontos principais:

{document}"""
# Tokens: ~10

# Economia: 90% menos tokens = 90% menos custo
```

### 7.7.3 Streaming de Respostas

```python
from anthropic import Anthropic

client = Anthropic()

def stream_agent_response(message: str):
    """Retorna resposta em streaming"""

    with client.messages.stream(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,
        messages=[{"role": "user", "content": message}]
    ) as stream:
        for text in stream.text_stream:
            yield text  # Enviar incrementalmente ao cliente

# Uso com FastAPI
@app.get("/chat/stream")
async def chat_stream(message: str):
    return StreamingResponse(
        stream_agent_response(message),
        media_type="text/event-stream"
    )
```

**Vantagens:**
- Usuário vê progresso imediatamente
- Percepção de latência menor
- Pode interromper se necessário

### 7.7.4 Batching

```python
async def process_batch(messages: list[str]):
    """Processa múltiplas mensagens em paralelo"""

    import asyncio

    async def process_one(msg):
        return await agent.async_run(msg)

    # Processar até 10 em paralelo
    results = []
    for i in range(0, len(messages), 10):
        batch = messages[i:i+10]
        batch_results = await asyncio.gather(*[
            process_one(msg) for msg in batch
        ])
        results.extend(batch_results)

    return results
```

### 7.7.5 Database Query Optimization

```python
# ❌ RUIM - N+1 queries
def get_users_with_tasks():
    users = db.query(User).all()  # 1 query

    for user in users:
        user.tasks = db.query(Task).filter(Task.user_id == user.id).all()  # N queries

    return users

# ✅ BOM - 1 query com join
def get_users_with_tasks():
    return db.query(User).options(
        joinedload(User.tasks)
    ).all()  # 1 query
```

---

## 7.8 Custos e Otimização Financeira

### 7.8.1 Modelo de Custos

**Componentes de custo:**

```
CUSTO TOTAL = LLM API + Infrastructure + Data Storage + Data Transfer + Observability
```

**Breakdown típico:**

```
LLM API:          60-80%  (maior custo)
Infrastructure:   15-25%  (servidores/containers)
Storage:           2-5%   (databases, cache)
Transfer:          1-3%   (egress bandwidth)
Observability:     2-5%   (logs, metrics)
```

### 7.8.2 Calculadora de Custos LLM

```python
# Preços aproximados (Jan 2025)
PRICES = {
    "claude-3-opus-20240229": {
        "input": 15.00 / 1_000_000,   # $15 por 1M tokens
        "output": 75.00 / 1_000_000    # $75 por 1M tokens
    },
    "claude-3-7-sonnet-20250219": {
        "input": 3.00 / 1_000_000,
        "output": 15.00 / 1_000_000
    },
    "claude-3-haiku-20240307": {
        "input": 0.25 / 1_000_000,
        "output": 1.25 / 1_000_000
    }
}

def calculate_cost(input_tokens: int, output_tokens: int, model: str) -> float:
    """Calcula custo de uma chamada"""
    prices = PRICES[model]
    cost = (input_tokens * prices["input"]) + (output_tokens * prices["output"])
    return cost

def project_monthly_cost(
    daily_requests: int,
    avg_input_tokens: int,
    avg_output_tokens: int,
    model: str
) -> dict:
    """Projeta custo mensal"""

    cost_per_request = calculate_cost(avg_input_tokens, avg_output_tokens, model)
    daily_cost = cost_per_request * daily_requests
    monthly_cost = daily_cost * 30

    return {
        "cost_per_request": f"${cost_per_request:.4f}",
        "daily_cost": f"${daily_cost:.2f}",
        "monthly_cost": f"${monthly_cost:.2f}",
        "annual_cost": f"${monthly_cost * 12:.2f}"
    }

# Exemplo
projection = project_monthly_cost(
    daily_requests=10_000,
    avg_input_tokens=1_000,
    avg_output_tokens=500,
    model="claude-3-7-sonnet-20250219"
)

print(projection)
# {
#   'cost_per_request': '$0.0105',
#   'daily_cost': '$105.00',
#   'monthly_cost': '$3150.00',
#   'annual_cost': '$37800.00'
# }
```

### 7.8.3 Estratégias de Redução de Custos

**1. Modelo Tiering (usar modelo mais barato quando possível)**

```python
def choose_model(complexity: str) -> str:
    """Escolhe modelo baseado na complexidade"""
    if complexity == "simple":
        return "claude-3-haiku-20240307"  # Mais barato
    elif complexity == "medium":
        return "claude-3-7-sonnet-20250219"  # Balanceado
    else:
        return "claude-3-opus-20240229"  # Mais caro, mais capaz

def analyze_complexity(prompt: str) -> str:
    """Analisa complexidade do prompt"""
    # Regras simples (pode ser mais sofisticado)
    if len(prompt) < 100 and "?" in prompt:
        return "simple"  # Perguntas curtas
    elif any(keyword in prompt.lower() for keyword in ["analyze", "compare", "evaluate"]):
        return "complex"  # Tarefas analíticas
    else:
        return "medium"

# Uso
prompt = "What time is it?"
model = choose_model(analyze_complexity(prompt))  # Haiku
# Economia: 90% vs Opus
```

**2. Aggressive Caching**

```python
# Cachear agressivamente respostas similares
from difflib import SequenceMatcher

def find_similar_cached(prompt: str, threshold: float = 0.9) -> str | None:
    """Busca prompts similares no cache"""

    # Buscar prompts cacheados
    cached_prompts = redis_client.keys("prompt:*")

    for cached_key in cached_prompts:
        cached_prompt = redis_client.hget(cached_key, "prompt")

        # Calcular similaridade
        similarity = SequenceMatcher(None, prompt, cached_prompt).ratio()

        if similarity >= threshold:
            # Suficientemente similar - retornar resposta cacheada
            return redis_client.hget(cached_key, "response")

    return None

# Uso
response = find_similar_cached(user_prompt)
if response:
    return response  # Cache hit - $0
else:
    response = agent.run(user_prompt)  # Cache miss - $$
    cache_response(user_prompt, response)
    return response
```

**3. Prompt Compression**

```python
def compress_prompt(prompt: str) -> str:
    """Remove palavras desnecessárias do prompt"""

    # Remover palavras de preenchimento
    filler_words = ["please", "kindly", "very", "really", "just", "actually"]

    compressed = prompt
    for word in filler_words:
        compressed = compressed.replace(f" {word} ", " ")

    # Remover espaços extras
    compressed = " ".join(compressed.split())

    return compressed

# Antes: "Could you please very carefully analyze this document?"
# Depois: "Could you carefully analyze this document?"
# Economia: ~30% tokens
```

**4. Rate Limiting Inteligente**

```python
# Limites por tier de usuário
RATE_LIMITS = {
    "free": {
        "requests_per_day": 10,
        "max_tokens_per_request": 1000
    },
    "pro": {
        "requests_per_day": 1000,
        "max_tokens_per_request": 4000
    },
    "enterprise": {
        "requests_per_day": float('inf'),
        "max_tokens_per_request": 8000
    }
}

def check_user_limits(user_tier: str, request_tokens: int) -> bool:
    limits = RATE_LIMITS[user_tier]

    # Verificar limite de tokens
    if request_tokens > limits["max_tokens_per_request"]:
        raise ValueError(f"Request exceeds token limit for {user_tier} tier")

    # Verificar limite diário
    requests_today = get_user_request_count_today(user_id)
    if requests_today >= limits["requests_per_day"]:
        raise ValueError(f"Daily limit reached for {user_tier} tier")

    return True
```

### 7.8.4 Monitoramento de Custos em Tempo Real

```python
from prometheus_client import Counter, Gauge

# Métricas de custo
cost_usd_total = Counter('llm_cost_usd_total', 'Custo total em USD', ['model'])
cost_usd_hourly = Gauge('llm_cost_usd_hourly', 'Custo por hora em USD')

# Budget alert
DAILY_BUDGET_USD = 500.00

def track_cost(tokens_in: int, tokens_out: int, model: str):
    """Rastreia custo e alerta se exceder budget"""

    cost = calculate_cost(tokens_in, tokens_out, model)
    cost_usd_total.labels(model=model).inc(cost)

    # Verificar budget diário
    total_today = get_total_cost_today()

    if total_today > DAILY_BUDGET_USD:
        # Alertar equipe
        send_alert(
            severity="critical",
            message=f"Daily budget exceeded: ${total_today:.2f} > ${DAILY_BUDGET_USD}"
        )

        # Considerar ativar modo econômico
        enable_economy_mode()

def enable_economy_mode():
    """Ativa modo econômico"""
    global DEFAULT_MODEL
    DEFAULT_MODEL = "claude-3-haiku-20240307"  # Switch para modelo mais barato

    # Aumentar cache TTL
    CACHE_TTL = 7200  # 2 horas

    # Reduzir rate limits
    for tier in RATE_LIMITS:
        RATE_LIMITS[tier]["requests_per_day"] //= 2
```

---

## 7.9 Segurança em Produção

### 7.9.1 Hardening de Segurança

**1. Variáveis de Ambiente Seguras**

```python
# ❌ NUNCA faça isso
ANTHROPIC_API_KEY = "sk-ant-api03-XXXXXX"  # Hardcoded - TERRÍVEL!

# ✅ Use variáveis de ambiente
import os
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY environment variable not set")
```

**2. Secrets Management**

```python
# AWS Secrets Manager
import boto3
import json

def get_secret(secret_name: str) -> dict:
    """Busca secret do AWS Secrets Manager"""

    client = boto3.client('secretsmanager', region_name='us-east-1')

    response = client.get_secret_value(SecretId=secret_name)
    secret = json.loads(response['SecretString'])

    return secret

# Uso
secrets = get_secret("prod/agent-api/credentials")
ANTHROPIC_API_KEY = secrets['anthropic_api_key']
DATABASE_URL = secrets['database_url']
```

**3. Input Sanitization**

```python
import re
import html

def sanitize_user_input(text: str) -> str:
    """Sanitiza input do usuário"""

    # Escape HTML
    text = html.escape(text)

    # Remover caracteres de controle
    text = re.sub(r'[\x00-\x1F\x7F]', '', text)

    # Limitar tamanho
    if len(text) > 10000:
        raise ValueError("Input too long")

    return text

# Uso
@app.post("/chat")
async def chat(message: str):
    clean_message = sanitize_user_input(message)
    response = agent.run(clean_message)
    return {"response": response}
```

**4. Rate Limiting por IP**

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/chat")
@limiter.limit("10/minute")  # 10 requisições por minuto por IP
async def chat(request: Request, message: str):
    response = agent.run(message)
    return {"response": response}
```

**5. API Authentication**

```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials) -> dict:
    """Verifica JWT token"""
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/api/chat")
async def chat(
    message: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = verify_token(credentials)

    # Processar apenas se autenticado
    response = agent.run(message)
    return {"response": response}
```

### 7.9.2 HTTPS e TLS

**nginx.conf:**

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Configurações SSL seguras
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Outras headers de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 7.9.3 Auditoria e Compliance

```python
import logging
from datetime import datetime

class AuditLogger:
    """Logger de auditoria para compliance"""

    def __init__(self):
        self.logger = logging.getLogger('audit')
        self.logger.setLevel(logging.INFO)

        # Handler para arquivo separado
        handler = logging.FileHandler('/var/log/agent-api/audit.log')
        formatter = logging.Formatter(
            '%(asctime)s - %(message)s'
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    def log_access(self, user_id: str, resource: str, action: str):
        """Registra acesso a recursos"""
        self.logger.info(
            f"ACCESS | user={user_id} | resource={resource} | action={action}"
        )

    def log_data_access(self, user_id: str, data_type: str, record_ids: list):
        """Registra acesso a dados sensíveis"""
        self.logger.info(
            f"DATA_ACCESS | user={user_id} | type={data_type} | records={','.join(record_ids)}"
        )

    def log_change(self, user_id: str, entity: str, entity_id: str, changes: dict):
        """Registra mudanças em dados"""
        self.logger.info(
            f"CHANGE | user={user_id} | entity={entity} | id={entity_id} | changes={changes}"
        )

audit = AuditLogger()

# Uso
@app.get("/api/user/{user_id}/data")
async def get_user_data(user_id: str, current_user: User = Depends(get_current_user)):
    # Registrar acesso
    audit.log_data_access(
        user_id=current_user.id,
        data_type="user_personal_data",
        record_ids=[user_id]
    )

    # Retornar dados
    return get_data(user_id)
```

---

## 7.10 CI/CD para Sistemas de Agentes

### 7.10.1 GitHub Actions Pipeline

**.github/workflows/deploy.yml:**

```yaml
name: Deploy Agent API

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run linting
        run: |
          ruff check .
          black --check .
          mypy .

      - name: Run tests
        run: |
          pytest tests/ --cov=app --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Log in to registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/agent-api
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T api python manage.py migrate

      - name: Smoke test
        run: |
          sleep 10
          curl -f https://api.yourdomain.com/health || exit 1

      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 7.10.2 Testes Automatizados

**tests/test_agent.py:**

```python
import pytest
from unittest.mock import Mock, patch
from app.agent import AgentService

@pytest.fixture
def agent_service():
    return AgentService(model="claude-3-haiku-20240307")

def test_agent_response(agent_service):
    """Testa resposta básica do agente"""
    response = agent_service.process("Hello")
    assert isinstance(response, str)
    assert len(response) > 0

@pytest.mark.asyncio
async def test_agent_async(agent_service):
    """Testa processamento assíncrono"""
    response = await agent_service.process_async("Test message")
    assert response is not None

def test_agent_error_handling(agent_service):
    """Testa tratamento de erros"""
    with pytest.raises(ValueError):
        agent_service.process("")  # Empty input

@patch('anthropic.Anthropic.messages.create')
def test_agent_with_mock(mock_create, agent_service):
    """Testa com mock da API (sem custo)"""
    # Mock da resposta
    mock_create.return_value = Mock(
        content=[Mock(text="Mocked response")]
    )

    response = agent_service.process("Test")
    assert response == "Mocked response"
    mock_create.assert_called_once()

def test_cost_tracking(agent_service):
    """Testa rastreamento de custos"""
    initial_cost = agent_service.get_total_cost()

    agent_service.process("Short message")

    final_cost = agent_service.get_total_cost()
    assert final_cost > initial_cost
```

**tests/test_api.py:**

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Testa endpoint de health check"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_chat_endpoint():
    """Testa endpoint de chat"""
    response = client.post(
        "/api/chat",
        json={"message": "Hello"},
        headers={"Authorization": "Bearer test-token"}
    )
    assert response.status_code == 200
    assert "response" in response.json()

def test_rate_limiting():
    """Testa rate limiting"""
    # Fazer muitas requisições rápidas
    for _ in range(15):
        response = client.post("/api/chat", json={"message": "Test"})

    # Deve ser rate limited
    assert response.status_code == 429
```

### 7.10.3 Rolling Updates e Blue-Green Deployment

**Kubernetes Rolling Update:**

```yaml
# deployment.yaml
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # Máximo de 1 pod extra durante update
      maxUnavailable: 0   # Nenhum pod pode estar indisponível
```

**Comandos:**

```bash
# Deploy nova versão
kubectl set image deployment/agent-api api=myregistry/agent-api:v2.0.0

# Monitorar rollout
kubectl rollout status deployment/agent-api

# Rollback se necessário
kubectl rollout undo deployment/agent-api
```

**Blue-Green com dois deployments:**

```bash
# Blue (versão antiga) está servindo produção
kubectl apply -f deployment-blue.yaml

# Deploy Green (nova versão)
kubectl apply -f deployment-green.yaml

# Testar Green
kubectl port-forward svc/agent-api-green 8000:80
# ... testes ...

# Switch de Blue para Green
kubectl patch service agent-api -p '{"spec":{"selector":{"version":"green"}}}'

# Se tudo OK, deletar Blue
kubectl delete -f deployment-blue.yaml
```

---

## 7.11 Projeto Prático: Deploy Completo

Vamos fazer o deploy completo de um sistema de agentes em produção, do zero ao ar.

### 7.11.1 Aplicação Exemplo

**app/main.py:**

```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agno import Agent
import os
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(title="Production Agent API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Agente
agent = Agent(
    name="Production Assistant",
    model="claude-3-7-sonnet-20250219",
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/ready")
async def readiness_check():
    """Readiness check - verifica se pode receber tráfego"""
    # Verificar dependências
    try:
        # Testar conexão com banco, etc.
        return {"status": "ready"}
    except Exception as e:
        raise HTTPException(status_code=503, detail="Not ready")

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Endpoint de chat"""
    try:
        response = agent.run(request.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 7.11.2 Deploy Passo a Passo

**Passo 1: Preparar o projeto**

```bash
# Clone ou crie o projeto
mkdir agent-api-prod && cd agent-api-prod

# Criar estrutura
mkdir -p app tests k8s
touch app/__init__.py app/main.py
touch Dockerfile docker-compose.yml
touch requirements.txt .env.example
```

**Passo 2: Build Docker image**

```bash
# Build
docker build -t agent-api:v1.0.0 .

# Testar localmente
docker run -p 8000:8000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  agent-api:v1.0.0

# Testar endpoint
curl http://localhost:8000/health
```

**Passo 3: Push para registry**

```bash
# Tag para registry
docker tag agent-api:v1.0.0 ghcr.io/youruser/agent-api:v1.0.0

# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u youruser --password-stdin

# Push
docker push ghcr.io/youruser/agent-api:v1.0.0
```

**Passo 4: Deploy no Kubernetes**

```bash
# Criar namespace
kubectl create namespace agent-api-prod

# Criar secrets
kubectl create secret generic api-secrets \
  --from-literal=anthropic-api-key=sk-ant-... \
  -n agent-api-prod

# Aplicar manifests
kubectl apply -f k8s/deployment.yaml -n agent-api-prod
kubectl apply -f k8s/service.yaml -n agent-api-prod
kubectl apply -f k8s/hpa.yaml -n agent-api-prod

# Verificar
kubectl get pods -n agent-api-prod
kubectl get svc -n agent-api-prod
```

**Passo 5: Configurar Ingress/Load Balancer**

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: agent-api-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.yourdomain.com
    secretName: agent-api-tls
  rules:
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: agent-api-service
            port:
              number: 80
```

```bash
kubectl apply -f k8s/ingress.yaml -n agent-api-prod
```

**Passo 6: Configurar monitoramento**

```bash
# Instalar Prometheus + Grafana via Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Port forward para acessar Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
# Acessar http://localhost:3000 (admin/prom-operator)
```

**Passo 7: Smoke tests em produção**

```bash
# Health check
curl https://api.yourdomain.com/health

# Chat test
curl -X POST https://api.yourdomain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, is this working?"}'

# Métricas
curl https://api.yourdomain.com/metrics
```

**Passo 8: Configurar alertas**

```yaml
# prometheus-alerts.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: agent-api-alerts
spec:
  groups:
  - name: agent-api
    interval: 30s
    rules:
    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
      annotations:
        summary: "High error rate detected"
```

### 7.11.3 Checklist de Produção

Antes de considerar concluído:

- [x] Aplicação containerizada
- [x] Deploy em cluster Kubernetes
- [x] HTTPS configurado
- [x] Secrets gerenciados com segurança
- [x] Autoscaling configurado
- [x] Health checks implementados
- [x] Monitoramento com Prometheus
- [x] Dashboards no Grafana
- [x] Alertas configurados
- [x] Logs centralizados
- [x] CI/CD pipeline funcionando
- [x] Smoke tests passando
- [x] Documentação atualizada
- [x] Runbooks criados
- [x] On-call definido

---

## 7.12 Resumo e Próximos Passos

### 7.12.1 O Que Aprendemos

Neste módulo, você dominou:

✅ **Arquitetura de Produção**: Padrões e best practices
✅ **Containerização**: Docker e multi-stage builds
✅ **Orquestração**: Kubernetes, HPA, StatefulSets
✅ **Cloud Deployment**: AWS, GCP, Azure
✅ **Observabilidade**: Logs, métricas, traces
✅ **Performance**: Cache, streaming, batching
✅ **Custos**: Cálculo, otimização, monitoramento
✅ **Segurança**: Hardening, secrets, compliance
✅ **CI/CD**: Pipelines automatizados, testes, deploy
✅ **Projeto Prático**: Deploy completo end-to-end

### 7.12.2 Próximo Módulo

No **Módulo 8: Ferramentas e Ecossistema**, você explorará:

🛠️ Ferramentas essenciais para desenvolvimento de agentes
🔌 Integrações com APIs populares
📚 Bibliotecas úteis do ecossistema Python
🧰 Frameworks complementares
🎨 UI frameworks para agentes (Streamlit, Gradio)
🔍 Ferramentas de debugging e profiling
📊 Analytics e business intelligence para agentes
🌐 Ecosistema open-source

---

**Parabéns! 🎉**

Você completou o módulo mais técnico e operacional do curso. Agora você tem as habilidades para levar qualquer sistema de agentes de IA do desenvolvimento para produção com confiança!

**→ Próximo: [Módulo 8 - Ferramentas e Ecossistema](../modulo-08/conteudo/Modulo-08-Ferramentas-Ecossistema.md)**

---

*"Deploy não é o fim, é apenas o começo. A verdadeira jornada começa quando usuários reais começam a interagir com seu sistema."*

# 🚀 GitHub Actions - Deploy SmartMart

Este projeto está configurado com CI/CD usando GitHub Actions.

## 📋 Workflows Disponíveis

### 1. Deploy Automático (`deploy.yml`)

**Trigger:**
- Push para `main` ou `master`
- Pull Request
- Manual (workflow_dispatch)

**Stages:**
1. **Test** - Testes e validação
2. **Build & Push** - Build das imagens Docker e push para Docker Hub
3. **Deploy** - Deploy para AWS/Azure/VPS (opcional)
4. **Notify** - Notificação de sucesso/falha

---

## ⚙️ Configuração de Secrets

Para usar o workflow, configure os seguintes secrets no GitHub:

### Obrigatórios (Docker Hub)

1. Vá para: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

```
DOCKER_USERNAME     # Seu username do Docker Hub
DOCKER_PASSWORD     # Sua senha ou token do Docker Hub
```

### Opcionais (AWS)

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

### Opcionais (Azure)

```
AZURE_CREDENTIALS   # JSON com credenciais Azure
```

### Opcionais (VPS)

```
VPS_HOST           # IP ou domínio do servidor
VPS_USERNAME       # Usuário SSH
VPS_SSH_KEY        # Chave privada SSH
```

---

## 🐳 Docker Hub Setup

1. **Criar conta no Docker Hub**
   - Acesse: https://hub.docker.com/signup
   - Crie uma conta gratuita

2. **Criar Access Token**
   - Vá para: Account Settings → Security → New Access Token
   - Nome: `github-actions`
   - Permissões: Read, Write, Delete
   - Copie o token gerado

3. **Adicionar Secrets no GitHub**
   ```
   DOCKER_USERNAME = seu-usuario
   DOCKER_PASSWORD = token-copiado
   ```

4. **Push para GitHub**
   ```bash
   git add .
   git commit -m "Add GitHub Actions"
   git push origin main
   ```

5. **Verificar Workflow**
   - Vá para: `Actions` tab no GitHub
   - Veja o workflow rodando
   - Após sucesso, imagens estarão no Docker Hub

---

## 🚀 Deploy Options

### Opção 1: Docker Hub (Padrão - Ativo)

Imagens são automaticamente enviadas para:
```
docker.io/seu-usuario/smartmart-backend:latest
docker.io/seu-usuario/smartmart-frontend:latest
```

Pull manual:
```bash
docker pull seu-usuario/smartmart-backend:latest
docker pull seu-usuario/smartmart-frontend:latest
```

### Opção 2: AWS ECS (Desabilitado)

Para habilitar:
1. Altere `if: false` para `if: true` no job `deploy-aws`
2. Configure secrets AWS
3. Crie cluster ECS e serviço

### Opção 3: Azure App Service (Desabilitado)

Para habilitar:
1. Altere `if: false` para `if: true` no job `deploy-azure`
2. Configure secrets Azure
3. Crie App Service

### Opção 4: VPS com Docker Compose (Desabilitado)

Para habilitar:
1. Altere `if: false` para `if: true` no job `deploy-vps`
2. Configure secrets VPS
3. Prepare servidor com Docker

**Setup do servidor:**
```bash
# No VPS
mkdir -p /home/app/smartmart
cd /home/app/smartmart

# Criar docker-compose.yml
cat > docker-compose.yml <<EOF
services:
  backend:
    image: seu-usuario/smartmart-backend:latest
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data
    restart: always

  frontend:
    image: seu-usuario/smartmart-frontend:latest
    ports:
      - "80:5173"
    depends_on:
      - backend
    restart: always
EOF

# Primeira execução
docker-compose up -d
```

---

## 📊 Status do Workflow

Adicione badge ao README.md:

```markdown
![Deploy Status](https://github.com/seu-usuario/smartmart/actions/workflows/deploy.yml/badge.svg)
```

---

## 🔄 Fluxo de Deploy

```
1. Developer push code → GitHub
2. GitHub Actions inicia workflow
3. Testes executam (Python + Node)
4. Build das imagens Docker
5. Push para Docker Hub
6. Deploy automático (se configurado)
7. Notificação de sucesso/falha
```

---

## 🛠️ Comandos Úteis

### Executar workflow manualmente
- Vá para `Actions` → `Deploy SmartMart Solutions` → `Run workflow`

### Ver logs
- `Actions` → Clique no workflow → Ver detalhes de cada job

### Cancelar workflow
- `Actions` → Clique no workflow em execução → `Cancel workflow`

### Re-executar workflow
- `Actions` → Clique no workflow finalizado → `Re-run all jobs`

---

## 🐛 Troubleshooting

### Erro: "docker login failed"
- Verifique se `DOCKER_USERNAME` e `DOCKER_PASSWORD` estão corretos
- Use Access Token ao invés de senha

### Erro: "permission denied"
- No Docker Hub, verifique se o token tem permissão de Write

### Erro: "repository not found"
- Crie os repositórios no Docker Hub primeiro:
  - `seu-usuario/smartmart-backend`
  - `seu-usuario/smartmart-frontend`

### Deploy não executa
- Verifique se está fazendo push para `main` ou `master`
- Veja se o job `deploy-*` tem `if: true`

---

## 📝 Customização

### Adicionar mais testes

Edite `.github/workflows/deploy.yml`:

```yaml
- name: Testes unitários Backend
  run: |
    cd backend
    pip install pytest
    pytest tests/
```

### Mudar branch de deploy

```yaml
on:
  push:
    branches:
      - production  # Mude aqui
```

### Adicionar notificação Slack

```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## ✅ Checklist de Setup

- [ ] Criar conta Docker Hub
- [ ] Gerar Access Token
- [ ] Adicionar `DOCKER_USERNAME` secret
- [ ] Adicionar `DOCKER_PASSWORD` secret
- [ ] Fazer push do código
- [ ] Verificar workflow na aba Actions
- [ ] Confirmar imagens no Docker Hub
- [ ] (Opcional) Configurar deploy AWS/Azure/VPS

---

## 🔗 Links Úteis

- Docker Hub: https://hub.docker.com
- GitHub Actions Docs: https://docs.github.com/actions
- Docker Build Push Action: https://github.com/docker/build-push-action

---

**Pronto! Seu projeto agora tem CI/CD automático! 🎉**

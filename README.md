# 🚀 Guia Rápido - SmartMart Solutions

## Início Rápido (3 passos)

### 1️⃣ Inicie o Docker
```bash
docker-compose up --build
```

### 2️⃣ Acesse a aplicação
- Frontend: http://localhost:5173
- API: http://localhost:3000

### 3️⃣ Importe os dados
Na interface, vá em cada página e importe os CSVs:
- **Categorias** → Importar `categories.csv`
- **Produtos** → Importar `products.csv`
- **Vendas** → Importar `sales.csv`

---

## ✅ Checklist para Teste Técnico

- [ ] Rodar `docker-compose up --build`
- [ ] Acessar http://localhost:5173
- [ ] Importar os 3 CSVs pela interface
- [ ] Testar Dashboard (ver gráficos)
- [ ] Cadastrar produto manual
- [ ] Filtrar produtos por categoria
- [ ] Adicionar venda
- [ ] Editar venda (botão Editar)
- [ ] Baixar relatório Excel
- [ ] Baixar CSV de produtos/vendas
- [ ] Testar API no Swagger (http://localhost:8000/docs)

---

## 🔧 Funcionalidades Principais

### Dashboard 📈
- Receita total e vendas
- 3 gráficos interativos

### Produtos 🛍️
- Cadastrar, buscar, filtrar, deletar
- Upload/Download CSV

### Categorias 🏷️
- Criar, listar
- Upload CSV

### Vendas 💰
- **Editável inline** (clique em "Editar")
- Adicionar via modal
- Upload/Download CSV

---

## 🐳 Comandos Docker

```bash
# Iniciar
docker-compose up

# Parar
docker-compose down

# Rebuild
docker-compose up --build

# Logs
docker-compose logs -f
```

---

## 🚨 Problemas Comuns

**Porta ocupada?**
```bash
# Parar containers
docker-compose down

# Limpar tudo
docker system prune -a
```

**Dados não salvam?**
- Verifique se `backend/data/data.json` existe
- Volume Docker: `./data:/app/data` no docker-compose.yml

---

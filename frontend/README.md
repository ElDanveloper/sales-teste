# SmartMart Solutions - Sistema de Gestão de Vendas

Frontend moderno e otimizado para o SmartMart Solutions, construído com React, Vite e Tailwind CSS.

## 📋 Características

- **Dashboard**: Visualização em tempo real de vendas, receitas e estatísticas gerais
- **Gestão de Produtos**: Criar, visualizar e deletar produtos
- **Gestão de Categorias**: Organizar produtos por categorias
- **Histórico de Vendas**: Acompanhar todas as transações
- **Importação CSV**: Carregar dados em massa de arquivos CSV
- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **Performance**: Vite para compilação rápida e otimizada

## 🚀 Início Rápido

### Com Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker-compose up
```

O frontend estará disponível em `http://localhost:5173`

### Sem Docker

```bash
# Instalar dependências
npm install

# Executar modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/           # Páginas principais
│   ├── api.js           # Configuração de requisições
│   ├── App.jsx          # Componente raiz
│   └── index.css        # Estilos globais
├── Dockerfile           # Configuração Docker
├── package.json         # Dependências
├── vite.config.js       # Configuração Vite
└── tailwind.config.js   # Configuração Tailwind
```

## 🎨 Componentes Principais

### Pages
- **Dashboard**: Resumo executivo com métricas principais
- **Products**: Listagem e gerenciamento de produtos
- **Categories**: Organização de categorias
- **Sales**: Histórico de todas as vendas

### Components
- **Header**: Barra superior com navegação
- **Sidebar**: Menu lateral com opções
- **StatCard**: Cartões de estatísticas
- **ProductTable**: Tabela de produtos
- **Modal**: Diálogos para adicionar dados
- **LoadingSpinner**: Indicador de carregamento

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend:

```
VITE_API_URL=http://localhost:8000
```

Para produção, ajuste a URL da API conforme necessário.

## 📦 Dependências Principais

- **React 18**: Framework UI
- **Vite**: Build tool moderno e rápido
- **Tailwind CSS**: Utilitários CSS para design
- **Axios**: Cliente HTTP
- **Lucide React**: Ícones SVG

## 🎯 Funcionalidades Avançadas

### Importação de CSV

Você pode importar dados em massa através dos botões "Importar CSV":

1. **Produtos**: Upload de `products.csv`
2. **Categorias**: Upload de `categories.csv`
3. **Vendas**: Upload de `sales.csv`

O sistema valida e insere apenas registros únicos (evita duplicatas).

### Busca e Filtros

- Busca em tempo real de produtos por nome ou marca
- Filtros automáticos na listagem

## 📱 Otimizações de Performance

- **Lazy Loading**: Componentes carregam sob demanda
- **Memoização**: Componentes otimizados com React.memo
- **Bundle Pequeno**: Vite gera bundles otimizados
- **CSS Otimizado**: Tailwind purga CSS não utilizado
- **API Eficiente**: Requisições paralelas onde possível

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se o backend está rodando em `http://localhost:8000`
- Confirme as origens permitidas no backend (`main.py`)

### Porta já em uso
- Frontend: mude a porta em `vite.config.js`
- Backend: ajuste em `main.py`

### Dados não carregam
- Abra o console (F12) e verifique logs de erro
- Confirme que o backend está online
- Valide o formato dos arquivos CSV

## 📝 Formato dos Arquivos CSV

### products.csv
```
id,name,category_id,price,brand,description
```

### categories.csv
```
id,name
```

### sales.csv
```
id,product_id,date,quantity,total_price
```

## 🤝 Contribuindo

Para adicionar novos recursos:

1. Crie componentes reutilizáveis em `src/components/`
2. Novas páginas em `src/pages/`
3. Endpoints na API em `src/api.js`
4. Mantenha o design consistente com Tailwind

## 📄 Licença

Projeto privado - SmartMart Solutions

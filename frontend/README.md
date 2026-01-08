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
VITE_API_URL=http://localhost:3000
```

Para produção, ajuste a URL da API conforme necessário.

## 📦 Dependências Principais

- **React 18**: Framework UI
- **Vite**: Build tool moderno e rápido
- **Tailwind CSS**: Utilitários CSS para design
- **Axios**: Cliente HTTP
- **Lucide React**: Ícones SVG

## 🎯 Funcionalidades Avançadas

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

# Tracking Web

![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema de rastreamento de envios em tempo real com dashboard interativo e gerenciamento de templates de email.

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Configuração do Supabase](#-configuração-do-supabase)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Funcionalidades](#-funcionalidades)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Backend e Banco de Dados](#-backend-e-banco-de-dados)
- [Responsividade](#-responsividade)
- [Arquitetura e Padrões](#-arquitetura-e-padrões)
- [Destaques Técnicos](#-destaques-técnicos)
- [Performance e Otimizações](#-performance-e-otimizações)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Links Úteis](#-links-úteis)

## 📋 Sobre o Projeto

O Tracking Web é uma aplicação moderna para rastreamento e monitoramento de envios, oferecendo:

- **Dashboard em tempo real** com métricas de envios
- **Rastreamento de pacotes** com timeline detalhada de eventos
- **Gerenciamento de templates de email** com editor Monaco
- **Autenticação segura** via Supabase
- **Interface responsiva** com tema claro/escuro

## 🚀 Tecnologias

- **Framework**: Next.js 15.5.3 (App Router) com Turbopack
- **Linguagem**: TypeScript 5
- **UI**: React 19.1.0 + Tailwind CSS 4
- **Componentes**: Radix UI + Shadcn/ui (Field Pattern)
- **Backend**: Supabase (Auth + Database + Realtime)
- **Charts**: Recharts 2.15.4
- **Forms**: React Hook Form 7 + Zod 4 + Field Pattern
- **Editor**: Monaco Editor (@monaco-editor/react)
- **Queries**: TanStack Query v5 + TanStack Table v8
- **Animações**: Motion
- **Notificações**: Sonner
- **Datas**: date-fns 4.1.0
- **HTTP Client**: Axios
- **Excel Export**: xlsx 0.18.5

## 📦 Instalação

### Pré-requisitos
- Node.js 20+
- npm ou yarn
- Conta no Supabase (para backend)

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/ecommerce-omar/tracking-web.git
cd tracking-web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto:
```env
# Supabase (Obrigatório)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API (Opcional)
NEXT_PUBLIC_API_BASE_URL=your_api_base_url

# Feature Flags (Opcional - padrão: false)
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ADVANCED_FILTERS=true
NEXT_PUBLIC_ENABLE_EXPORTS=true
NEXT_PUBLIC_ENABLE_BULK_ACTIONS=true
NEXT_PUBLIC_ENABLE_REALTIME=true

# Analytics (Opcional)
NEXT_PUBLIC_GTM_ID=your_gtm_id

# Development (Opcional)
NEXT_PUBLIC_ENABLE_MOCKS=false
LOG_LEVEL=debug
```

4. Execute o projeto:
```bash
npm run dev
```

O app estará disponível em `http://localhost:3000`

## 🗺️ Rotas da Aplicação

### Rotas Públicas
- `/login` - Página de autenticação

### Rotas Protegidas (requer autenticação)
- `/` - Dashboard com métricas em tempo real
- `/tracking` - Busca de rastreamento (por código ou CPF)
- `/tracking/[id]` - Detalhes de um rastreamento específico
- `/shipments` - Listagem de envios com filtros avançados
- `/shipments/[id]` - Detalhes de um envio específico
- `/templates-email` - Gerenciamento de templates de email
- `/notification-settings` - Configurações de notificações do navegador

### Rotas de Sistema
- `/auth/callback` - Callback do Supabase Auth
- `/error` - Página de erro customizada
- `/not-found` - Página 404 customizada

## ⚙️ Configuração do Supabase

Para configurar o backend do Supabase, você precisará criar as seguintes tabelas:

### Tabela `tracking`
```sql
CREATE TABLE tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  recipient_name TEXT,
  recipient_cpf TEXT,  -- CPF do destinatário (para busca)
  recipient_address TEXT,
  events JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_tracking_code ON tracking(tracking_code);
CREATE INDEX idx_tracking_status ON tracking(status);
CREATE INDEX idx_tracking_recipient_cpf ON tracking(recipient_cpf);  -- Para busca por CPF
CREATE INDEX idx_tracking_created_at ON tracking(created_at DESC);
```

> **Nota**: O campo `recipient_cpf` é essencial para a funcionalidade de busca por CPF. Certifique-se de incluí-lo ao criar a tabela.

### Tabela `email_templates`
```sql
CREATE TABLE email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Habilitar Realtime
No painel do Supabase, habilite o Realtime para as tabelas:
1. Vá em **Database** → **Replication**
2. Habilite o Realtime para as tabelas `tracking` e `email_templates`

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15+)
│   ├── (private)/         # Rotas protegidas
│   │   ├── page.tsx       # Dashboard principal
│   │   ├── shipments/     # Gerenciamento de envios
│   │   │   ├── page.tsx   # Listagem de envios
│   │   │   └── [id]/      # Detalhes de um envio
│   │   ├── tracking/      # Rastreamento
│   │   │   ├── page.tsx   # Busca de rastreamento
│   │   │   └── [id]/      # Detalhes de rastreamento
│   │   ├── templates-email/ # Templates de email
│   │   ├── notification-settings/ # Configurações de notificações
│   │   └── layout.tsx     # Layout com sidebar
│   ├── auth/              # Autenticação
│   │   └── callback/      # Callback do Supabase Auth
│   ├── login/             # Página de login
│   ├── error/             # Página de erro
│   └── not-found.tsx      # Página 404
├── components/            # Componentes reutilizáveis (na raiz)
│   ├── ui/               # Componentes base (Shadcn/ui)
│   │   ├── field.tsx     # Novo padrão de formulários
│   │   ├── button.tsx    # Botão
│   │   ├── card.tsx      # Card
│   │   ├── table.tsx     # Table
│   │   ├── timeline.tsx  # Timeline
│   │   └── ...           # Outros componentes UI
│   ├── app-sidebar.tsx            # Sidebar principal
│   ├── nav-main.tsx               # Menu de navegação
│   ├── nav-user.tsx               # Menu do usuário
│   ├── nav-breadcrumb.tsx         # Breadcrumb
│   ├── site-header.tsx            # Header
│   ├── chart-area-interactive.tsx # Gráfico de área
│   ├── chart-radial-text.tsx      # Gráfico radial
│   ├── tracking-data-table.tsx    # Tabela de trackings
│   ├── tracking-search-by-code.tsx # Busca por código
│   ├── tracking-search-by-cpf.tsx  # Busca por CPF
│   ├── tracking-code-form.tsx     # Form de código
│   ├── tracking-cpf-form.tsx      # Form de CPF
│   ├── timeline-events.tsx        # Timeline de eventos
│   ├── columns-tracking.tsx       # Colunas da tabela
│   ├── shipments-data-table.tsx   # Tabela de envios
│   ├── shipments-table-toolbar.tsx # Toolbar com filtros
│   ├── columns-shipments.tsx      # Colunas de envios
│   ├── email-template-editor.tsx  # Editor de templates
│   ├── email-template-card.tsx    # Card de template
│   ├── edit-email-template-form.tsx # Form de edição
│   ├── is-active-email-template-form.tsx # Toggle ativo/inativo
│   ├── login-form.tsx             # Formulário de login
│   ├── notification-permission-prompt.tsx # Prompt de notificações
│   ├── query-provider.tsx         # TanStack Query Provider
│   ├── theme-provider.tsx         # Next Themes Provider
│   ├── monaco-editor.tsx          # Monaco Editor wrapper
│   ├── fade-in-wrapper.tsx        # Animação de entrada
│   └── pagination-controls.tsx    # Controles de paginação
├── config/               # Configurações da aplicação
│   └── app.config.ts     # Configuração centralizada (12-factor app)
├── constants/            # Constantes e enums
│   ├── tracking-status.ts # Status de rastreamento
│   └── status-filter-groups.ts # Grupos de filtros
├── hooks/                # Custom hooks
│   ├── use-trackings-realtime.ts  # Realtime trackings
│   ├── use-tracking.ts            # Busca por código
│   ├── use-tracking-by-cpf.ts     # Busca por CPF
│   ├── use-dashboard-realtime.ts  # Realtime dashboard
│   ├── use-email-templates.ts     # Email templates
│   ├── use-table-preferences.ts   # Preferências de tabela
│   ├── use-browser-notifications.ts # Notificações navegador
│   ├── use-tracking-notifications.ts # Notificações de tracking
│   ├── use-auth.ts                # Autenticação
│   ├── use-mobile.ts              # Detecção mobile
│   ├── use-area-chart-data.ts     # Dados do gráfico
│   └── use-copy-to-clipboard.ts   # Copiar para clipboard
├── lib/                  # Utilitários e configurações
│   ├── supabase/         # Cliente Supabase (server/client)
│   └── utils.ts          # Utilidades gerais
├── middleware/           # Middlewares
│   └── security.ts       # Middleware de segurança (CSP, Rate Limiting)
├── schemas/              # Schemas Zod para validação
├── services/             # Serviços e chamadas API
└── utils/                # Funções utilitárias
    ├── logger.ts         # Sistema de logging
    ├── is-valid-cpf.ts   # Validação de CPF
    ├── linkify-text.tsx  # Conversão de links
    └── ...               # Outras utilidades
```

## 🎨 Funcionalidades

### Dashboard
- ⚡ **Métricas em tempo real** com Supabase Realtime
- 📊 Gráficos interativos com estatísticas
- 🔍 Filtros por período (7, 15, 30 dias)
- 🎯 Estados de carregamento e erro
- 📈 Análise de status de envios
- 🔄 Atualização automática sem refresh

### Rastreamento
- 🔍 **Busca por código de rastreamento** - Consulta rápida por código único
- 👤 **Busca por CPF do destinatário** - Localiza rastreamentos pelo CPF (com validação automática)
- 📅 Timeline detalhada de eventos com histórico completo
- ⚡ Atualização em tempo real via Supabase Realtime
- 📦 Informações completas do envio (produto, dimensões, valor, etc.)
- 📱 Interface totalmente responsiva com tabs para tipos de busca
- 🔔 Notificações de mudanças de status
- 📄 Página de detalhes com informações completas do rastreamento
- 🚫 **Estado "Objeto não encontrado"**:
  - Exibe Empty state específico quando objeto não encontrado no sistema dos Correios
  - Ícone e mensagem personalizados
  - Status em vermelho na listagem

### Gerenciamento de Envios
- 📋 Listagem com paginação eficiente
- 🔍 **Filtros avançados**:
  - Filtro por status (múltipla seleção) incluindo "Objeto não encontrado"
  - Filtro por data de criação
  - Filtro por data de entrega prevista
  - Filtro por canal de entrega
  - Busca por palavra-chave
- 📊 DataTable com TanStack Table v8
- 📦 Página de detalhes individuais de cada envio
- ⚡ Atualização em tempo real via Supabase Realtime
- 🎯 Controle de preferências da tabela (colunas visíveis, ordenação)
- 💾 Persistência de preferências no localStorage
- ✏️ **Criação e edição de envios**:
  - Formulário multi-step (3 etapas) com validação
  - Combobox com busca para seleção de remetente (32 opções)
  - RadioGroup com estilo card para canal de entrega e categoria
  - Validação de CPF integrada
  - Validação de código de rastreio (apenas letras maiúsculas e números)
  - Cálculo automático de quantidade total de produtos
  - Template moderno com FieldSeparator entre campos
- 🗑️ **Exclusão condicional de envios**:
  - Habilitado para status: "Etiqueta emitida", "Etiqueta cancelada pelo emissor", "Objeto não encontrado"
  - Confirmação via AlertDialog antes de excluir
- 📤 **Exportação para Excel**:
  - Seleção de envios via checkboxes (individual ou em massa)
  - Botão de exportação exibido dinamicamente no toolbar
  - Dialog de confirmação com contagem de itens selecionados
  - Arquivo Excel (.xlsx) com colunas formatadas:
    - Código de rastreio
    - Remetente
    - Previsão de entrega (formato dd/MM/yyyy)
    - Status atual
    - Último evento da timeline
    - Data do último evento (formato dd/MM/yyyy HH:mm)
  - Nome do arquivo gerado automaticamente com timestamp
  - Badge visual mostrando quantidade de itens selecionados

### Templates de Email
- 📝 Editor Monaco integrado (VS Code no browser)
- 🎨 Sintaxe highlighting automático
- 👁️ Preview em tempo real
- ✅ Gerenciamento de templates ativos/inativos
- 💾 Salvamento automático
- 🔧 Suporte a HTML e CSS

### Notificações do Navegador
- 🔔 Notificações push nativas do navegador
- ⚡ Alertas em tempo real de mudanças de status
- 🎯 Notificações de novos rastreamentos
- ⚙️ **Página de configurações dedicada** (`/notification-settings`):
  - Toggle geral de notificações
  - Toggle para mudanças de status
  - Toggle para novos rastreamentos
  - Seleção granular de status (quais status notificar)
  - Status do pedido de permissão do navegador
- 🔕 Controle granular de preferências por tipo de evento
- 💾 Persistência de configurações via cookies (365 dias)
- 📱 Suporte a múltiplos navegadores modernos (Chrome, Firefox, Safari, Edge)
- 🎨 Prompt automático de permissão ao carregar o app

### Autenticação
- 🔐 Login/registro seguro
- ✉️ Autenticação via Supabase Auth
- 🛡️ Proteção de rotas privadas
- 🔄 Gerenciamento de sessão persistente
- 🚪 Callbacks de autenticação
- 🔒 Middleware de segurança

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Executa em modo desenvolvimento com Turbopack
npm run build    # Builda para produção com Turbopack
npm start        # Executa versão de produção
npm run lint     # Executa ESLint
```

> **Nota**: O projeto utiliza Turbopack para builds mais rápidos tanto em desenvolvimento quanto produção.

## 🎯 Backend e Banco de Dados

### Supabase
O projeto utiliza Supabase como backend completo:

#### Autenticação (Supabase Auth)
- 🔐 Registro e login de usuários
- 🛡️ Proteção de rotas privadas
- 🔄 Gerenciamento de sessões
- 🚪 Callbacks de autenticação
- 🔒 Server-side e client-side auth

#### Database (PostgreSQL)
- 📊 Tabela `tracking` com histórico de envios
- 📧 Tabela `email_templates` para templates
- 🔍 Queries otimizadas com índices
- 📈 Relacionamentos e constraints

#### Realtime
- ⚡ **WebSocket** para atualizações em tempo real
- 🔄 Sincronização automática de dados
- 📡 Subscriptions para:
  - Dashboard metrics
  - Trackings list
  - Individual tracking updates
  - Status changes

### Segurança

O projeto implementa múltiplas camadas de segurança:

#### Middleware de Segurança (`src/middleware/security.ts`)
- 🛡️ **Security Headers**:
  - `X-Frame-Options: DENY` - Previne clickjacking
  - `X-Content-Type-Options: nosniff` - Previne MIME sniffing
  - `X-XSS-Protection: 1; mode=block` - Proteção XSS
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` - Controle de features do navegador
- 🔐 **Content Security Policy (CSP)**:
  - Política rigorosa de carregamento de recursos
  - Whitelist de domínios permitidos
  - Proteção contra XSS e injeção de código
- ⏱️ **Rate Limiting**:
  - Limite de requisições por IP
  - Proteção contra brute force e DDoS
  - Configurável via `app.config.ts`
- 🧹 **HTML Sanitization**:
  - Limpeza de inputs potencialmente perigosos
  - Remoção de scripts maliciosos
- 📝 **Logging de Segurança**:
  - Registro de tentativas de ataque
  - Monitoramento de requisições suspeitas

#### Validação e Sanitização
- 🔒 Validação de inputs com **Zod 4**
- ✅ Schemas de validação para todos os formulários
- 🧼 Sanitização automática de dados
- 📋 Validação de CPF com algoritmo oficial

#### Autenticação
- 🔐 Supabase Auth com Row Level Security (RLS)
- 🛡️ Proteção de rotas privadas via middleware
- 🔄 Gerenciamento seguro de sessões
- 🚪 Callbacks seguros de autenticação

#### Tratamento de Erros
- 🚨 Tratamento centralizado de erros
- 📝 Logging estruturado de operações críticas
- 🎯 Mensagens de erro amigáveis sem expor detalhes internos

## 📱 Responsividade

Interface totalmente responsiva com:
- 📱 Design mobile-first
- 🎨 Componentes adaptativos
- 🎯 Menu lateral colapsável (Sidebar)
- 🌓 Tema claro/escuro (next-themes)
- 💫 Animações suaves com Motion
- 🔔 Notificações toast com Sonner

## 🏗️ Arquitetura e Padrões

- **App Router**: Estrutura moderna do Next.js 15
- **Server Components**: Para melhor performance
- **Client Components**: Para interatividade
- **Custom Hooks**: Reutilização de lógica
- **Type Safety**: TypeScript em todo projeto
- **Schema Validation**: Zod 4 para validação de dados
- **Error Boundaries**: Tratamento de erros
- **Loading States**: Skeleton e feedback visual
- **Centralized Config**: Configuração centralizada seguindo 12-factor app
- **Feature Flags**: Sistema de feature flags configurável

## 📝 Destaques Técnicos

### Hooks Customizados

#### Rastreamento e Dados
- `useTrackingsRealtime()` - Lista de trackings com atualização em tempo real
- `useTrackingByIdRealtime(id)` - Tracking específico com realtime
- `useTrackingByCodeRealtime(code)` - Busca por código com realtime
- `useTracking(code)` - Busca de tracking por código (TanStack Query)
- `useTrackingByCpf(cpf, enabled)` - Busca de trackings por CPF com validação
- `useDashboardRealtime(timeRange)` - Métricas do dashboard com realtime

#### Email Templates
- `useEmailTemplates()` - Gerenciamento de templates (CRUD completo)

#### Notificações
- `useBrowserNotifications()` - Gerenciamento de notificações do navegador
  - Verificação de suporte
  - Solicitação de permissão
  - Envio de notificações
  - Estado da permissão
- `useTrackingNotifications()` - Monitora mudanças de status e dispara notificações

#### UI e Preferências
- `useTablePreferences(key)` - Persistência de preferências de tabela no localStorage
- `useMobile()` - Hook para detectar viewport mobile (breakpoint)
- `useAreaChartData(data, timeRange)` - Filtragem de dados para gráficos

#### Autenticação
- `useAuth()` - Gerenciamento de autenticação e sessão do Supabase

#### Utilidades
- `useCopyToClipboard()` - Hook para copiar texto para o clipboard com feedback

### Componentes Principais

#### Layout e Navegação
- `AppSidebar` - Sidebar principal com navegação colapsável
- `NavMain` - Menu de navegação com ícones e badges
- `NavUser` - Menu dropdown do usuário (logout, perfil)
- `NavBreadcrumb` - Breadcrumb dinâmico baseado na rota
- `SiteHeader` - Header principal com toggle de tema

#### Formulários e Dialogs
- `CreateShipmentDialog` - Dialog multi-step para criar envios
  - Formulário com 3 etapas (Cliente, Pedido, Produtos)
  - Combobox com busca para seleção de remetente (32 opções)
  - RadioGroup com estilo card para canal de entrega e categoria
  - Validação completa com React Hook Form + Zod
  - FieldSeparator entre campos para melhor organização visual
  - Botões w-full para melhor UX
  - Prevenção de duplo submit
- `EditShipmentDialog` - Dialog para editar informações de envios
  - Mesmo template moderno do CreateShipmentDialog
  - Carrega dados existentes do envio
  - 2 etapas (Cliente e Produtos)

#### Tabelas e Dados
- `TrackingDataTable` - Tabela de rastreamentos com TanStack Table
- `ShipmentsDataTable` - Tabela de envios com ordenação e filtros
- `ShipmentsTableToolbar` - Toolbar com filtros avançados (data, status, canal)
- `ColumnsTracking` - Definição de colunas para tracking
- `ColumnsShipments` - Definição de colunas para shipments
- `PaginationControls` - Controles de paginação reutilizáveis

#### Gráficos e Visualizações
- `ChartAreaInteractive` - Gráfico de área com interatividade (hover, zoom)
- `ChartRadialText` - Gráfico radial com texto central e percentuais
- `Timeline` - Componente base de timeline (UI)
- `TimelineEvents` - Timeline de eventos de rastreamento específica

#### Busca e Formulários
- `TrackingSearchByCode` - Componente de busca por código
- `TrackingSearchByCpf` - Componente de busca por CPF
- `TrackingCodeForm` - Formulário de busca por código
- `TrackingCpfForm` - Formulário de busca por CPF (com validação)
- `LoginForm` - Formulário de autenticação

#### Email Templates
- `EmailTemplateEditor` - Editor completo com tabs (Preview/HTML)
- `EmailTemplateCard` - Card de template com ações
- `EditEmailTemplateForm` - Formulário de edição de template
- `IsActiveEmailTemplateForm` - Toggle de ativo/inativo
- `MonacoEditor` - Wrapper do Monaco Editor (VS Code no browser)

#### Notificações
- `NotificationPermissionPrompt` - Solicita permissão de notificações

#### Providers e Utilidades
- `QueryProvider` - TanStack Query Provider
- `ThemeProvider` - Next Themes Provider (tema claro/escuro)
- `FadeInWrapper` - Componente de animação de entrada

### Sistema de Notificações
O projeto implementa um sistema completo de notificações push do navegador:

#### Arquitetura
- **Hook `useBrowserNotifications`**: Gerencia permissões e envio de notificações
- **Hook `useTrackingNotifications`**: Monitora mudanças de status em tempo real via Supabase Realtime
- **Componente `NotificationPermissionPrompt`**: Solicita permissão automaticamente ao usuário

#### Funcionalidades
- 🔔 **Notificações automáticas** quando o status de um rastreamento muda
- ⚙️ **Configurações persistentes** armazenadas em cookies
- 🎯 **Notificações configuráveis**: mudanças de status, novos rastreamentos, etc.
- 🔕 **Controle de permissões** com feedback visual do estado atual
- 📱 **Suporte multiplataforma** para navegadores modernos (Chrome, Firefox, Safari, Edge)

#### Fluxo de Funcionamento
1. Ao carregar a aplicação, o sistema verifica se o navegador suporta notificações
2. Se suportado e não houver permissão, solicita após 2 segundos
3. Com permissão concedida, monitora mudanças via Realtime do Supabase
4. Quando um status muda, dispara notificação nativa do navegador
5. Usuário pode personalizar quais eventos geram notificações

#### Tecnologias Utilizadas
- **Notifications API** do navegador
- **Supabase Realtime** para detecção de mudanças
- **Cookies** para persistência de preferências
- **React Hooks** para encapsulamento da lógica

### Acessibilidade e Formulários
- **Field Pattern** moderno do shadcn/ui com componentes:
  - `Field` - Container principal
  - `FieldLabel` - Label com suporte a estados (error, disabled)
  - `FieldContent` - Wrapper do input
  - `FieldError` - Mensagens de erro
  - `FieldSeparator` - Separador visual entre campos
  - `FieldSet` - Agrupamento de campos relacionados
  - `FieldTitle` - Título de seções
- Labels semânticos (incluindo sr-only)
- Atributos ARIA para melhor acessibilidade (`aria-invalid`, `aria-describedby`)
- Feedback visual e estados de loading
- Validação em tempo real com mensagens de erro contextualizadas
- RadioGroup com estilo card e background quando selecionado
- Combobox acessível com busca integrada

### Configuração Centralizada

O projeto utiliza um sistema robusto de configuração centralizado seguindo os princípios da **12-Factor App** em [src/config/app.config.ts](src/config/app.config.ts):

#### Estrutura da Configuração

**Metadata da Aplicação**
- Nome, versão, descrição
- Informações de contato e suporte

**Variáveis de Ambiente**
- ✅ Validação automática de variáveis obrigatórias
- 🔐 Supabase URL e API keys
- 🌐 Base URL da API
- 📊 Google Tag Manager ID
- 🧪 Flags de desenvolvimento

**API Configuration**
- ⏱️ Timeout de requisições
- 🔄 Retry logic configurável
- 📝 Headers padrão

**Cache Strategy**
- ⚡ TTL configurável por recurso:
  - Trackings: 30 segundos
  - Dashboard: 60 segundos
  - Email Templates: 5 minutos
  - User Profile: 10 minutos
- 🎯 Stale time customizável

**Feature Flags**
- 🔔 Push notifications (padrão: false)
- 🔍 Advanced filters (padrão: false)
- 📤 Exports (padrão: false)
- 📦 Bulk actions (padrão: false)
- ⚡ Realtime updates (padrão: true)

**Rate Limiting**
- 🚦 Requests por minuto: 60
- ⏳ Window size: 60 segundos
- 🎯 Configurável por ambiente

**Security**
- 🔐 Configuração de sessão
- 🛡️ CSP domains
- 🔒 Cookie settings (secure, httpOnly, sameSite)

**UI/UX Settings**
- 🎨 Tema padrão (light/dark/system)
- 📊 Items por página em tabelas
- 💫 Configurações de animação
- 🌐 Locale padrão (pt-BR)

**Logs**
- 📝 Nível de log (info, debug, error, warn)
- 🎯 Configurável por ambiente

#### Benefícios
- ✅ **Type-Safe**: Toda configuração é tipada com TypeScript
- 🔍 **Centralized**: Uma única fonte de verdade
- 🚨 **Validated**: Erros são detectados no startup
- 🔄 **Testable**: Fácil de testar e mockar
- 📚 **Documented**: Configurações autoexplicativas

### Sistema de Logging

O projeto implementa um sistema de logging estruturado em [src/utils/logger.ts](src/utils/logger.ts):

- 📝 **Múltiplos níveis**: debug, info, warn, error
- 🎯 **Logging contextual**: Cada log contém timestamp e nível
- 🔒 **Security events**: Logging específico para eventos de segurança
- 🧪 **Environment-aware**: Log apenas em desenvolvimento por padrão
- 📊 **Structured logging**: Formato consistente para análise

### Utilitários

**Validação de CPF** ([src/utils/is-valid-cpf.ts](src/utils/is-valid-cpf.ts))
- ✅ Validação completa com algoritmo oficial
- 🧹 Limpeza automática (remove formatação)
- 🚫 Rejeição de CPFs conhecidos como inválidos (000.000.000-00, etc)

**Linkify Text** ([src/utils/linkify-text.tsx](src/utils/linkify-text.tsx))
- 🔗 Conversão automática de URLs em links clicáveis
- 🎨 Componente React para renderização

**Export to Excel** ([src/utils/export-to-excel.ts](src/utils/export-to-excel.ts))
- 📤 Exportação de dados para formato Excel (.xlsx)
- 📊 Formatação de colunas com larguras personalizadas
- 📅 Formatação de datas em português brasileiro
- 🎯 Geração de nome de arquivo com timestamp

**Copy to Clipboard** ([src/hooks/use-copy-to-clipboard.ts](src/hooks/use-copy-to-clipboard.ts))
- 📋 Hook para copiar texto com feedback
- ✅ Indicador de sucesso/erro
- ⏱️ Auto-reset do estado

## ⚡ Performance e Otimizações

### Build e Desenvolvimento
- **Turbopack**: Build até 700x mais rápido que Webpack
- **Server Components**: Redução do bundle JavaScript enviado ao cliente
- **Code Splitting**: Carregamento sob demanda de componentes
- **Tree Shaking**: Remoção de código não utilizado

### Runtime
- **React 19**: Compiler automático e otimizações de renderização
- **Supabase Realtime**: WebSocket para atualizações em tempo real sem polling
- **TanStack Query**: Cache inteligente e gerenciamento de estado do servidor
- **Memoization**: Hooks customizados com otimização de re-renders

### Database
- **Índices otimizados**: Queries rápidas em tabelas grandes
- **Connection pooling**: Gerenciamento eficiente de conexões
- **Row Level Security**: Segurança sem impacto na performance

### Monitoramento
- Sistema de logs centralizado
- Tracking de performance no ambiente de produção
- Error tracking integrado

## 📸 Screenshots

> Em breve: Adicione screenshots da aplicação aqui

## 🔧 Troubleshooting

### Erro: "NEXT_PUBLIC_SUPABASE_URL is required"
- Verifique se o arquivo `.env.local` está na raiz do projeto
- Certifique-se de que as variáveis estão definidas corretamente
- Reinicie o servidor de desenvolvimento após adicionar variáveis

### Realtime não está funcionando
- Verifique se o Realtime está habilitado no Supabase para as tabelas `tracking` e `email_templates`
- Confirme que as Row Level Security (RLS) policies estão configuradas corretamente

### Erro de build com Turbopack
- Limpe o cache: `rm -rf .next`
- Reinstale as dependências: `rm -rf node_modules && npm install`
- Verifique se está usando Node.js 20+

### Editor Monaco não carrega
- Verifique se há bloqueadores de conteúdo no navegador
- Tente limpar o cache do navegador
- Verifique o console do navegador para erros de CORS

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🔗 Links Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query)


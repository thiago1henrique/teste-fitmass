# Fitmass

Fitmass é uma plataforma web moderna dedicada ao setor de fitness e bem-estar, oferecendo uma experiência completa tanto para usuários finais quanto para administradores. O projeto foi recentemente migrado para **AWS Amplify Gen 2**, utilizando uma arquitetura serverless robusta e escalável.

## Tecnologias

Este projeto utiliza as tecnologias mais recentes do ecossistema Web:

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend-as-a-Service:** [AWS Amplify Gen 2](https://docs.amplify.aws/gen2/)
  - **Data:** AWS AppSync (GraphQL) com DynamoDB
  - **Auth:** Amazon Cognito
  - **Storage:** Amazon S3
- **Editor de Conteúdo:** [Tiptap](https://tiptap.dev/) (Rich Text Editor customizado)
- **Gráficos:** [Recharts](https://recharts.org/)

## Funcionalidades

- **Dashboard Administrativo:** Gestão completa de postagens e métricas.
- **Blog Dinâmico:** Sistema de blog com suporte a categorias, contagem de visualizações e SEO otimizado.
- **Editor Rich Text:** Interface intuitiva para criação de conteúdo com suporte a imagens e links.
- **Gestão de Equipe:** Controle de acesso baseado em grupos do Cognito (ADMIN, EDITOR).
- **Upload de Mídia:** Sistema de upload integrado com Amazon S3 (fallback local para desenvolvimento).
- **Personalização:** Seções dinâmicas e integração com fontes personalizadas (Aero Matics).

## Instalação e Configuração

### Pré-requisitos

- Node.js (v20 ou superior)
- AWS CLI configurado (para implantação)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd fitmass
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o Sandbox do Amplify:**
   Isso criará um ambiente backend isolado na nuvem para desenvolvimento.
   ```bash
   npx ampx sandbox
   ```

4. **Inicie o servidor de desenvolvimento:**
   Em um novo terminal:
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) para ver o resultado.

## Estrutura do Projeto

- `/amplify`: Definições de infraestrutura (Backend-as-Code).
  - `/amplify/auth`: Configuração do Cognito.
  - `/amplify/data`: Esquema de dados e autorização.
  - `/amplify/storage`: Configuração do S3.
- `/app`: Rotas e componentes do Next.js (App Router).
  - `/app/admin`: Módulo administrativo protegido por Auth.
  - `/app/api`: Endpoints auxiliares (Upload).
  - `/app/actions`: Server Actions para manipulação de dados via Amplify.
- `/components`: Componentes React modulares.
- `/lib`: Utilitários (Amplify client, Sessão, Slug).
- `/public`: Ativos estáticos como fontes e imagens locais.
- `/scripts`: Scripts utilitários para importação de dados Legados (WP).

## Licença

Este projeto é de uso privado da Fitmass.

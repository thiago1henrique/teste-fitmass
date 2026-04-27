# Fitmass

Fitmass é uma plataforma web moderna dedicada ao setor de fitness e bem-estar, oferecendo uma experiência completa tanto para usuários finais quanto para administradores.

## Tecnologias

Este projeto utiliza as tecnologias mais recentes do ecossistema Web:

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) com [Prisma ORM](https://www.prisma.io/)
- **Editor de Conteúdo:** [Tiptap](https://tiptap.dev/) (Rich Text Editor customizado)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Autenticação:** JWT baseado em [Jose](https://github.com/panva/jose) e [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## Funcionalidades

- **Dashboard Administrativo:** Gestão completa de usuários, postagens e métricas de desempenho.
- **Blog Dinâmico:** Sistema de blog com suporte a categorias, contagem de visualizações e SEO otimizado.
- **Editor Rich Text:** Interface intuitiva para criação de conteúdo com suporte a imagens e links.
- **Gestão de Equipe:** Controle de acesso baseado em funções (ADMIN, EDITOR).
- **Design Responsivo:** Interface moderna adaptada para todos os dispositivos.
- **Personalização:** Seções dinâmicas e integração com fontes personalizadas (Aero Matics).

## Instalação e Configuração

### Pré-requisitos

- Node.js (versão recomendada v18 ou superior)
- Instância do PostgreSQL

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

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto seguindo o modelo do `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/fitmass"
   AUTH_SECRET="sua_chave_secreta"
   SEED_ADMIN_EMAIL="admin@fitmass.com.br"
   SEED_ADMIN_PASSWORD="sua_senha_segura"
   ```

4. **Prepare o banco de dados:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) para ver o resultado.

## Estrutura do Projeto

- `/app`: Rotas e componentes do Next.js (App Router).
- `/app/admin`: Módulo administrativo protegido.
- `/app/api`: Endpoints da API.
- `/components`: Componentes React reutilizáveis.
- `/lib`: Utilitários e configurações de bibliotecas (Prisma, Sessão).
- `/prisma`: Esquema do banco de dados e sementes (seeding).
- `/public`: Ativos estáticos como fontes e imagens.
- `/scripts`: Scripts utilitários para importação e correção de dados.

## Licença

Este projeto é de uso privado.

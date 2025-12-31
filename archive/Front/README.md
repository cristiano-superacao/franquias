# Front (legado)

Este diretório contém uma versão antiga/alternativa da interface.

- Não utilizar este projeto para deploy em produção.
- O serviço de produção está no diretório raiz do workspace.
- Componentes e ideias daqui podem ser referenciados, mas o build e o `next start` devem ser executados no projeto raiz.

Se precisar, posso mover este diretório para `archive/Front/` para evitar qualquer confusão em pipelines.
# Sistema de Gestão de Franquias

## Visão Geral
Plataforma moderna para gestão de franquias, desenvolvida com Next.js (App Router), Tailwind CSS e React. O sistema prioriza performance, acessibilidade, responsividade e experiência do usuário.

---

## Tecnologias Utilizadas
- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- TypeScript
- Recharts (gráficos)

---

## Estrutura de Pastas
```
Front/
  app/           # Páginas e rotas (Next.js App Router)
  components/    # Componentes reutilizáveis (UI, gráficos, sidebar, toast)
  hooks/         # Hooks customizados (ex: useFetch)
  styles/        # Estilos globais (Tailwind)
```

---

## Funcionalidades Principais
- Dashboard: KPIs, metas, gráficos e navegação rápida
- Gestão de Lojas: visualização e filtros
- Gestão de Estoque: categorias (alimentos, limpeza)
- Gestão de Caixa: fluxo de caixa
- Gestão de Comissões e Metas
- Feedback visual global (toast)
- Acessibilidade e responsividade

---

## Layout Responsivo
- Tailwind CSS para breakpoints (`sm`, `md`, `lg`, `xl`)
- Sidebar adaptativa (fixa no desktop, drawer no mobile)
- Componentes com padding, espaçamento e fontes escaláveis
- Botões e inputs com feedback visual e foco acessível

---

## Componentes Globais
- DashboardSidebar: navegação principal
- KPICards: indicadores-chave
- MetasBarChart: gráfico de metas
- Toast: feedback visual global
- MobileNav: barra inferior fixa para navegação em mobile
- Table (UI): wrappers com caption e escopo acessível para tabelas

---

## Hooks Customizados
- useFetch: busca dados de APIs, otimizado com useCallback/useMemo
  - Suporta `NEXT_PUBLIC_USE_MOCK=1` para ignorar chamadas a `/api/*` em export estático e usar `lib/mockApi.ts` diretamente.

---

## Boas Práticas
- Código limpo, tipado e modular
- Separação clara de responsabilidades
- Uso de animações suaves e acessíveis
- Mensagens de erro e sucesso visíveis (toast)
- Testado em múltiplos breakpoints

---

## Como Rodar o Projeto
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Ambiente de desenvolvimento (se travar lock, encerre processos e limpe `.next`):
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
   npm run dev
   ```
3. Preview estático com mock (recomendado no Windows):
  - Executa build com `NEXT_PUBLIC_USE_MOCK=1` e serve `out/` em `http://localhost:3001`:
  ```bash
  npm run preview
  ```
  - Se preferir executar manualmente:
  ```powershell
  # Build com mock ativo
  $env:NEXT_PUBLIC_USE_MOCK = "1"; npm run build
  # Servir conteúdo estático
  npx --yes serve out -l 3001
  ```
  Isso garante que páginas que chamam `/api/*` utilizem o mock local durante o export estático, evitando `404`.

---

## Guia Rápido de Papéis e Navegação (Demo)
Este projeto usa um modelo multi-tenant de demonstração (localStorage), com papéis e escopos:

- **super_admin** (acesso total)
  - Credenciais: `super` / `super123`
  - Rotas: `/dashboard`, `/admin/empresas`, `/admin/lojas`, `/estoque/*`, `/caixa/fluxo`, `/config/comissoes`

- **company_admin** (acesso às lojas da sua empresa)
  - Credenciais: `alpha_admin` / `alpha123` (empresa Alpha), `beta_admin` / `beta123` (empresa Beta)
  - Rotas: `/dashboard` (apenas lojas da empresa), `/empresa/onboarding`, `/empresa/franquias`, `/empresa/usuarios`, `/estoque/*`, `/caixa/fluxo`, `/config/comissoes`

- **franchise_user** (acesso apenas à franquia vinculada)
  - Credenciais: `centro` / `centro123` (Loja Centro)
  - Rotas: `/dashboard` (apenas a franquia), `/estoque/*`, `/caixa/fluxo`

Observações:
- Em produção, substitua o armazenamento local por backend com autenticação/RBAC real.
- Para GitHub Pages sob subpasta, ajuste `basePath` em `next.config.js`.

---

## Paleta e Identidade Visual
- Brand principal: `#CCE3DE`
- Superfícies: `surface-950`, `surface-900`, `surface-850` configuradas em `tailwind.config.js`
- Estilos globais com foco acessível em `styles/globals.css`

## Páginas e Módulos
- Login redesenhado com layout dividido e blur suave: `app/login/page.tsx`
- Super Admin — Empresas: `app/admin/empresas/page.tsx`
- Admin — Lojas: `app/admin/lojas/page.tsx`
- Onboarding de Empresa: `app/empresa/onboarding/page.tsx`
- Gestão de Franquias da Empresa: `app/empresa/franquias/page.tsx`
- Gestão de Usuários da Empresa: `app/empresa/usuarios/page.tsx`
- Dashboard: `app/dashboard/page.tsx`
- Estoque (Alimentos/Limpeza): `app/estoque/alimentos/page.tsx`, `app/estoque/limpeza/page.tsx`
- Caixa — Fluxo: `app/caixa/fluxo/page.tsx`
- Configurar Comissões: `app/config/comissoes/page.tsx`

## Dicas de Dev
- Se o dev travar por lock: encerre processos Node, limpe `.next` e reinicie `npm run dev`.
- Em export estático, as rotas `/app/api/*` estão desabilitadas; usamos `lib/mockApi.ts` e `hooks/useFetch.ts` com fallback.
- As guardas de acesso por papel estão em `lib/auth.ts` (`requireRole`).

---

> Documentação atualizada — layout responsivo e profissional com paleta `surface/brand`.

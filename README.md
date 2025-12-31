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

---

## Hooks Customizados
- useFetch: busca dados de APIs, otimizado com useCallback/useMemo

---

## Boas Práticas
- Código limpo, tipado e modular
- Separação clara de responsabilidades
- Uso de animações suaves e acessíveis
- Mensagens de erro e sucesso visíveis (toast)
- Testado em múltiplos breakpoints

---

## Scripts
- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build produção
- `npm start`: iniciar servidor
- `npm run db:backup`: backup modular por schema (requer `pg_dump`)
- `npm run railway:login|init|up`: comandos auxiliares para deploy Railway

## Deploy (Railway)
1. `npm run railway:login` (login interativo)
2. `npm run railway:init` (inicializa projeto)
3. `railway add postgresql`
4. Defina `DATABASE_URL` via `railway variables set` (copie da UI)
5. `npm run prisma:generate` e `npx prisma db push`
6. `npm run railway:up`

> Dica: use o arquivo `.env.example` como referência e mantenha credenciais apenas nas variáveis do Railway.

### Aviso sobre `Front/` (legado)
- `Front/` é um diretório legado/alternativo do front. Não faça deploy a partir dele.
- O deploy deve apontar para a raiz do projeto (onde ficam `app/` e APIs).
- Para arquivar de vez, mova `Front/` para `archive/Front/` quando não houver arquivos abertos no editor.

## Backup
- Requer `pg_dump` instalado (PostgreSQL client)
- `npm run db:backup` gera dumps dos schemas `franquias`, `caixa`, `metas`, `public` em `backups/<data_hora>/`

---

> Documentação atualizada — layout responsivo, profissional e APIs reais.

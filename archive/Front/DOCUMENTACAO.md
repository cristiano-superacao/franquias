# Sistema de Gestão de Franquias

## Visão Geral

Este sistema é uma plataforma moderna para gestão de franquias, desenvolvido com Next.js (App Router), Tailwind CSS, Prisma ORM e NextAuth.js. O foco é performance, acessibilidade, responsividade e experiência do usuário.

---

## Tecnologias Utilizadas

- **Next.js 14+** (App Router)
- **React 18+**
- **Tailwind CSS**
- **Prisma ORM** (PostgreSQL)
- **NextAuth.js** (autenticação)
- **TypeScript**

---

## Estrutura de Pastas

```
Front/
  app/           # Páginas e rotas (Next.js App Router)
  components/    # Componentes reutilizáveis (UI, gráficos, sidebar, toast)
  hooks/         # Hooks customizados (ex: useFetch)
  prisma/        # Schema do banco de dados
  styles/        # Estilos globais (Tailwind)
```

---

## Funcionalidades Principais

- **Dashboard**: KPIs, metas, gráficos e navegação rápida
- **Gestão de Lojas**: CRUD de lojas, visualização e filtros
- **Gestão de Estoque**: Separação por categorias (alimentos, limpeza)
- **Gestão de Caixa**: Fluxo de caixa, lançamentos
- **Gestão de Comissões e Metas**
- **Autenticação**: Login seguro com NextAuth.js (Credentials)
- **Feedback Visual**: Sistema global de toast para mensagens
- **Acessibilidade**: Aria-labels, foco visível, contraste
- **Responsividade**: Layout adaptado para mobile, tablet e desktop
- **Performance**: Importação dinâmica, memoização, hooks otimizados

---

## Layout Responsivo

- Utiliza Tailwind CSS para breakpoints (`sm`, `md`, `lg`, `xl`)
- Sidebar adaptativa (fixa no desktop, drawer no mobile)
- Componentes com padding, espaçamento e fontes escaláveis
- Botões e inputs com feedback visual e foco acessível

---

## Fluxo de Autenticação

1. Usuário acessa `/login`
2. Autenticação via NextAuth.js (Credentials)
3. Rotas sensíveis (ex: `/dashboard`) protegidas por sessão
4. UI condicional para usuários autenticados

---

## Componentes Globais

- **DashboardSidebar**: Navegação principal
- **KPICards**: Exibição de indicadores-chave
- **MetasBarChart**: Gráfico de metas
- **Toast**: Feedback visual global

---

## Hooks Customizados

- **useFetch**: Busca dados de APIs, otimizado com useCallback/useMemo

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
2. Configure o banco de dados em `prisma/schema.prisma`
3. Rode as migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

---

## Contato e Suporte

Dúvidas ou sugestões? Entre em contato com o time de desenvolvimento.

---

> Documentação gerada automaticamente — layout responsivo, profissional e atualizado.

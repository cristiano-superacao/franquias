# Sistema de Gestão de Franquias

## Visão Geral
Plataforma moderna para gestão de franquias, desenvolvida com Next.js (App Router), Tailwind CSS e React. O sistema prioriza performance, acessibilidade, responsividade e experiência do usuário.

---

## Tecnologias Utilizadas
- Next.js 14+ (App Router)
- React 18+
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

## Como Rodar o Projeto
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute o build estático:
   ```bash
   npm run build && npx next export
   ```
3. O conteúdo exportado estará na pasta `out/` para deploy estático (ex: GitHub Pages).

---

> Documentação gerada automaticamente — layout responsivo, profissional e atualizado.

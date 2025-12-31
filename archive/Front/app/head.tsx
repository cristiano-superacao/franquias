export default function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Painel de gestão de franquias — dashboards e KPIs" />
      <meta name="theme-color" content="#CCE3DE" />
      <meta name="color-scheme" content="dark" />
      <link rel="icon" href="/favicon.svg" />
      <link rel="manifest" href="/manifest.json" />
      {/* Open Graph */}
      <meta property="og:title" content="Franquias — Painel" />
      <meta property="og:description" content="Gestão de franquias com dashboards, KPIs e módulos de estoque e caixa." />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Franquias" />
      <meta property="og:locale" content="pt_BR" />
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Franquias — Painel" />
      <meta name="twitter:description" content="Gestão de franquias com dashboards, KPIs e módulos de estoque e caixa." />
      <title>Franquias — Painel</title>
    </>
  );
}

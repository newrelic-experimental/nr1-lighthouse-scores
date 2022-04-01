export const EXCLUDED_TYPES = ["screenshot", "filmstrip", "treemap-data"];

export const SCORE_QUERIES = [
  {
    title: "Performance",
    query: `FROM lighthousePerformance SELECT * WHERE requestedUrl = 'https://developer.newrelic.com/' LIMIT 1`,
  },
  {
    title: "Best practices",
    query: `FROM lighthouseBestPractices SELECT * WHERE requestedUrl = 'https://developer.newrelic.com/' LIMIT 1`,
  },
  {
    title: "SEO",
    query: `FROM lighthouseSeo SELECT * WHERE requestedUrl = 'https://developer.newrelic.com/' LIMIT 1`,
  },
  {
    title: "PWA",
    query: `FROM lighthousePwa SELECT * WHERE requestedUrl = 'https://developer.newrelic.com/' LIMIT 1`,
  },
  {
    title: "Accessibility",
    query: `FROM lighthouseAccessibility SELECT * WHERE requestedUrl = 'https://developer.newrelic.com/' LIMIT 1`,
  },
];

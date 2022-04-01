export const ATTRIBUTES = {
  ["firstContentfulPaint"]: {
    name: "First Contentful Paint (FCP)",
    id: "fcp",
    weight: 10,
    units: "s",
    link: "https://web.dev/first-contentful-paint/",
    explanation:
      "FCP measures how long it takes the browser to render the first piece of DOM content after a user navigates to your page. Images, non-white <canvas> elements, and SVGs on your page are considered DOM content; anything inside an iframe isn't included.",
    scores: { fast: 1.8, mid: 3 },
    metrics: {weight: 0.10, median: 1600, p10: 934},
  },
  ["largestContentfulPaint"]: {
    name: "Largest Contentful Paint (LCP)",
    id: "lcp",
    weight: 25,
    units: "s",
    link: "https://web.dev/lcp/",
    explanation:
      "The Largest Contentful Paint (LCP) metric reports the render time of the largest image or text block visible within the viewport, relative to when the page first started loading.",
    scores: { fast: 2.5, mid: 4 },
    metrics: {weight: 0.25, median: 2400, p10: 1200},
  },
  ["interactive"]: {
    name: "Time to Interactive (TTI)",
    id: "tti",
    weight: 10,
    units: "s",
    link: "https://web.dev/interactive/",
    explanation:
      "TTI measures how long it takes a page to become fully interactive. A page is considered fully interactive when:\n- The page displays useful content, which is measured by the First Contentful Paint,\n- Event handlers are registered for most visible page elements, and\n- The page responds to user interactions within 50 milliseconds.",
    scores: { fast: 3.8, mid: 7.3 },
    metrics: {weight: 0.10, median: 4500, p10: 2468},
  },
  ["totalBlockingTime"]: {
    name: "Total Blocking Time (TBT)",
    id: "tbt",
    weight: 30,
    units: "ms",
    link: "https://web.dev/lighthouse-total-blocking-time/",
    explanation:
      "TBT measures the total amount of time that a page is blocked from responding to user input, such as mouse clicks, screen taps, or keyboard presses. The sum is calculated by adding the blocking portion of all long tasks between First Contentful Paint and Time to Interactive. Any task that executes for more than 50 ms is a long task. The amount of time after 50 ms is the blocking portion. For example, if Lighthouse detects a 70 ms long task, the blocking portion would be 20 ms.",
    scores: { fast: 0.2, mid: 0.6 },
    metrics: {weight: 0.30, median: 350, p10: 150},
  },
  ["cumulativeLayoutShift"]: {
    name: "Cumulative Layout Shift (CLS)",
    id: "cls",
    weight: 15,
    units: "score",
    link: "https://web.dev/cls/",
    explanation:
      "CLS is a measure of the largest burst of layout shift scores for every unexpected layout shift that occurs during the entire lifespan of a page.\nA layout shift occurs any time a visible element changes its position from one rendered frame to the next. (See below for details on how individual layout shift scores are calculated.)",
    scores: { fast: 0.1, mid: 0.25 },
    metrics: {weight: 0.15, median: 0.25, p10: 0.1},
  },
  ["speedIndex"]: {
    name: "Speed Index (SI)",
    id: "si",
    weight: 10,
    units: "s",
    link: "https://web.dev/speed-index/",
    explanation:
      "Speed Index measures how quickly content is visually displayed during page load. Lighthouse first captures a video of the page loading in the browser and computes the visual progression between frames. Lighthouse then uses the Speedline Node.js module to generate the Speed Index score.",
    scores: { fast: 3.4, mid: 5.8 },
    metrics: {weight: 0.10, median: 2300, p10: 1311},
  },
};

export const mainThresholds = {
  good: 90,
  moderate: 50,
}
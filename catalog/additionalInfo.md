Core Web Vitals have become the standard method of measuring the performance of sites, and we currently collect these with the [New Relic Browser Agent](https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/introduction-browser-monitoring/). However, Google Lighthouse can generate many additional metrics and data points that are incredibly useful for improving PageSpeed and performance, which will ultimately affect Users experience of your site.

There has been a Synthetics Script knocking around for a while that you can use to generate performance metrics, but there is so much incredibly useful data from a Lighthouse Report that can tell you your overall scores in each of the categories, but also specific issues that lead to the scoring and ways to improve them.

To make the most of all this data I built a suite of Custom Visualizations to allow you to display in different ways on Dashboards, along with a Nerdpack that gives you an overview of all sites being monitored in your account, and a handy Synthetics Script Builder to monitor new ones.

I tried to remain as faithful as possible to the current Lighthouse Report layout to keep it familiar to customers.
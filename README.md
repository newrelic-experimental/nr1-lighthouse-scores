[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# Lighthouse Scores & Audits 

![Lighthouse favicon](./src/images/lh_favicon_32px.png)<a href="https://developers.google.com/web/tools/lighthouse">Powered by Lighthouse</a></img>
        
![GitHub last commit](https://img.shields.io/github/last-commit/newrelic-experimental/nr1-lighthouse-scores) ![GitHub issues](https://img.shields.io/github/issues/newrelic-experimental/nr1-lighthouse-scores) ![GitHub issues closed](https://img.shields.io/github/issues-closed/newrelic-experimental/nr1-lighthouse-scores) ![GitHub pull requests](https://img.shields.io/github/issues-pr/newrelic-experimental/nr1-lighthouse-scores) ![GitHub pull requests closed](https://img.shields.io/github/issues-pr-closed/newrelic-experimental/nr1-lighthouse-scores)


> This Application allows you to build Synthetic Scripts for retrieving Lighthouse Metrics and Audits via the [PageSpeed Insights API](https://developers.google.com/web/tools/lighthouse#psi), see all of your site scores across your New Relic account, and includes Custom Visualizations you can add to any dashboard.

## Value 

|Metrics | Events | Logs | Traces | Visualization | Automation |
|:-:|:-:|:-:|:-:|:-:|:-:|
|:x:|:white_check_mark:|:x:|:x:|:white_check_mark:|:white_check_mark:|

### List of Events
|Name | Type | Description |
|:-:|:-:|:-:|
|*lighthousePerformance* | Event|  *The overall Performance score of your site, including performance audit information*|
|*lighthouseAccessibility* | Event|  *The overall Accessibility score of your site, including Accessibility audit information*|
|*lighthouseSeo* | Event|  *The overall SEO score of your site, including SEO audit information*|
|*lighthousePwa* | Event|  *The overall PWA score of your site, including PWA audit information*|
|*lighthouseBestPractices* | Event|  *The overall Best Practices score of your site, including Best Practices audit information*|


## Installation

Clone repo then:
 - `npm install`
 - `nr1 nerdpack:uuid -gf`

To publish to your account:
 - `nr1 nerdpack:publish`
  
To serve locally:
 - `nr1 nerdpack:serve`


## Getting Started

Once you have the application in your New Relic account, you will need to create a Synthetics Monitor. The app includes a handy script builder which allows you to enter your relevant details, and copy/paste the resulting script into a new [Scripted API monitor](https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/scripting-monitors/write-synthetic-api-tests). To complete this you will need the following:

 - Your New Relic account [License Key](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/#keys-ui)
 - A [PageSpeed API Key](https://developers.google.com/speed/docs/insights/v5/get-started#APIKey)

You will need to create a Scripted API monitor with the following settings:

 - Node 10 (Legacy) - *Required*
 - A single geographic location *Required*
 - 6 Hour Time Period - *Recommended*

Once you have created the script and it has run at least once, you will then be able to see data populate in the Lighthouse Score app.

## Features

The app includes:
 - Overall scores for each Lighthouse Category
   - Performance
   - SEO
   - Best Practices
   - PWA
   - Accessibility
 - Scores for Web Core Vitals and other Performance Metrics
   - Time To Interactive (First Input Delay)
   - Largest Contentful Paint
   - Cumulative Layout Shift
   - First Contentful Paint
   - Speed Index
   - Total Blocking Time
 - Audit details for each category
 - Metrics broken down by device type
 - Custom visualisations so you can add unique data to any dashboard in New Relic
## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

>We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.


## Contributing

We encourage your contributions to improve [Project Name]! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project. If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company, please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License. 

Lighthouse Scores and Audits is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.



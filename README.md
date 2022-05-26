[![New Relic Experimental header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Experimental.png)](https://opensource.newrelic.com/oss-category/#new-relic-experimental)

# Lighthouse Scores & Audits

<svg width="14px" height="14px" viewBox="0 0 24 24"><defs><linearGradient x1="57.456%" y1="13.086%" x2="18.259%" y2="72.322%" id="lh-topbar__logo--a"><stop stop-color="#262626" stop-opacity=".1" offset="0%"></stop><linearGradient x1="100%" y1="50%" x2="0%" y2="50%" id="lh-topbar__logo--b"><stop stop-color="#262626" stop-opacity=".1" offset="0%"></stop><stop stop-color="#262626" stop-opacity="0" offset="100%"></stop></linearGradient><linearGradient x1="58.764%" y1="65.756%" x2="36.939%" y2="50.14%" id="lh-topbar__logo--c"><stop stop-color="#262626" stop-opacity=".1" offset="0%"></stop><stop stop-color="#262626" stop-opacity="0" offset="100%"></stop>
</linearGradient><linearGradient x1="41.635%" y1="20.358%" x2="72.863%" y2="85.424%" id="lh-topbar__logo--d"><stop stop-color="#FFF" stop-opacity=".1" offset="0%"></stop><stop stop-color="#FFF" stop-opacity="0" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M12 3l4.125 2.625v3.75H18v2.25h-1.688l1.5 9.375H6.188l1.5-9.375H6v-2.25h1.875V5.648L12 3zm2.201 9.938L9.54 14.633 9 18.028l5.625-2.062-.424-3.028zM12.005 5.67l-1.88 1.207v2.498h3.75V6.86l-1.87-1.19z" fill="#F44B21"></path><path fill="#FFF" d="M14.201 12.938L9.54 14.633 9 18.028l5.625-2.062z"></path><path d="M6 18c-2.042 0-3.95-.01-5.813 0l1.5-9.375h4.326L6 18z" fill="url(#lh-topbar__logo--a)" fill-rule="nonzero" transform="translate(6 3)"></path><path fill="#FFF176" fill-rule="nonzero" d="M13.875 9.375v-2.56l-1.87-1.19-1.88 1.207v2.543z"></path><path fill="url(#lh-topbar__logo--b)" fill-rule="nonzero" d="M0 6.375h6v2.25H0z" transform="translate(6 3)"></path><path fill="url(#lh-topbar__logo--c)" fill-rule="nonzero" d="M6 6.375H1.875v-3.75L6 0z" transform="translate(6 3)"></path><path fill="url(#lh-topbar__logo--d)" fill-rule="nonzero" d="M6 0l4.125 2.625v3.75H12v2.25h-1.688l1.5 9.375H.188l1.5-9.375H0v-2.25h1.875V2.648z" transform="translate(6 3)"></path></g></svg><a href="https://developers.google.com/web/tools/lighthouse">Powered by Lighthouse</a></img>

![GitHub last commit](https://img.shields.io/github/last-commit/newrelic-experimental/nr1-lighthouse-scores) ![GitHub issues](https://img.shields.io/github/issues/newrelic-experimental/nr1-lighthouse-scores) ![GitHub issues closed](https://img.shields.io/github/issues-closed/newrelic-experimental/nr1-lighthouse-scores) ![GitHub pull requests](https://img.shields.io/github/issues-pr/newrelic-experimental/nr1-lighthouse-scores) ![GitHub pull requests closed](https://img.shields.io/github/issues-pr-closed/newrelic-experimental/nr1-lighthouse-scores)

> This Application allows you to build Synthetic Scripts for retrieving Lighthouse Metrics and Audits via the [PageSpeed Insights API](https://developers.google.com/web/tools/lighthouse#psi), see all of your site scores across your New Relic account, and includes Custom Visualizations you can add to any dashboard.

## Value

| Metrics |       Events       | Logs | Traces |   Visualization    |     Automation     |
| :-----: | :----------------: | :--: | :----: | :----------------: | :----------------: |
|   :x:   | :white_check_mark: | :x:  |  :x:   | :white_check_mark: | :white_check_mark: |

### List of Events

|           Name            | Type  |                                         Description                                         |
| :-----------------------: | :---: | :-----------------------------------------------------------------------------------------: |
|  _lighthousePerformance_  | Event |    _The overall Performance score of your site, including performance audit information_    |
| _lighthouseAccessibility_ | Event |  _The overall Accessibility score of your site, including Accessibility audit information_  |
|      _lighthouseSeo_      | Event |            _The overall SEO score of your site, including SEO audit information_            |
|      _lighthousePwa_      | Event |            _The overall PWA score of your site, including PWA audit information_            |
| _lighthouseBestPractices_ | Event | _The overall Best Practices score of your site, including Best Practices audit information_ |
## Description
Core Web Vitals have become the standard method of measuring the performance of sites, and we currently collect these with the [New Relic Browser Agent](https://docs.newrelic.com/docs/browser/browser-monitoring/getting-started/introduction-browser-monitoring/). However, Google Lighthouse can generate many additional metrics and data points that are incredibly useful for improving PageSpeed and performance, which will ultimately affect Users experience of your site.

There has been a Synthetics Script knocking around for a while that you can use to generate performance metrics, but there is so much incredibly useful data from a Lighthouse Report that can tell you your overall scores in each of the categories, but also specific issues that lead to the scoring and ways to improve them.

To make the most of all this data I built a suite of Custom Visualizations to allow you to display in different ways on Dashboards, along with a Nerdpack that gives you an overview of all sites being monitored in your account, and a handy Synthetics Script Builder to monitor new ones.

I tried to remain as faithful as possible to the current Lighthouse Report layout to keep it familiar to customers.
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

- Node 10 (Legacy) - _Required_
- A single geographic location _Required_
- 6 Hour Time Period - _Recommended_

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
   - This breaks down the resources and page elements that contributed to the overall score, as well as including suggestions for improving your scores
 - Metrics broken down by device type
 - Custom visualisations so you can add unique data to any dashboard in New Relic
   - Each one of them is customisable so you can show/hide certain elements for more/less detail
   - There is also a Custom Viz for the Audit Details of each category. These also include toggles so you can just show tests that failed
 - A Treemap view of the resources and packages used to build your application, so you can identify where to make improvements
 - A handy script builder
   - All you need are a PageSpeed Insights API Key and your New Relic License Key
   - You can choose to run on the the New/Legacy Node Runtime
   - You can select the device you want to run the test from (Desktop/Mobile)
   - You can select which Audits to run

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

> We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.

## Contributing

We encourage your contributions to improve [Project Name]! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project. If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company, please drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License.

Lighthouse Scores and Audits is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

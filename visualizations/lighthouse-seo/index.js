import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  HeadingText,
  NrqlQuery,
  Spinner,
  AutoSizer,
  Button,
  BlockText,
  Link,
  CardSection,
  TableHeaderCell,
  TableRow,
  TableHeader,
  TableRowCell,
  Stack,
  StackItem,
} from "nr1";
import Opportunities from "../../src/components/Opportunities";
import Passed from "../../src/components/Passed";
import Diagnostics from "../../src/components/Diagnostics";
import Lighthouse from "../../src/components/Lighthouse";
import GenericGroup from "../../src/components/GenericGroup";
import LighthouseHeader from "../../src/components/LighthouseHeader";
import NoDataState from "../../src/no-data-state";
import ErrorState from "../../src/error-state";
import MetadataTooltip from "../../src/components/metadata-tooltip";

import { mainThresholds } from "../../utils/attributes";
import {
  convertAuditRef,
  getMainColor,
  parseScoreFromNrqlResult,
} from "../../utils/helpers";
import ScoreVisualization from "../../src/components/ScoreVisualization";

export default class LighthouseSeoVisualization extends React.Component {
  // Custom props you wish to be configurable in the UI must also be defined in
  // the nr1.json file for the visualization. See docs for more details.
  static propTypes = {
    uiSettings: PropTypes.shape({
      hidePassed: PropTypes.Boolean,
      hideManual: PropTypes.Boolean,
      hideNull: PropTypes.Boolean,
      hideNotApplicable: PropTypes.Boolean,
    }),

    /**
     * An array of objects consisting of a nrql `query` and `accountId`.
     * This should be a standard prop for any NRQL based visualizations.
     */
    nrqlSettings: PropTypes.shape({
      accountId: PropTypes.number,
      timeframe: PropTypes.string,
      requestedUrl: PropTypes.string,
      strategy: PropTypes.string,
    }),
  };

  /**
   * Restructure the data for a non-time-series, facet-based NRQL query into a
   * form accepted by the Recharts library's RadarChart.
   * (https://recharts.org/api/RadarChart).
   * [{'key':'url','valueType':'url','label':'URL'},{'valueType':'bytes','key':'totalBytes','label':'Transfer Size'},{'key':'wastedMs','label':'Potential Savings','valueType':'timespanMs'}
   */

  transformData = (rawData) => {
    const {
      uiSettings: { hideNull },
    } = this.props;
    const auditRefObject = convertAuditRef(rawData);
    console.log({ auditRefObject });
    const allOpportunities = auditRefObject.filter(
      (audit) => audit.details && audit.details.type == "opportunity"
    );
    const opportunities = allOpportunities.filter(
      (opp) => opp.score > 0 && opp.score < mainThresholds.good / 100
    );
    const diagnostics = auditRefObject.filter((audit) =>
      hideNull
        ? !audit.score ||
          (audit.details &&
            audit.details.type !== "opportunity" &&
            audit.score < mainThresholds.good / 100)
        : audit.score !== null &&
          audit.details &&
          audit.details.type !== "opportunity" &&
          audit.score < mainThresholds.good / 100
    );
    console.log({ diagnostics });
    const contentGroup = auditRefObject.filter(
      (audit) =>
        audit.group === "seo-content" &&
        audit.score !== null &&
        audit.score < mainThresholds.good / 100
    );
    const crawlGroup = auditRefObject.filter(
      (audit) =>
        audit.group === "seo-crawl" &&
        audit.score !== null &&
        audit.score < mainThresholds.good / 100
    );
    const mobileGroup = auditRefObject.filter(
      (audit) =>
        audit.group === "seo-mobile" &&
        audit.score !== null &&
        audit.score < mainThresholds.good / 100
    );
    const groups1 = [...new Set(diagnostics.map((audit) => audit.group))];
    const groups2 = [...new Set(auditRefObject.map((audit) => audit.group))];
    console.log({ groups1, groups2 });
    const passed = auditRefObject.filter(
      (audit) => audit.score && audit.score >= mainThresholds.good / 100
    );

    const manualGroup = auditRefObject.filter(
      (audit) => audit.scoreDisplayMode === "manual"
    );
    const notApplicable = auditRefObject.filter(
      (audit) => audit.scoreDisplayMode === "notApplicable"
    );
    return {
      auditRefObject,
      opportunities,
      passed,
      manualGroup,
      notApplicable,
      contentGroup,
      crawlGroup,
      mobileGroup,
    };
  };

  render() {
    const { nrqlSettings, uiSettings } = this.props;
    // console.log({ nrqlSettings, uiSettings });
    const { hideManual, hideNotApplicable, hidePassed } = uiSettings;

    const { requestedUrl, accountId } = nrqlSettings;

    const nrqlQueryPropsSet = requestedUrl && accountId;

    if (!nrqlQueryPropsSet) {
      return <NoDataState />;
    }
    let { timeframe, strategy } = nrqlSettings;
    timeframe = timeframe || "4 hours";
    strategy = strategy || "desktop";
    console.log({ timeframe, requestedUrl, strategy, nrqlSettings });

    const scoreQuery = `FROM lighthouseSeo SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago`;
    const auditRefQuery = `FROM lighthouseSeo SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago LIMIT 1`;
    const metadataQuery = `FROM lighthouseSeo SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago LIMIT 1`;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <NrqlQuery
            query={scoreQuery}
            accountId={accountId}
            pollInterval={NrqlQuery.AUTO_POLL_INTERVAL}
          >
            {({ data, loading, error }) => {
              if (loading) {
                return <Spinner />;
              }

              if (error) {
                return <ErrorState error={error} />;
              }

              if (!data.length) {
                return <NoDataState />;
              }
              const categoryScore = parseScoreFromNrqlResult(data);
              const color = getMainColor(categoryScore);
              console.log({ color });
              const series = [
                { x: "progress", y: categoryScore, color },
                {
                  x: "remainder",
                  y: 100 - categoryScore,
                  color: "transparent",
                },
              ];
              // fs.writeFileSync('thing.json', String(resultData))
              const metadata = data[0].metadata;
              // console.log({ auditRefObject, opportunities });
              return (
                <>
                  <Card>
                    <CardBody>
                      <LighthouseHeader
                        title="SEO Audits"
                        strategy={strategy}
                        requestedUrl={requestedUrl}
                        query={metadataQuery}
                        accountId={accountId}
                      />

                      <CardSection />
                      <Stack
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}
                        style={{
                          textAlign: "center",
                          width: "100%",
                          alignItems: "center",
                          paddingTop: "15px",
                        }}
                      >
                        <StackItem style={{ width: "200px" }}>
                          <ScoreVisualization
                            score={categoryScore}
                            color={color}
                            series={series}
                          />
                        </StackItem>
                        <StackItem>
                          <HeadingText
                            type={HeadingText.TYPE.HEADING_1}
                            spacingType={[HeadingText.SPACING_TYPE.MEDIUM]}
                          >
                            SEO
                          </HeadingText>
                          <BlockText
                            style={{ fontSize: "1.4em", lineHeight: "2em" }}
                            spacingType={[BlockText.SPACING_TYPE.MEDIUM]}
                          >
                            These checks ensure that your page is following
                            basic search engine optimization advice. There are
                            many additional factors Lighthouse does not score
                            here that may affect your search ranking, including
                            performance on{" "}
                            <Link to="https://web.dev/learn-web-vitals/">
                              Core Web Vitals
                            </Link>
                            .{" "}
                            <Link to="https://support.google.com/webmasters/answer/35769">
                              Learn more
                            </Link>
                            .
                          </BlockText>
                          <Lighthouse />
                        </StackItem>
                      </Stack>
                      <NrqlQuery
                        query={auditRefQuery}
                        accountId={accountId}
                        pollInterval={NrqlQuery.AUTO_POLL_INTERVAL}
                      >
                        {({ data, loading, error }) => {
                          if (loading) {
                            return <Spinner />;
                          }

                          if (error) {
                            return <ErrorState error={error} />;
                          }

                          if (!data.length) {
                            return <NoDataState />;
                          }
                          const resultData = data[0].data[0];
                          // fs.writeFileSync('thing.json', String(resultData))
                          const metadata = data[0].metadata;
                          // console.log(JSON.stringify(metadata))
                          const {
                            opportunities,
                            passed,
                            manualGroup,
                            notApplicable,
                            contentGroup,
                            crawlGroup,
                            mobileGroup,
                          } = this.transformData(resultData);
                          // console.log({ auditRefObject, opportunities });
                          return (
                            <>
                              {contentGroup.length > 0 && (
                                <GenericGroup
                                  group={contentGroup}
                                  title="Content Best Practices"
                                  description=""
                                />
                              )}
                              {crawlGroup.length > 0 && (
                                <GenericGroup
                                  group={crawlGroup}
                                  title="Crawl Best Practices"
                                  description=""
                                />
                              )}
                              {mobileGroup.length > 0 && (
                                <GenericGroup
                                  group={mobileGroup}
                                  title="Mobile Friendly"
                                  description=""
                                />
                              )}
                              {!hideNotApplicable && (
                                <GenericGroup
                                  group={notApplicable}
                                  title="Not Applicable"
                                  description=""
                                />
                              )}
                              {!hideManual && (
                                <GenericGroup
                                  group={manualGroup}
                                  title="Additional items to check manually"
                                  description=""
                                />
                              )}
                              {!hidePassed && <Passed passed={passed} />}
                            </>
                          );
                        }}
                      </NrqlQuery>
                    </CardBody>
                  </Card>
                </>
              );
            }}
          </NrqlQuery>
        )}
      </AutoSizer>
    );
  }
}

const EmptyState = () => (
  <Card className="EmptyState">
    <CardBody className="EmptyState-cardBody">
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Please provide a single NRQL query & account ID pair
      </HeadingText>
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.MEDIUM]}
        type={HeadingText.TYPE.HEADING_4}
      >
        An example NRQL query you can try is:
      </HeadingText>
      <code>
        FROM lighthouseSeo SELECT * WHERE requestedUrl =
        'https://developer.newrelic.com/' LIMIT 1
      </code>
    </CardBody>
  </Card>
);

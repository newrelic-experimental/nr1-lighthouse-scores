import React from "react";
import PropTypes from "prop-types";
import { VictoryPie, VictoryAnimation, VictoryLabel } from "victory";

import {
  Card,
  CardBody,
  HeadingText,
  NrqlQuery,
  Spinner,
  AutoSizer,
  CardSection,
  BlockText,
  Link,
  Table,
  TableHeaderCell,
  TableRow,
  TableHeader,
  TableRowCell,
  Stack,
  StackItem,
} from "nr1";
import { baseLabelStyles } from "../../src/theme";
import Opportunities from "../../src/components/Opportunities";
import LighthouseHeader from "../../src/components/LighthouseHeader";
import Passed from "../../src/components/Passed";
import Diagnostics from "../../src/components/Diagnostics";
import TreemapButton from "../../src/components/TreemapButton";
import Lighthouse from "../../src/components/Lighthouse";
import ScoreVisualization from "../../src/components/ScoreVisualization";
import NoDataState from "../../src/no-data-state";
import ErrorState from "../../src/error-state";
import MetadataTooltip from "../../src/components/metadata-tooltip";

import { mainThresholds } from "../../utils/attributes";
import { getMainColor, parseScoreFromNrqlResult } from "../../utils/helpers";
const zlib = require("zlib");
import { QUANTILE_AT_VALUE } from "../../utils/math.js";
const BOUNDS = {
  X: 300,
  Y: 300,
};

const LABEL_SIZE = 20;
const LABEL_PADDING = 10;
const CHART_WIDTH = BOUNDS.X + LABEL_PADDING * 2;
const CHART_HEIGHT = BOUNDS.Y + LABEL_SIZE;

export default class LighthousePerformanceVisualization extends React.Component {
  // Custom props you wish to be configurable in the UI must also be defined in
  // the nr1.json file for the visualization. See docs for more details.
  static propTypes = {
    uiSettings: PropTypes.shape({
      hidePassed: PropTypes.Boolean,
      hideNull: PropTypes.Boolean,
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
    console.log({ rawData });
    const {
      uiSettings: { hideNull },
    } = this.props;
    const auditRefs = Object.keys(rawData)
      .filter((key) => key.includes("auditRefs_"))
      .reduce((res, key) => ((res[key] = rawData[key]), res), {});

    const auditRefString = Object.keys(auditRefs).map(
      (key, index) => auditRefs[`auditRefs_${index}`]
    );
    const auditRefObject = JSON.parse(auditRefString.join(""));
    const treemapData = auditRefObject.find(
      (ref) => ref.details?.type === "treemap-data"
    );
    const allOpportunities = auditRefObject.filter(
      (audit) => audit.details && audit.details.type == "opportunity"
    );
    const opportunities = allOpportunities.filter((opp) =>
      hideNull
        ? opp.score !== null && opp.score < mainThresholds.good / 100
        : !opp.score ||
          (opp.score !== null && opp.score < mainThresholds.good / 100)
    );

    const diagnostics = auditRefObject.filter((audit) =>
      hideNull
        ? audit.score !== null &&
          audit.details &&
          audit.details.type !== "opportunity" &&
          audit.score < mainThresholds.good / 100
        : !audit.score ||
          (audit.details &&
            audit.details.type !== "opportunity" &&
            audit.score < mainThresholds.good / 100)
    );
    console.log({ auditRefObject, diagnostics, opportunities });
    const passed = auditRefObject.filter(
      (audit) => audit.score && audit.score >= mainThresholds.good / 100
    );
    const everythingElse = auditRefObject.filter(
      (audit) => !audit.details || audit.details.type !== "opportunity"
    );
    return {
      treemapData,
      diagnostics,
      auditRefObject,
      opportunities,
      passed,
    };
  };

  render() {
    const { nrqlSettings, uiSettings } = this.props;
    console.log({ nrqlSettings, uiSettings });
    const { hideManual, hideNotApplicable, hideNull, hidePassed } = uiSettings;

    const { requestedUrl, accountId } = nrqlSettings;

    const nrqlQueryPropsSet = requestedUrl && accountId;

    if (!nrqlQueryPropsSet) {
      return <NoDataState />;
    }
    let { timeframe, strategy } = nrqlSettings;
    timeframe = timeframe || "4 hours";
    strategy = strategy || "desktop";
    // console.log({ timeframe, requestedUrl, strategy, nrqlSettings });

    const scoreQuery = `FROM lighthousePerformance SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago`;
    const auditRefQuery = `FROM lighthousePerformance SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago LIMIT 1`;
    const metadataQuery = `FROM lighthousePerformance SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
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
              // console.log({ data });
              const categoryScore = parseScoreFromNrqlResult(data);
              console.log("Score");

              const color = getMainColor(categoryScore);
              // console.log({ color });
              const series = [
                { x: "progress", y: categoryScore, color },
                {
                  x: "remainder",
                  y: 100 - categoryScore,
                  color: "transparent",
                },
              ];
              const metadata = data[0].metadata;
              // console.log({ auditRefObject, opportunities });
              return (
                <>
                  <Card>
                    <CardBody>
                      <LighthouseHeader
                        title="Performance Audits"
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
                            Performance
                          </HeadingText>
                          <BlockText
                            style={{ fontSize: "1.4em", lineHeight: "2em" }}
                            spacingType={[BlockText.SPACING_TYPE.MEDIUM]}
                          >
                            Values are estimated and may vary. The{" "}
                            <Link to="https://web.dev/performance-scoring/?utm_source=lighthouse&utm_medium=node">
                              performance score is calculated
                            </Link>{" "}
                            directly from these metrics.{" "}
                            <Link to="https://googlechrome.github.io/lighthouse/scorecalc/#FCP=3603&SI=4617&LCP=3758&TTI=23188&TBT=4641&CLS=0&FMP=3603&device=mobile&version=8.6.0">
                              See calculator
                            </Link>
                            .
                          </BlockText>
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
                              console.log("Treemap");

                              const resultData = data[0].data[0];
                              const { finalUrl, locale } = resultData;
                              const metadata = data[0].metadata;
                              // console.log(JSON.stringify(metadata))
                              const { treemapData } =
                                this.transformData(resultData);
                              // console.log({ auditRefObject, opportunities });
                              return (
                                <>
                                  <TreemapButton
                                    metadata={metadata}
                                    treemapData={treemapData}
                                    finalUrl={finalUrl}
                                    requestedUrl={requestedUrl}
                                    locale={locale}
                                  />
                                  {"   "}
                                  <Lighthouse />
                                </>
                              );
                            }}
                          </NrqlQuery>
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

                          const metadata = data[0].metadata;
                          // console.log(JSON.stringify(metadata))
                          const { diagnostics, opportunities, passed } =
                            this.transformData(resultData);
                          // console.log({ auditRefObject, opportunities });
                          return (
                            <>
                              <Opportunities
                                opportunities={opportunities}
                                visualization="Performance"
                              />
                              <Diagnostics
                                diagnostics={diagnostics}
                                visualization="Performance"
                              />
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
        FROM lighthousePerformance SELECT * WHERE requestedUrl =
        'https://developer.newrelic.com/' LIMIT 1
      </code>
    </CardBody>
  </Card>
);

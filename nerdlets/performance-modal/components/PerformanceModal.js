import React from "react";

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
  Stack,
  StackItem,
} from "nr1";
import Opportunities from "../../../src/components/Opportunities";
import LighthouseHeader from "../../../src/components/LighthouseHeader";
import Passed from "../../../src/components/Passed";
import Diagnostics from "../../../src/components/Diagnostics";
import TreemapButton from "../../../src/components/TreemapButton";
import Lighthouse from "../../../src/components/Lighthouse";
import ScoreVisualization from "../../../src/components/ScoreVisualization";
import NoDataState from "../../../src/no-data-state";
import ErrorState from "../../../src/error-state";

import { mainThresholds } from "../../../utils/attributes";
import { getMainColor, parseScoreFromNrqlResult } from "../../../utils/helpers";

const BOUNDS = {
  X: 300,
  Y: 300,
};

const LABEL_SIZE = 20;
const LABEL_PADDING = 10;

export default class PerformanceModal extends React.Component {
  transformData = (rawData) => {
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
    const opportunities = allOpportunities.filter(
      (opp) =>
        !opp.score ||
        (opp.score !== null && opp.score < mainThresholds.good / 100)
    );

    const diagnostics = auditRefObject.filter(
      (audit) =>
        !audit.score ||
        (audit.details &&
          audit.details.type !== "opportunity" &&
          audit.score < mainThresholds.good / 100)
    );
    console.log({ auditRefObject, diagnostics, opportunities });
    const passed = auditRefObject.filter(
      (audit) => audit.score && audit.score >= mainThresholds.good / 100
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
    const { accountId, requestedUrl, strategy } = this.props;
    const scoreQuery = `FROM lighthousePerformance SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days  ago`;
    const auditRefQuery = `FROM lighthousePerformance SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago LIMIT 1`;
    const metadataQuery = `FROM lighthousePerformance SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago LIMIT 1`;
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
              console.log("Score");

              const color = getMainColor(categoryScore);
              const series = [
                { x: "progress", y: categoryScore, color },
                {
                  x: "remainder",
                  y: 100 - categoryScore,
                  color: "transparent",
                },
              ];
              // const metadata = data[0].metadata;

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
                              <Passed passed={passed} />
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
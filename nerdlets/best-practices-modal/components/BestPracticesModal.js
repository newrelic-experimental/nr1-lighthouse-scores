import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  NrqlQuery,
  Spinner,
  AutoSizer,
  Stack,
  StackItem,
  CardSection,
} from "nr1";
import GenericGroup from "../../../src/components/GenericGroup";
import Passed from "../../../src/components/Passed";
import Lighthouse from "../../../src/components/Lighthouse";
import LighthouseHeader from "../../../src/components/LighthouseHeader";
import NoDataState from "../../../src/no-data-state";
import ErrorState from "../../../src/error-state";

import { mainThresholds } from "../../../utils/attributes";
import { getMainColor, parseScoreFromNrqlResult } from "../../../utils/helpers";
import ScoreVisualization from "../../../src/components/ScoreVisualization";

export default class BestPracticesModal extends React.Component {
  /**
   * Restructure the data for a non-time-series, facet-based NRQL query into a
   * form accepted by the Recharts library's RadarChart.
   * (https://recharts.org/api/RadarChart).
   */
  transformData = (rawData) => {
    const auditRefs = Object.keys(rawData)
      .filter((key) => key.includes("auditRefs_"))
      .reduce((res, key) => ((res[key] = rawData[key]), res), {});
    const auditRefString = Object.keys(auditRefs).map(
      (key, index) => auditRefs[`auditRefs_${index}`]
    );

    const auditRefObject = JSON.parse(auditRefString.join(""));

    const notApplicable = auditRefObject.filter(
      (audit) => audit.scoreDisplayMode === "notApplicable"
    );
    const diagnostics = auditRefObject.filter(
      (audit) =>
        !audit.score ||
        (audit.details &&
          audit.details.type !== "opportunity" &&
          audit.score < mainThresholds.good / 100)
    );
    const generalGroup = diagnostics.filter(
      (audit) => audit.group === "best-practices-general"
    );
    const browserCompatGroup = diagnostics.filter(
      (audit) => audit.group === "best-practices-browser-compat"
    );
    const uxGroup = diagnostics.filter(
      (audit) => audit.group === "best-practices-ux"
    );
    const trustSafetyGroup = diagnostics.filter(
      (audit) => audit.group === "best-practices-trust-safety"
    );
    const passed = auditRefObject.filter(
      (audit) => audit.score && audit.score >= mainThresholds.good / 100
    );

    return {
      generalGroup,
      notApplicable,
      browserCompatGroup,
      uxGroup,
      trustSafetyGroup,
      diagnostics,
      auditRefObject,
      passed,
    };
  };

  /**
   * Format the given axis tick's numeric value into a string for display.
   */
  formatTick = (value) => {
    return value.toLocaleString();
  };

  render() {
    const { accountId, requestedUrl, strategy } = this.props;

    const scoreQuery = `FROM lighthouseBestPractices SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago`;
    const auditRefQuery = `FROM lighthouseBestPractices SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago LIMIT 1`;
    const metadataQuery = `FROM lighthouseBestPractices SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
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
                        title="Best Practices Audits"
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
                            Best Practices
                          </HeadingText>
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
                          const {
                            generalGroup,
                            browserCompatGroup,
                            uxGroup,
                            trustSafetyGroup,
                            notApplicable,
                            passed,
                          } = this.transformData(resultData);

                          return (
                            <>
                              {generalGroup.length > 0 && (
                                <GenericGroup
                                  group={generalGroup}
                                  title="General"
                                  description=""
                                />
                              )}
                              {browserCompatGroup.length > 0 && (
                                <GenericGroup
                                  group={browserCompatGroup}
                                  title="Browser Compatibility"
                                  description=""
                                />
                              )}
                              {uxGroup.length > 0 && (
                                <GenericGroup
                                  group={uxGroup}
                                  title="UX"
                                  description=""
                                />
                              )}
                              {trustSafetyGroup.length > 0 && (
                                <GenericGroup
                                  group={trustSafetyGroup}
                                  title="Trust & Safety"
                                  description=""
                                />
                              )}
                              <Passed passed={passed} />
                              {notApplicable.length > 0 && (
                                <GenericGroup
                                  group={notApplicable}
                                  title="Not applicable"
                                  description=""
                                />
                              )}
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

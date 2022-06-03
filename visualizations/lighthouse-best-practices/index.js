import React from "react";
import PropTypes from "prop-types";
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
  BlockText,
} from "nr1";
import Opportunities from "../../src/components/Opportunities";
import GenericGroup from "../../src/components/GenericGroup";
import Passed from "../../src/components/Passed";
import Lighthouse from "../../src/components/Lighthouse";
import LighthouseHeader from "../../src/components/LighthouseHeader";
import NoDataState from "../../src/no-data-state";
import ErrorState from "../../src/error-state";

import { mainThresholds } from "../../utils/attributes";
import { getMainColor, parseScoreFromNrqlResult } from "../../utils/helpers";
import ScoreVisualization from "../../src/components/ScoreVisualization";

const zlib = require("zlib");

export default class LighthouseBestPracticesVisualization extends React.Component {
  // Custom props you wish to be configurable in the UI must also be defined in
  // the nr1.json file for the visualization. See docs for more details.
  static propTypes = {
    uiSettings: PropTypes.shape({
      hidePassed: PropTypes.Boolean,
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
   */
  transformData = (rawData) => {
    // console.log({ rawData });
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
    const notApplicable = auditRefObject.filter(
      (audit) => audit.scoreDisplayMode === "notApplicable"
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
    const truediagnostics = auditRefObject.filter(
      (audit) =>
        audit.score !== null &&
        audit.details &&
        audit.details.type !== "opportunity" &&
        audit.score < mainThresholds.good / 100
    );
    const nulldiagnostics = auditRefObject.filter(
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
    const { nrqlSettings, uiSettings } = this.props;
    const { hideManual, hideNotApplicable, hideNull, hidePassed } = uiSettings;

    const { requestedUrl, accountId } = nrqlSettings;

    const nrqlQueryPropsSet = requestedUrl && accountId;

    if (!nrqlQueryPropsSet) {
      return <NoDataState />;
    }
    let { timeframe, strategy } = nrqlSettings;
    timeframe = timeframe || "4 hours";
    strategy = strategy || "desktop";

    const scoreQuery = `FROM lighthouseBestPractices SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago`;
    const auditRefQuery = `FROM lighthouseBestPractices SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago LIMIT 1`;
    // console.log({ scoreQuery, auditRefQuery });
    const metadataQuery = `FROM lighthouseBestPractices SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
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
              const series = [
                { x: "progress", y: categoryScore, color },
                {
                  x: "remainder",
                  y: 100 - categoryScore,
                  color: "transparent",
                },
              ];
              const metadata = data[0].metadata;
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
                          // console.log({ auditRefObject, opportunities });
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
                              {!hidePassed && <Passed passed={passed} />}
                              {!hideNotApplicable &&
                                notApplicable.length > 0 && (
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

const EmptyState = () => (
  <Card className="EmptyState">
    <CardBody className="EmptyState-cardBody">
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Please provide at least one NRQL query & account ID pair
      </HeadingText>
      <HeadingText
        spacingType={[HeadingText.SPACING_TYPE.MEDIUM]}
        type={HeadingText.TYPE.HEADING_4}
      >
        An example NRQL query you can try is:
      </HeadingText>
      <code>
        FROM lighthouseBestPractices SELECT * WHERE requestedUrl =
        'https://developer.newrelic.com/' LIMIT 1
      </code>
    </CardBody>
  </Card>
);

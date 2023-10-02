import React from "react";
import PropTypes from "prop-types";
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
import LighthouseHeader from "../../src/components/LighthouseHeader";
import Lighthouse from "../../src/components/Lighthouse";
import GenericGroup from "../../src/components/GenericGroup";
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
const zlib = require("zlib");

export default class LighthousePWAVisualization extends React.Component {
  // Custom props you wish to be configurable in the UI must also be defined in
  // the nr1.json file for the visualization. See docs for more details.
  static propTypes = {
    uiSettings: PropTypes.shape({
      hideNull: PropTypes.Boolean,
      hideManual: PropTypes.Boolean,
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
    const auditRefObject = convertAuditRef(rawData);
    const diagnostics = auditRefObject.filter(
      (audit) => !["manual", "notApplicable"].includes(audit.scoreDisplayMode)
    );
    const pwaOptimized = diagnostics.filter(
      (audit) => audit.group === "pwa-optimized"
    );
    const installable = diagnostics.filter(
      (audit) => audit.group === "pwa-installable"
    );
    const manualGroup = auditRefObject.filter(
      (audit) => audit.scoreDisplayMode === "manual"
    );
    const notApplicable = auditRefObject.filter(
      (audit) => audit.scoreDisplayMode === "notApplicable"
    );
    return {
      pwaOptimized,
      installable,
      manualGroup,
      notApplicable,
    };
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

    const scoreQuery = `FROM lighthousePwa SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago`;
    const auditRefQuery = `FROM lighthousePwa SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago LIMIT 1`;
    const metadataQuery = `FROM lighthousePwa SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago LIMIT 1`;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <NrqlQuery
            query={scoreQuery}
            accountIds={[accountId]}
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
              return (
                <>
                  <Card>
                    <CardBody>
                      <LighthouseHeader
                        title="Lighthouse Scores"
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
                            Progressive Web App
                          </HeadingText>
                          <BlockText
                            style={{ fontSize: "1.4em", lineHeight: "2em" }}
                            spacingType={[BlockText.SPACING_TYPE.MEDIUM]}
                          >
                            These checks validate the aspects of a Progressive
                            Web App.{" "}
                            <Link to="https://developers.google.com/web/progressive-web-apps/checklist">
                              Learn More.
                            </Link>
                          </BlockText>
                          <Lighthouse />
                        </StackItem>
                      </Stack>
                      <NrqlQuery
                        query={auditRefQuery}
                        accountIds={[accountId]}
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
                            manualGroup,
                            notApplicable,
                            installable,
                            pwaOptimized,
                          } = this.transformData(resultData);
                          // console.log({ auditRefObject, opportunities });
                          return (
                            <>
                              <GenericGroup
                                group={installable}
                                title="Installable"
                                description=""
                              />
                              <GenericGroup
                                group={pwaOptimized}
                                title="PWA Optimized"
                                description=""
                              />
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
        FROM lighthousePwa SELECT * WHERE requestedUrl =
        'https://developer.newrelic.com/' LIMIT 1
      </code>
    </CardBody>
  </Card>
);

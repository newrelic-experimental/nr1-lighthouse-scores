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
import LighthouseHeader from "../../../src/components/LighthouseHeader";
import Lighthouse from "../../../src/components/Lighthouse";
import GenericGroup from "../../../src/components/GenericGroup";
import NoDataState from "../../../src/no-data-state";
import ErrorState from "../../../src/error-state";

import {
  convertAuditRef,
  getMainColor,
  parseScoreFromNrqlResult,
} from "../../../utils/helpers";
import ScoreVisualization from "../../../src/components/ScoreVisualization";

export default class LighthousePWAVisualization extends React.Component {
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
    const { accountId, requestedUrl, strategy } = this.props;
    const scoreQuery = `FROM lighthousePwa SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago`;
    const auditRefQuery = `FROM lighthousePwa SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago LIMIT 1`;
    const metadataQuery = `FROM lighthousePwa SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago LIMIT 1`;
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
                              <GenericGroup
                                group={notApplicable}
                                title="Not Applicable"
                                description=""
                              />
                              <GenericGroup
                                group={manualGroup}
                                title="Additional items to check manually"
                                description=""
                              />
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

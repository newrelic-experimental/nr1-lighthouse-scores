import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  NrqlQuery,
  Spinner,
  AutoSizer,
  BlockText,
  Link,
  CardSection,
  Stack,
  StackItem,
} from "nr1";
import Passed from "../../../src/components/Passed";
import Lighthouse from "../../../src/components/Lighthouse";
import GenericGroup from "../../../src/components/GenericGroup";
import LighthouseHeader from "../../../src/components/LighthouseHeader";
import NoDataState from "../../../src/no-data-state";
import ErrorState from "../../../src/error-state";

import { mainThresholds } from "../../../utils/attributes";
import {
  convertAuditRef,
  getMainColor,
  parseScoreFromNrqlResult,
} from "../../../utils/helpers";
import ScoreVisualization from "../../../src/components/ScoreVisualization";

export default class LighthouseSeoVisualization extends React.Component {
  transformData = (rawData) => {
    const auditRefObject = convertAuditRef(rawData);
    const allOpportunities = auditRefObject.filter(
      (audit) => audit.details && audit.details.type == "opportunity"
    );
    const opportunities = allOpportunities.filter(
      (opp) => opp.score > 0 && opp.score < mainThresholds.good / 100
    );
    const diagnostics = auditRefObject.filter(
      (audit) =>
        audit.score !== null &&
        audit.details &&
        audit.details.type !== "opportunity" &&
        audit.score < mainThresholds.good / 100
    );
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
    const { accountId, requestedUrl, strategy } = this.props;
    const scoreQuery = `FROM lighthouseSeo SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago`;
    const auditRefQuery = `FROM lighthouseSeo SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE 2 days ago LIMIT 1`;
    const metadataQuery = `FROM lighthouseSeo SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
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

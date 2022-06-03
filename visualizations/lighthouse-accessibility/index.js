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
  Stack,
  StackItem,
} from "nr1";
import Passed from "../../src/components/Passed";
import Lighthouse from "../../src/components/Lighthouse";
import GenericGroup from "../../src/components/GenericGroup";
import LighthouseHeader from "../../src/components/LighthouseHeader";
import NoDataState from "../../src/no-data-state";
import ErrorState from "../../src/error-state";
import { mainThresholds } from "../../utils/attributes";
import { getMainColor, parseScoreFromNrqlResult } from "../../utils/helpers";
import ScoreVisualization from "../../src/components/ScoreVisualization";
export default class LighthouseAccessibilityVisualization extends React.Component {
  static propTypes = {
    uiSettings: PropTypes.shape({
      hidePassed: PropTypes.Boolean,
      hideNull: PropTypes.Boolean,
      hideManual: PropTypes.Boolean,
      hideNotApplicable: PropTypes.Boolean,
    }),
    nrqlSettings: PropTypes.shape({
      accountId: PropTypes.number,
      timeframe: PropTypes.string,
      requestedUrl: PropTypes.string,
      strategy: PropTypes.string,
    }),
  };
  
  transformData = (rawData) => {
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
          audit.scoreDisplayMode !== "notApplicable" &&
          audit.score < mainThresholds.good / 100
        : (!audit.score && audit.scoreDisplayMode !== "notApplicable") ||
          (audit.details &&
            audit.scoreDisplayMode !== "notApplicable" &&
            audit.score < mainThresholds.good / 100)
    );
    const ariaGroup = diagnostics.filter(
      (audit) => audit.group === "a11y-aria"
    );
    const namesLabelsGroup = diagnostics.filter(
      (audit) => audit.group === "a11y-names-labels"
    );
    const contrastGroup = diagnostics.filter(
      (audit) => audit.group === "a11y-color-contrast"
    );
    const navigationGroup = diagnostics.filter(
      (audit) => audit.group === "a11y-navigation"
    );
    const languageGroup = diagnostics.filter(
      (audit) => audit.group === "a11y-language"
    );
    const tablesListsGroup = diagnostics.filter(
      (audit) => audit.group === "a11y-tables-lists"
    );
    const manualGroup = auditRefObject.filter(
      (audit) => audit.scoreDisplayMode === "manual"
    );
    const bestPracticeGroup = diagnostics.filter(
      (audit) => audit.group === "a11y-best-practices"
    );
    const audioVideoGroup = diagnostics.filter(
      (audit) => audit.group === "a11y-audio-video"
    );
    const groups1 = diagnostics.map((audit) => audit.group);
    const groups2 = [...new Set(auditRefObject.map((audit) => audit.group))];
    const passed = auditRefObject.filter(
      (audit) => audit.score && audit.score >= mainThresholds.good / 100
    );
    return {
      notApplicable,
      ariaGroup,
      namesLabelsGroup,
      contrastGroup,
      navigationGroup,
      languageGroup,
      tablesListsGroup,
      manualGroup,
      bestPracticeGroup,
      auditRefObject,
      passed,
      audioVideoGroup,
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

    const scoreQuery = `FROM lighthouseAccessibility SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago`;
    const auditRefQuery = `FROM lighthouseAccessibility SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago LIMIT 1`;
    const metadataQuery = `FROM lighthouseAccessibility SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
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
                console.log({ error });
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
              // fs.writeFileSync('thing.json', String(resultData))
              const metadata = data[0].metadata;

              return (
                <>
                  <Card>
                    <CardBody>
                      <LighthouseHeader
                        title="Accessibility Audits"
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
                            Accessibility
                          </HeadingText>
                          <BlockText
                            style={{ fontSize: "1.4em", lineHeight: "2em" }}
                            spacingType={[BlockText.SPACING_TYPE.MEDIUM]}
                          >
                            These checks highlight opportunities to{" "}
                            <Link to="https://developers.google.com/web/fundamentals/accessibility?utm_source=lighthouse&utm_medium=node">
                              improve the accessibility of your web app
                            </Link>
                            . Only a subset of accessibility issues can be
                            automatically detected so manual testing is also
                            encouraged.{" "}
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
                            notApplicable,
                            ariaGroup,
                            namesLabelsGroup,
                            contrastGroup,
                            navigationGroup,
                            languageGroup,
                            tablesListsGroup,
                            manualGroup,
                            bestPracticeGroup,
                            audioVideoGroup,
                            passed,
                          } = this.transformData(resultData);
                          // console.log({ auditRefObject, opportunities });
                          return (
                            <>
                              {namesLabelsGroup.length > 0 && (
                                <GenericGroup
                                  group={namesLabelsGroup}
                                  title="Names and Labels"
                                  description=""
                                />
                              )}
                              {ariaGroup.length > 0 && (
                                <GenericGroup
                                  group={ariaGroup}
                                  title="Aria"
                                  description=""
                                />
                              )}
                              {contrastGroup.length > 0 && (
                                <GenericGroup
                                  group={contrastGroup}
                                  title="Contrast"
                                  description=""
                                />
                              )}
                              {navigationGroup.length > 0 && (
                                <GenericGroup
                                  group={navigationGroup}
                                  title="Navigation"
                                  description=""
                                />
                              )}
                              {languageGroup.length > 0 && (
                                <GenericGroup
                                  group={languageGroup}
                                  title="Language"
                                  description=""
                                />
                              )}
                              {tablesListsGroup.length > 0 && (
                                <GenericGroup
                                  group={tablesListsGroup}
                                  title="Tables and Lists"
                                  description=""
                                />
                              )}
                              {bestPracticeGroup.length > 0 && (
                                <GenericGroup
                                  group={bestPracticeGroup}
                                  title="Best Practices"
                                  description=""
                                />
                              )}
                              {audioVideoGroup.length > 0 && (
                                <GenericGroup
                                  group={audioVideoGroup}
                                  title="Audio and Video"
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

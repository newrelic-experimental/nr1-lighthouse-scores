import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  HeadingText,
  NrqlQuery,
  Spinner,
  AutoSizer,
  PlatformStateContext,
  Grid,
  GridItem,
  Stack,
  StackItem,
  CardSection,
  SectionMessage,
} from "nr1";
import ErrorState from "../../src/error-state";
import NoDataState from "../../src/no-data-state";
import DescriptionBlock from "../../src/components/DescriptionBlock";
import ScoreGuide from "../../src/components/ScoreGuide";

import { ATTRIBUTES } from "../../utils/attributes";
import { parseScoreFromNrqlResult, getMainColor } from "../../utils/helpers";
import { QUANTILE_AT_VALUE } from "../../utils/math.js";
import ScoreVisualization from "../../src/components/ScoreVisualization";
import LighthouseHeader from "../../src/components/LighthouseHeader";

export default class CircularProgressBar extends React.Component {
  static propTypes = {
    uiSettings: PropTypes.shape({
      hideCategoryScores: PropTypes.Boolean,
      hideDescriptions: PropTypes.Boolean,
      hideCoreScores: PropTypes.Boolean,
      hideScoreGuide: PropTypes.Boolean,
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

  checkWeights = (results) => {
    const weights = Object.values(results).map(
      (metricScoring) => metricScoring.metadata.weight
    );
    const weightSum = weights.reduce((agg, val) => (agg += val));
    console.assert(weightSum > 0.999 && weightSum < 1.0001); // lol rounding is hard.
  };

  calculateScore = (metrics, value) => {
    return Math.round(QUANTILE_AT_VALUE(metrics, value) * 100);
  };

  formatData = (data) => {
    return Object.keys(ATTRIBUTES).map((att) => {
      const { name, explanation, weight, scores, metrics, link } =
        ATTRIBUTES[att];
      const filtered = data.find((point) =>
        Object.keys(point.data[0]).some((key) => key.includes(att))
      );
      const usedKey = Object.keys(filtered.data[0]).find((key) =>
        key.includes(att)
      );
      const result = filtered.data[0][usedKey];
      const score = this.calculateScore(metrics, result);
      return {
        metadata: {
          id: att,
          name,
          explanation,
          weight,
          scores,
          metrics,
          link,
        },
        data: { result, score }, // Current value.
      };
    });
  };

  checkColor = (time, scores, attribute) => {
    let color = "red";
    if (attribute && attribute === 'cumulativeLayoutShift') {
      if (time <= scores.fast) {
        color = "green";
      } else if (time <= scores.mid) {
        color = "orange";
      }
    } else {
      if (time / 1000 <= scores.fast) {
        color = "green";
      } else if (time / 1000 <= scores.mid) {
        color = "orange";
      }
    }
    
    return color;
  };

  checkTime = (time, attribute) => {
    const { scores, units } = ATTRIBUTES[attribute];
    const color = this.checkColor(time, scores, attribute);
    const calculatedScore = () => {
      if (units == "s") {
        return `${Number(Math.round(time) + "e-" + 3)} s`;
      } else if (units == "ms") {
        return `${Number(Math.round(time))} ms`;
      } else {
        return `${Number(Math.round(time + "e" + 4) + "e-" + 4)}`;
      }
    };
    return (
      <h4
        style={{
          marginRight: "5px",
          color,
          fontSize: "1em",
        }}
      >
        {calculatedScore()}
      </h4>
    );
  };

  checkSymbol = (time, attribute) => {
    const { scores } = ATTRIBUTES[attribute];
    const color = this.checkColor(time, scores);
    if (color === "orange") {
      return (
        <div
          style={{
            backgroundColor: color,
            width: 10,
            height: 10,
          }}
        ></div>
      );
    } else if (color === "red") {
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "10px solid red",
          }}
        ></div>
      );
    } else {
      return (
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        ></div>
      );
    }
  };

  render() {
    const { nrqlSettings, uiSettings } = this.props;
    // console.log({ nrqlSettings, uiSettings });
    const {
      hideDescriptions,
      hideCoreScores,
      hideScoreGuide,
      hideCategoryScores,
    } = uiSettings;

    const { requestedUrl, accountId } = nrqlSettings;

    const nrqlQueryPropsSet = requestedUrl && accountId;

    if (!nrqlQueryPropsSet) {
      return <NoDataState />;
    }
    let { timeframe, strategy } = nrqlSettings;
    timeframe = timeframe || "4 hours";
    strategy = strategy || "desktop";
    const coreValuesQuery = `FROM lighthousePerformance SELECT average(firstContentfulPaint), average(largestContentfulPaint), average(interactive), average(totalBlockingTime), average(cumulativeLayoutShift), average(speedIndex) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago`;

    const scoreQueries = [
      {
        title: "Performance",
        query: `FROM lighthousePerformance SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
          strategy || "desktop"
        }' SINCE ${timeframe} ago`,
      },
      {
        title: "Best practices",
        query: `FROM lighthouseBestPractices SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
          strategy || "desktop"
        }' SINCE ${timeframe} ago`,
      },
      {
        title: "SEO",
        query: `FROM lighthouseSeo SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
          strategy || "desktop"
        }' SINCE ${timeframe} ago`,
      },
      {
        title: "PWA",
        query: `FROM lighthousePwa SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
          strategy || "desktop"
        }' SINCE ${timeframe} ago`,
      },
      {
        title: "Accessibility",
        query: `FROM lighthouseAccessibility SELECT average(score) WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
          strategy || "desktop"
        }' SINCE ${timeframe} ago`,
      },
    ];

    const metadataQuery = `FROM lighthousePerformance SELECT * WHERE requestedUrl = '${requestedUrl}' AND deviceType = '${
      strategy || "desktop"
    }' SINCE ${timeframe} ago LIMIT 1`;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <PlatformStateContext.Consumer>
            {({ timeRange }) => (
              <NrqlQuery
                query={coreValuesQuery}
                accountIds={[accountId]}
                pollInterval={NrqlQuery.AUTO_POLL_INTERVAL}
              >
                {({ data, loading, error }) => {
                  if (loading) {
                    return <Spinner />;
                  }

                  if (error && data === null) {
                    return <ErrorState error={error} />;
                  }

                  if (!data.length) {
                    return <NoDataState />;
                  }

                  const filteredAttributes = this.formatData(data);
                  this.checkWeights(filteredAttributes);

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

                          {!hideCategoryScores && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "center",
                                }}
                              >
                                {scoreQueries.map(({ title, query }) => (
                                  <div style={{ width: "200px" }}>
                                    <NrqlQuery
                                      query={query}
                                      accountId={parseInt(accountId)}
                                      pollInterval={
                                        NrqlQuery.AUTO_POLL_INTERVAL
                                      }
                                      timeRange={timeRange}
                                    >
                                      {({ data, loading, error }) => {
                                        if (loading) {
                                          return <Spinner />;
                                        }
                                        if (error && data === null) {
                                          return <ErrorState error={error} />;
                                        }

                                        if (!data.length) {
                                          return <NoDataState />;
                                        }
                                        const categoryScore =
                                          parseScoreFromNrqlResult(data);
                                        const color =
                                          getMainColor(categoryScore);
                                        const series = [
                                          {
                                            x: "progress",
                                            y: categoryScore,
                                            color,
                                          },
                                          {
                                            x: "remainder",
                                            y: 100 - categoryScore,
                                            color: "transparent",
                                          },
                                        ];
                                        return (
                                          <Stack
                                            directionType={
                                              Stack.DIRECTION_TYPE.VERTICAL
                                            }
                                            style={{
                                              textAlign: "center",
                                              width: "100%",
                                              alignItems: "center",
                                              paddingTop: "15px",
                                            }}
                                          >
                                            <StackItem
                                              style={{ width: "150px" }}
                                            >
                                              <ScoreVisualization
                                                score={categoryScore}
                                                color={color}
                                                series={series}
                                              />
                                            </StackItem>
                                            <StackItem>
                                              <HeadingText
                                                type={
                                                  HeadingText.TYPE.HEADING_4
                                                }
                                                spacingType={[
                                                  HeadingText.SPACING_TYPE
                                                    .MEDIUM,
                                                ]}
                                              >
                                                {title} Score
                                              </HeadingText>
                                            </StackItem>
                                          </Stack>
                                        );
                                      }}
                                    </NrqlQuery>
                                  </div>
                                ))}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "center",
                                  padding: "20px",
                                }}
                              >
                                <Stack>
                                  <StackItem>
                                    <SectionMessage
                                      type={SectionMessage.TYPE.CRITICAL}
                                      title="0 - 49"
                                    />
                                  </StackItem>
                                  <StackItem>
                                    <SectionMessage
                                      type={SectionMessage.TYPE.WARNING}
                                      title="50 - 89"
                                    />
                                  </StackItem>
                                  <StackItem>
                                    <SectionMessage
                                      type={SectionMessage.TYPE.SUCCESS}
                                      title="90 - 100"
                                    />
                                  </StackItem>
                                </Stack>
                              </div>
                            </>
                          )}
                          <Grid>
                            {!hideCoreScores && (
                              <>
                                {filteredAttributes.map((att) => {
                                  return (
                                    <GridItem columnSpan={4}>
                                      <Card>
                                        <CardBody>
                                          <Stack
                                            verticalType={
                                              Stack.VERTICAL_TYPE.CENTER
                                            }
                                          >
                                            <StackItem>
                                              {this.checkSymbol(
                                                att.data.result,
                                                att.metadata.id
                                              )}
                                            </StackItem>
                                            <StackItem
                                              style={{
                                                fontWeight: 500,
                                                width: "250px",
                                              }}
                                            >
                                              <HeadingText
                                                style={{
                                                  fontWeight: 500,
                                                  overflowWrap: "break-word",
                                                }}
                                              >
                                                {att.metadata.name}
                                              </HeadingText>
                                            </StackItem>
                                          </Stack>
                                          <HeadingText
                                            type={HeadingText.TYPE.HEADING_1}
                                            spacingType={[
                                              HeadingText.SPACING_TYPE.LARGE,
                                            ]}
                                          >
                                            {this.checkTime(
                                              att.data.result,
                                              att.metadata.id
                                            )}
                                          </HeadingText>

                                          <CardSection />
                                          {!hideScoreGuide && (
                                            <>
                                              <ScoreGuide
                                                fast={att.metadata.scores.fast}
                                                mid={att.metadata.scores.mid}
                                                weight={
                                                  att.metadata.metrics.weight
                                                }
                                              />

                                              <CardSection />
                                            </>
                                          )}
                                          {!hideDescriptions && (
                                            <DescriptionBlock
                                              link={att.metadata.link}
                                              explanation={
                                                att.metadata.explanation
                                              }
                                            />
                                          )}
                                        </CardBody>
                                      </Card>
                                    </GridItem>
                                  );
                                })}
                              </>
                            )}
                          </Grid>
                        </CardBody>
                      </Card>
                    </>
                  );
                }}
              </NrqlQuery>
            )}
          </PlatformStateContext.Consumer>
        )}
      </AutoSizer>
    );
  }
}

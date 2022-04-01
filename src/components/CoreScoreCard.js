import React from "react";
import { PropTypes } from "prop-types";
import {
  Card,
  CardBody,
  Stack,
  StackItem,
  HeadingText,
  CardSection,
} from "nr1";

import DescriptionBlock from "./DescriptionBlock";
import ScoreGuide from "./ScoreGuide";

const ScoreGuide = ({
  att: {
    metadata: {
      name,
      id,
      link,
      explanation,
      scores: { fast, mid },
      metrics: { weight },
    },
  },
  hideDescriptions,
  hideScoreGuide,
}) => {
  return (
    <>
      <Card>
        <CardBody>
          <Stack verticalType={Stack.VERTICAL_TYPE.CENTER}>
            <StackItem>
              {this.checkSymbol(att.data.result, att.metadata.id)}
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
            spacingType={[HeadingText.SPACING_TYPE.LARGE]}
          >
            {this.checkTime(att.data.result, att.metadata.id)}
          </HeadingText>

          <CardSection />
          {!hideScoreGuide && (
            <>
              <ScoreGuide
                fast={att.metadata.scores.fast}
                mid={att.metadata.scores.mid}
                weight={att.metadata.metrics.weight}
              />

              <CardSection />
            </>
          )}
          {!hideDescriptions && (
            <DescriptionBlock
              link={att.metadata.link}
              explanation={att.metadata.explanation}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

ScoreGuide.propTypes = {
  att: PropTypes.shape({
    metadata: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      link: PropTypes.string,
      explanation: PropTypes.string,
      scores: PropTypes.shape({
        fast: PropTypes.string,
        mid: PropTypes.string,
      }),
      metrics: PropTypes.shape({
        weight: PropTypes.string,
      }),
    }),
  }),
  hideDescriptions: PropTypes.bool,
  hideScoreGuide: PropTypes.bool,
};

export default ScoreGuide;

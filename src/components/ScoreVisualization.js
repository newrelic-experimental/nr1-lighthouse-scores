import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  Grid,
  GridItem,
  NrqlQuery,
  Spinner,
  Button,
  Tile,
} from "nr1";
const zlib = require("zlib");
import { baseLabelStyles } from "../theme";
import { VictoryPie, VictoryAnimation, VictoryLabel } from "victory";
const BOUNDS = {
  X: 300,
  Y: 300,
};

const LABEL_SIZE = 20;
const LABEL_PADDING = 10;
const CHART_WIDTH = BOUNDS.X + LABEL_PADDING * 2;
const CHART_HEIGHT = BOUNDS.Y + LABEL_SIZE;

export default class ScoreVisualization extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { series, color, score } =
      this.props;
    // console.log({ series, color, score })
    return (
      <>
        <svg
          viewBox={`0 0 325 325`}
          preserveAspectRatio="xMinYMin meet"
          class="svg-content"
        >
          <circle cx="160" cy="160" r="160" fill={color} fill-opacity="0.1" />
          <VictoryPie
            standalone={false}
            animate={{ duration: 5000 }}
            data={series}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            innerRadius={160}
            cornerRadius={3}
            labels={() => null}
            style={{
              data: { fill: ({ datum }) => datum.color },
            }}
          />
          <VictoryAnimation duration={5000} data={score}>
            {(score) => (
              <VictoryLabel
                textAnchor="middle"
                verticalAnchor="middle"
                x={CHART_WIDTH / 2}
                y={CHART_HEIGHT / 2}
                text={`${Math.round(score)}`}
                style={{ ...baseLabelStyles, fontSize: 30 }}
              />
            )}
          </VictoryAnimation>
        </svg>
      </>
    );
  }
}

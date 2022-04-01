import React from "react";
import { PropTypes } from "prop-types";
import {
  Grid,
  GridItem,
  CardSection
} from "nr1";

const checkSymbol = (time, attribute) => {
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
const ScoreGuide = ({ fast, mid, weight }) => {
  return (
    <>
      <Grid
        spacingType={[
          Grid.SPACING_TYPE.EXTRA_LARGE,
          Grid.SPACING_TYPE.NONE,
          Grid.SPACING_TYPE.NONE,
        ]}
        gapType={Grid.GAP_TYPE.SMALL}
        style={{
          overflowWrap: "break-word",
        }}
      >
        <GridItem columnSpan={3} style={{ color: "green" }}>
          Good
        </GridItem>
        <GridItem columnSpan={3} style={{ color: "orange" }}>
          Moderate
        </GridItem>
        <GridItem columnSpan={3} style={{ color: "red" }}>
          Slow
        </GridItem>
        <GridItem columnSpan={3}>Weight</GridItem>
        <GridItem columnSpan={3} style={{ color: "green" }}>
          {`0 - ${fast}`}
        </GridItem>
        <GridItem columnSpan={3} style={{ color: "orange" }}>
          {`${fast} - ${mid}`}
        </GridItem>
        <GridItem columnSpan={3} style={{ color: "red" }}>
          {`> ${mid}`}
        </GridItem>
        <GridItem columnSpan={3}>
          {`${weight * 100}%`}
        </GridItem>
      </Grid>
    </>
  );
};

ScoreGuide.propTypes = {
  fast: PropTypes.string,
  mid: PropTypes.string,
  weight: PropTypes.string,
};

export default ScoreGuide;

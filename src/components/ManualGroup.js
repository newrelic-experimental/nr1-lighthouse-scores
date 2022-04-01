import React from "react";
import {
  Card,
  BlockText,
  HeadingText,
  Grid,
  GridItem,
  NrqlQuery,
  Spinner,
  AutoSizer,
  Tile,
  Link,
} from "nr1";
import Accordion from "../../src/components/Accordion";
import { checkMeasurement, parseUrl, sortDetails } from "../../utils/helpers";
import DetailsTable from "./DetailsTable";

import "./accordion.css";

export default class ManualGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { manualGroup: unsorted, visualization } = this.props;
    const manuals = sortDetails(unsorted);
    console.log({ manuals });
    return (
      <>
        <HeadingText
          type={HeadingText.TYPE.HEADING_3}
          spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        >
          Additional items to check manually <span style={{ color: "grey" }}>({manuals.length})</span>
        </HeadingText>
        <BlockText spacingType={[BlockText.SPACING_TYPE.LARGE]}>
          These suggestions can help your page load faster. They don't{" "}
          <Link to="https://web.dev/performance-scoring/?utm_source=lighthouse&utm_medium=node">
            directly affect
          </Link>{" "}
          the {visualization} score.
        </BlockText>
        {manuals.map((manual) => {
          return (
            <Accordion {...manual} />
          );
        })}
      </>
    );
  }
}

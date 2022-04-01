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

export default class Opportunities extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { opportunities: unsorted, visualization } = this.props;
    const opportunities = sortDetails(unsorted);

    return (
      <div style={{padding: "20px"}}>
        <HeadingText
          type={HeadingText.TYPE.HEADING_3}
          spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        >
          Opportunities
        </HeadingText>
        <BlockText spacingType={[BlockText.SPACING_TYPE.LARGE]}>
          These suggestions can help your page load faster. They don't{" "}
          <Link to="https://web.dev/performance-scoring/?utm_source=lighthouse&utm_medium=node">
            directly affect
          </Link>{" "}
          the {visualization} score.
        </BlockText>
        {opportunities.map((opportunity) => {
          return (
            <Accordion {...opportunity}>
              {
                <div>
                  {["table", "opportunity"].includes(
                    opportunity.details?.type
                  ) && <DetailsTable details={opportunity.details} />}
                </div>
              }
            </Accordion>
          );
        })}
      </div>
    );
  }
}

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
import DebugTable from "./DebugTable";
import CriticalRequestChain from "./CriticalRequestChain";

import "./accordion.css";

export default class GenericGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { group: unsorted, title,  description } = this.props;
    const sortedGroup = sortDetails(unsorted);
    return (
      <div  style={{padding: "20px"}}>
        <HeadingText
          type={HeadingText.TYPE.HEADING_3}
          spacingType={[HeadingText.SPACING_TYPE.LARGE]}
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          {title} <span style={{ color: "grey" }}>({sortedGroup.length})</span>
        </HeadingText>
        <BlockText spacingType={[BlockText.SPACING_TYPE.LARGE]}>
          {description}
        </BlockText>
        {sortedGroup.map((item) => {
          return (
            <Accordion {...item} >
              {
                  <div>
                    {["table", "opportunity"].includes(
                      item.details?.type
                    ) && <DetailsTable details={item.details} />}
                    {item.details?.type === "criticalrequestchain" && (
                      <CriticalRequestChain
                        chains={item.details.chains}
                        diagnostic={item}
                      />
                    )}
                    {item.details?.type === "debugdata" && (
                      <DebugTable debugData={item.details.items} />
                    )}
                  </div>
                }
              </Accordion>
          );
        })}
      </div>
    );
  }
}

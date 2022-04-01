import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  Grid,
  GridItem,
  BlockText,
  Spinner,
  AutoSizer,
  Tile,
  Link,
  Table,
  TableHeaderCell,
  TableRow,
  TableHeader,
  TableRowCell,
} from "nr1";
import Accordion from "../../src/components/Accordion";
import { checkMeasurement, parseUrl, sortDetails } from "../../utils/helpers";
const { EXCLUDED_TYPES } = require("../../utils/constants");
import DetailsTable from "./DetailsTable";
import CriticalRequestChain from "./CriticalRequestChain";
import DebugTable from "./DebugTable";
import "./accordion.css";
const { createGzip } = require("zlib");

export default class Diagnostics extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { diagnostics: unsorted, visualization } = this.props;
    console.log({ unsorted });
    const diagnostics = sortDetails(unsorted);
    console.log({ diagnostics });
    return (
      <div style={{padding: "20px"}}>

        <HeadingText
          type={HeadingText.TYPE.HEADING_3}
          spacingType={[HeadingText.SPACING_TYPE.LARGE]}
          style={{ marginTop: "50px"}}
        >
          Diagnostics
        </HeadingText>
        <BlockText spacingType={[BlockText.SPACING_TYPE.LARGE]}>
          These suggestions can help your page load faster. They don't{" "}
          <Link to="https://web.dev/performance-scoring/?utm_source=lighthouse&utm_medium=node">
            directly affect
          </Link>{" "}
          the {visualization} score.
        </BlockText>
        {diagnostics.map(
          (diagnostic) =>
            !EXCLUDED_TYPES.includes(diagnostic.details?.type) && (
              <Accordion {...diagnostic}>
                {
                  <div>
                    {["table", "opportunity"].includes(
                      diagnostic.details?.type
                    ) && <DetailsTable details={diagnostic.details} />}
                    {diagnostic.details?.type === "criticalrequestchain" && (
                      <CriticalRequestChain
                        chains={diagnostic.details.chains}
                        diagnostic={diagnostic}
                      />
                    )}
                    {diagnostic.details?.type === "debugdata" && (
                      <DebugTable debugData={diagnostic.details.items} />
                    )}
                  </div>
                }
              </Accordion>
            )
        )}
      </div>
    );
  }
}

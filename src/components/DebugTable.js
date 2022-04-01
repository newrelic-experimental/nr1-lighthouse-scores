import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  Grid,
  GridItem,
  NrqlQuery,
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
import { checkMeasurement, parseUrl } from "../../utils/helpers";

import "./accordion.css";

export default class DebugTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { debugData } = this.props;
    console.log({ debugData });
    const items = Object.entries(debugData[0]);
    console.log({ items });
    return (
      <Table items={items}>
        <TableHeader>
          <TableHeaderCell
            value={({ item }) => item[0]}
          >
            Vital
          </TableHeaderCell>
          <TableHeaderCell
            value={({ item }) => item[1]}
          >
            Score
          </TableHeaderCell>
        </TableHeader>

        {({ item }) => (
          <TableRow>
            <TableRowCell>{item[0]}</TableRowCell>
            <TableRowCell>{!item[1] ? 'null' : Math.round((item[1] + Number.EPSILON) * 1000) / 1000 || 0.001}</TableRowCell>
          </TableRow>
        )}
      </Table>
    );
  }
}

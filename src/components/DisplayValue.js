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

export default class DetailsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { displayValue, explanation, color } = this.props;

    return (
      <span style={{ color }}>{displayValue && ` - ${displayValue}` || explanation && ` - ${explanation}`}</span>
    );
  }
}

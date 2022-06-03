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
import Accordion from "../../src/components/Accordion";
import { checkMeasurement, parseUrl } from "../../utils/helpers";
import DetailsTable from "./DetailsTable";

import "./accordion.css";

export default class Passed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accordionIsOpen: false,
      display: "none",
    };
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }
  createOpportunityTable = (details) => {
    const { headings, items } = details;
    const tableKeys = headings.map((heading) => {
      return heading.key;
    });
    return (
      <Table items={items} multivalue>
        <TableHeader>
          {headings.map((heading) => (
            <TableHeaderCell
              value={({ item }) => item[heading.key]}
              width={
                heading.key === "node"
                  ? "5%"
                  : heading.key === "url"
                  ? "60%"
                  : "20%"
              }
            >
              {heading.label}
            </TableHeaderCell>
          ))}
        </TableHeader>

        {({ item }) => (
          <TableRow>
            {tableKeys.map((key) => {
              if (key === "url" && item[key].startsWith("http")) {
                const { value, additionalValue } = parseUrl(item[key]);
                return (
                  <TableRowCell additionalValue={`${additionalValue}`}>
                    <Link to={item["url"]}>{value}</Link>
                  </TableRowCell>
                );
              } else if (key === "node") {
                return (
                  <TableRowCell>
                    <img
                      src={item["url"]}
                      style={{ width: "24px", height: "24px" }}
                    />
                  </TableRowCell>
                );
              }
              const { valueType } = headings.filter(
                (heading) => heading.key === key
              )[0];
              const measurement = checkMeasurement(valueType, item[key]);
              // console.log({ valueType });
              return <TableRowCell>{`${measurement}`}</TableRowCell>;
            })}
          </TableRow>
        )}
      </Table>
    );
  };
  toggleAccordion = () => {
    if (this.state.accordionIsOpen) {
      this.setState({ accordionIsOpen: false, display: "none" });
    } else {
      this.setState({ accordionIsOpen: true, display: "block" });
    }
  };
  render() {
    const { passed } = this.props;
    return (
      <div style={{padding: "20px"}}>
        <HeadingText 
          type={HeadingText.TYPE.HEADING_3}
          spacingType={[HeadingText.SPACING_TYPE.LARGE]}
          style={{ marginTop: "50px", marginBottom: "20px" }}
        >
          Passed audits <span style={{ color: "green" }}>({passed.length})</span>
        </HeadingText>
        {passed.map((pass) => {
          return (
            <Accordion {...pass}>
              {
                <div>
                  {["table", "opportunity"].includes(
                      pass.details?.type
                    ) && (
                    <DetailsTable details={pass.details} />
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

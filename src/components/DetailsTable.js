import React from "react";
import {
  Link,
  Table,
  TableHeaderCell,
  TableRow,
  TableHeader,
  TableRowCell,
} from "nr1";
import {
  checkMeasurement,
  parseUrl,
  capitalizeFirstLetter,
} from "../../utils/helpers";
import SubItemTable from "./SubItemTable";

import "./accordion.css";

export default class DetailsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { headings, items } = this.props.details;

    const tableKeys = headings.map((heading) => {
      return heading.key;
    });
    if (
      items.every(
        (item) => item.subItems && !item.subItems.source && !item.node?.selector
      )
    ) {
      return <SubItemTable details={this.props.details} />;
    }
    // console.log({ items, headings });
    return (
      <Table items={items} multivalue>
        <TableHeader>
          {headings.map((heading) => (
            <TableHeaderCell
              value={({ item }) => item[heading.key]}
              width={
                heading.key === "node" && heading.text !== "Element"
                  ? "5%"
                  : heading.key === "url"
                  ? "60%"
                  : ["severity", "directive"].includes(heading.key)
                  ? "10%"
                  : "20%"
              }
            >
              {heading.label || heading.text}
            </TableHeaderCell>
          ))}
        </TableHeader>

        {({ item }) => (
          <TableRow>
            {tableKeys.map((key) => {
              if (key === "url") {
                if (item[key]?.startsWith("http")) {
                  const { value, additionalValue } = parseUrl(item[key]);
                  return (
                    <TableRowCell additionalValue={`${additionalValue}`}>
                      <Link to={item["url"]}>{value}</Link>
                    </TableRowCell>
                  );
                }
                // console.log({ item });
                if (item.resourceType === "Image") {
                  return (
                    <TableRowCell additionalValue={item.mimeType}>
                      {item["url"]}
                    </TableRowCell>
                  );
                }
                return <TableRowCell>{item["url"]}</TableRowCell>;
              } else if (key === "node") {
                console.log({ item });
                if (item.node?.snippet) {
                  return (
                    <TableRowCell additionalValue={item.node.nodeLabel}>
                      <span style={{ color: "blue" }}>{item.node.snippet}</span>
                    </TableRowCell>
                  );
                } else if (item["url"]) {
                  return (
                    <TableRowCell>
                      <img
                        src={item["url"]}
                        style={{ width: "24px", height: "24px" }}
                      />
                      {item["label"]}
                    </TableRowCell>
                  );
                } else {
                  return <TableRowCell />;
                }
              } else if (key === "source") {
                // console.log({ item });
                const { value, additionalValue } = parseUrl(item.source["url"]);
                return (
                  <TableRowCell additionalValue={`${additionalValue}`}>
                    <Link to={item["url"]}>{value}</Link>
                  </TableRowCell>
                );
              } else if (key === "sourceLocation") {
                const {
                  source,
                  sourceLocation: { url },
                } = item;
                return (
                  <TableRowCell
                    additionalValue={`${capitalizeFirstLetter(source)}`}
                  >
                    <Link to={url}>{url}</Link>
                  </TableRowCell>
                );
              } else if (["description", "directive"].includes(key)) {
                return <TableRowCell>{item[key]}</TableRowCell>;
              } else if (key === "href") {
                if (item.href.startsWith("http")) {
                  const { value, additionalValue } = parseUrl(item.href);
                  return (
                    <TableRowCell
                      additionalValue={`${additionalValue}`}
                      style={{ marginLeft: "15px" }}
                    >
                      <Link to={item.href}>{value}</Link>
                    </TableRowCell>
                  );
                }
                return <TableRowCell>{item.href}</TableRowCell>;
              }
              // console.log({ key });
              const { valueType, itemType, granularity } = headings.filter(
                (heading) => heading.key === key
              )[0];
              // console.log({ itemType });
              const measurement = checkMeasurement(
                valueType || itemType,
                item[key],
                granularity
              );
              return <TableRowCell>{`${measurement}`}</TableRowCell>;
            })}
          </TableRow>
        )}
      </Table>
    );
  }
}

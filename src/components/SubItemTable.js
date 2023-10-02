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

export default class SubItemTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { headings, items } = this.props.details;
    // const  = ["url", "transferSize", "mainThreadTime"];
    const tableKeys = headings.map((heading) => {
      if (!heading.key && heading.subItemsHeading) {
        return heading.subItemsHeading.key;
      }
      return heading.key;
    });
    const transformedItems = [];
    // console.log({ items, headings });
    items.forEach((item) => {
      const mainKey = Object.keys(item).reduce((acc, key) => {
        if (key === "entity") {
          const flatten = Object.keys(item.entity).reduce((acc, entityKey) => {
            return { ...acc, [entityKey]: item.entity[entityKey] };
          }, {});
          return { ...acc, ...flatten };
        }
        return { ...acc, [key]: item[key] };
      }, {});

      transformedItems.push(mainKey);
      item.subItems?.items.forEach((subItem) => {
        const subKey = Object.keys(subItem).reduce((acc, key) => {
          if (key === "location") {
            const flatten = Object.keys(subItem.location).reduce(
              (acc, locationKey) => {
                return { ...acc, [locationKey]: subItem.location[locationKey] };
              },
              {}
            );
            return { ...acc, ...flatten };
          }
          if (key === "source") {
            return acc;
          }
          return { ...acc, [key]: subItem[key] };
        }, {});
        transformedItems.push(subKey);
      });
    });

    return (
      <Table items={transformedItems} multivalue>
        <TableHeader>
          {headings.map((heading) => (
            <TableHeaderCell
              value={({ item }) => item[heading]}
              width={
                ["url", "entity"].includes(heading.key)
                  ? "60%"
                  : "20%"
              }
            >
              {heading.text || heading.label || heading.key}
            </TableHeaderCell>
          ))}
        </TableHeader>

        {({ item }) => (
          <TableRow>
            {tableKeys.map((key) => {
              if (key === "entity") {
                if (item.text) {
                  return (
                    <TableRowCell>
                      <Link to={item.url}>{item.text}</Link>
                    </TableRowCell>
                  );
                } else if (item.url) {
                  if (item.url.startsWith("http")) {
                    const { value, additionalValue } = parseUrl(item.url);
                    return (
                      <TableRowCell
                        additionalValue={`${additionalValue}`}
                        style={{ marginLeft: "15px" }}
                      >
                        <Link to={item.url}>{value}</Link>
                      </TableRowCell>
                    );
                  }
                  return <TableRowCell>{item.url}</TableRowCell>;
                }
                else {
                  var i = 0;
                  var domain = '';
                  while (item[i]) {
                    domain = domain + item[i];
                    i++;
                  }
                  return (
                    <TableRowCell>{domain}</TableRowCell>
                  );
                }
              }
              if (["url"].includes(key)) {
                if (item.subItems) {
                  return (
                    <TableRowCell>
                      <Link to={item.url}>{item.url}</Link>
                    </TableRowCell>
                  );
                }
                if (item.url?.startsWith("http")) {
                  const { value, additionalValue } = parseUrl(item.url);
                  return (
                    <TableRowCell
                      additionalValue={`${additionalValue}`}
                      style={{ marginLeft: "15px" }}
                    >
                      <Link to={item.url}>{value}</Link>
                    </TableRowCell>
                  );
                }
                return <TableRowCell>{item.url}</TableRowCell>;
              } else if (["scriptUrl"].includes(key)) {
                if (item.subItems) {
                  const { value, additionalValue } = parseUrl(item.scriptUrl);
                  return (
                    <TableRowCell>
                      <Link to={item.scriptUrl}>{value}</Link>
                      {"  "}
                      <span>({additionalValue})</span>
                    </TableRowCell>
                  );
                }
                if (item.error) {
                  return <TableRowCell>{item.error}</TableRowCell>;
                }
                if (item.scriptUrl?.startsWith("http")) {
                  const { value, additionalValue } = parseUrl(item.scriptUrl);
                  return (
                    <TableRowCell
                      additionalValue={`${additionalValue}`}
                      style={{ marginLeft: "15px" }}
                    >
                      <Link to={item.scriptUrl}>{value}</Link>
                    </TableRowCell>
                  );
                }
                return <TableRowCell>{item.scriptUrl}</TableRowCell>;
              } else if (["sourceMapUrl"].includes(key)) {
                if (item.subItems) {
                  const { value, additionalValue } = parseUrl(
                    item.sourceMapUrl
                  );
                  return (
                    <TableRowCell>
                      <Link to={item.sourceMapUrl}>{value}</Link>
                      {"  "}
                      <span>({additionalValue})</span>
                    </TableRowCell>
                  );
                }
                if (item.sourceMapUrl?.startsWith("http")) {
                  const { value, additionalValue } = parseUrl(
                    item.sourceMapUrl
                  );
                  return (
                    <TableRowCell
                      additionalValue={`${additionalValue}`}
                      style={{ marginLeft: "15px" }}
                    >
                      <Link to={item.sourceMapUrl}>{value}</Link>
                    </TableRowCell>
                  );
                }
                return <TableRowCell>{item.sourceMapUrl}</TableRowCell>;
              } else if (key === "node") {
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
                }
              } else if (key === 'product') {
                return (<TableRowCell>{item[key] || ` - ${item.url}`}</TableRowCell>)
              }
              if (key === "signal") {
                return <TableRowCell>{item[key]}</TableRowCell>;
              }
              const { valueType, itemType, granularity } = headings.filter(
                (heading) => heading.key === key
              )[0];

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

import React from "react";

import {
  Table,
  TableHeader,
  TableRow,
  TableRowCell,
  TableHeaderCell,
  ngql,
  NerdGraphQuery,
  Icon,
  Spinner,
  Tooltip,
  navigation,
} from "nr1";
import { getMainColor, validScore } from "../../../utils/helpers";
import TableEmptyState from "./TableEmptyState";
import ErrorState from "../../../src/error-state";

export default class OverviewTable extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      accountId: "",
      items: null,
      nrqlError: null,
    };
  }

  componentDidMount = async () => {
    await this._getItems();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const { accountId } = this.props;

    if (prevProps.accountId === accountId) {
      return;
    }
    await this._getItems();
  };

  _getItems = async () => {
    const { accountId } = this.props;
    if (!accountId) {
      return;
    }
    const eventTypes = [
      "lighthousePerformance",
      "lighthouseAccessibility",
      "lighthouseBestPractices",
      "lighthouseSeo",
    ];
    const allResults = await Promise.all(
      eventTypes.map(async (eventType) => {
        const query = ngql`query($id: Int!) {
            actor {
              account(id: $id) {
              nrql(query: "SELECT average(score) FROM ${eventType} FACET requestedUrl, deviceType SINCE 2 days ago LIMIT MAX") {
                nrql
                results
              }
            }
          }
        }`;
        const variables = { id: accountId };
        const { data, error } = await NerdGraphQuery.query({
          query,
          variables,
        });
        if (error) {
          console.error(error);
          this.setState({ nrqlError: error });
          return;
        }
        const {
          actor: {
            account: {
              nrql: { results },
            },
          },
        } = data;

        return { eventType, data: results };
      })
    );

    const items = this._formatResults(allResults).sort((a, b) =>
      a.requestedUrl.localeCompare(b.requestedUrl)
    );
    this.setState({ items });
  };

  _formatResults = (results) => {
    // Map to an array of URL|device arrays, then filter out duplicate arrays
    const requestedUrls = Array.from(
      new Set(
        results
          .flatMap((result) => {
            return result.data.map((item) => {
              const { facet } = item;

              return [facet[0], facet[1]];
            });
          })
          .map(JSON.stringify)
      ),
      JSON.parse
    );

    const items = requestedUrls.map(([requestedUrl, deviceType]) => {
      return results.reduce((acc, result) => {
        try {
          const averageScore = result.data.find(
            (datum) =>
              datum.facet[0] === requestedUrl && datum.facet[1] === deviceType
          )["average.score"];
          return {
            requestedUrl,
            deviceType,
            ...acc,
            [`${result.eventType}Score`]: averageScore,
          };
        }
        catch (e) {
          return {
            requestedUrl,
            deviceType,
            ...acc,
            [`${result.eventType}Score`]: null,
          }
        }
      }, {});
    });
    
    return items;
  };

  _getScore = (value) => {
    if (!validScore(value)) {
      return "No data";
    }
    else {
      return Math.round(value * 100);
    }
  }

  _getMainColor = (value) => {
    return getMainColor(this._getScore(value));
  };

  _openModal = (requestedUrl, deviceType, modal, value) => {
    if (validScore(value)) {
      const { accountId } = this.props;
      navigation.openStackedNerdlet({
        id: modal,
        urlState: {
          accountId,
          requestedUrl,
          deviceType,
        },
      });
    }
  };

  render() {
    const { items, nrqlError } = this.state;

    if (nrqlError) {
      return <ErrorState error={nrqlError} />;
    }

    return items ? (
      items.length > 0 ? (
        <Table items={items} style={{ fontSize: "2em" }}>
          <TableHeader>
            <TableHeaderCell
              value={({ item }) => item.requestedUrl}
              width="30%"
            >
              Requested URL
            </TableHeaderCell>
            <TableHeaderCell value={({ item }) => item.deviceType} width="10%">
              Device
            </TableHeaderCell>
            <TableHeaderCell
              value={({ item }) => item.lighthousePerformanceScore}
            >
              Performance
            </TableHeaderCell>
            <TableHeaderCell
              value={({ item }) => item.lighthouseAccessibilityScore}
            >
              Accessibility
            </TableHeaderCell>
            <TableHeaderCell
              value={({ item }) => item.lighthouseBestPracticesScore}
            >
              Best Practices
            </TableHeaderCell>
            <TableHeaderCell value={({ item }) => item.lighthouseSeoScore}>
              SEO
            </TableHeaderCell>
          </TableHeader>

          {({ item }) => (
            <TableRow>
              <TableRowCell>{item.requestedUrl}</TableRowCell>
              <TableRowCell>
                {item.deviceType === "mobile" ? (
                  <Tooltip text="Mobile">
                    <Icon
                      type={Icon.TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__MOBILE}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip text="Desktop">
                    <Icon
                      type={Icon.TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__DESKTOP}
                    />
                  </Tooltip>
                )}
              </TableRowCell>
              <TableRowCell
                style={{
                  backgroundColor: this._getMainColor(item.lighthousePerformanceScore),
                  color: "white",
                }}
                onClick={validScore(item.lighthousePerformanceScore) ? () =>
                  this._openModal(item.requestedUrl, item.deviceType, "performance-modal", item.lighthousePerformanceScore) : undefined
                }
              >
                {this._getScore(item.lighthousePerformanceScore)}
              </TableRowCell>
              <TableRowCell
                style={{
                  backgroundColor: this._getMainColor(item.lighthouseAccessibilityScore),
                  color: "white",
                }}
                onClick={validScore(item.lighthouseAccessibilityScore) ? () =>
                  this._openModal(item.requestedUrl, item.deviceType, "accessibility-modal", item.lighthouseAccessibilityScore) : undefined
                }
              >
                {this._getScore(item.lighthouseAccessibilityScore)}
              </TableRowCell>
              <TableRowCell
                style={{
                  backgroundColor: this._getMainColor(item.lighthouseBestPracticesScore),
                  color: "white",
                }}
                onClick={validScore(item.lighthouseBestPracticesScore) ? () =>
                  this._openModal(item.requestedUrl, item.deviceType, "best-practices-modal", item.lighthouseBestPracticesScore) : undefined
                }
              >
                {this._getScore(item.lighthouseBestPracticesScore)}
              </TableRowCell>
              <TableRowCell
                style={{
                  backgroundColor: this._getMainColor(item.lighthouseSeoScore),
                  color: "white",
                }}
                onClick={validScore(item.lighthouseSeoScore) ? () =>
                  this._openModal(item.requestedUrl, item.deviceType, "seo-modal", item.lighthouseSeoScore) : undefined
                }
              >
                {this._getScore(item.lighthouseSeoScore)}
              </TableRowCell>
            </TableRow>
          )}
        </Table>
      ) : (
        <TableEmptyState />
      )
    ) : (
      <Spinner type={Spinner.TYPE.DOT} />
    );
  }
}

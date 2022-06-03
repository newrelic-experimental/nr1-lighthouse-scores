import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  HeadingText,
  Grid,
  GridItem,
  NrqlQuery,
  Spinner,
  AutoSizer,
  Tile,
  Link,
  List,
  ListItem,
} from "nr1";
import {
  getSymbol,
  checkMeasurement,
  getMainColor,
  parseUrl,
} from "../../utils/helpers";
import DisplayValue from "./DisplayValue";
import ReactMarkdown from "react-markdown";
import "./accordion.css";
import {
  vertBar,
  upRightBar,
  horizDownBar,
  rightBar,
  vertRightBar,
} from "./crc-bars";

export default class CriticalRequestChain extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accordionIsOpen: false,
      display: "none",
    };
  }

  initTree = (tree) => {
    let startTime = 0;
    const rootNodes = Object.keys(tree);
    if (rootNodes.length > 0) {
      const node = tree[rootNodes[0]];
      startTime = node.request.startTime;
    }

    return { tree, startTime, transferSize: 0 };
  };
  createSegment = (
    parent,
    id,
    startTime,
    transferSize,
    treeMarkers,
    parentIsLastChild
  ) => {
    const node = parent[id];
    const siblings = Object.keys(parent);
    const isLastChild = siblings.indexOf(id) === siblings.length - 1;
    const hasChildren =
      !!node.children && Object.keys(node.children).length > 0;

    // Copy the tree markers so that we don't change by reference.
    const newTreeMarkers = Array.isArray(treeMarkers)
      ? treeMarkers.slice(0)
      : [];

    // Add on the new entry.
    if (typeof parentIsLastChild !== "undefined") {
      newTreeMarkers.push(!parentIsLastChild);
    }

    return {
      node,
      isLastChild,
      hasChildren,
      startTime,
      transferSize: transferSize + node.request.transferSize,
      treeMarkers: newTreeMarkers,
    };
  };
  buildTree = (segment, elem) => {
    elem.push(this.createChainNode(segment));
    if (segment.node.children) {
      for (const key of Object.keys(segment.node.children)) {
        const childSegment = this.createSegment(
          segment.node.children,
          key,
          segment.startTime,
          segment.transferSize,
          segment.treeMarkers,
          segment.isLastChild
        );
        this.buildTree(childSegment, elem);
      }
    }
    return elem;
  };
  createChainNode = (segment) => {
    const treeMarkerEl = [];
    // Construct lines and add spacers for sub requests.
    segment.treeMarkers.forEach((separator) => {
      if (separator) {
        treeMarkerEl.push(
          <span
            style={{
              width: "16px",
              height: "26px",
              display: "inline-block",
            }}
          >
            {vertBar}
          </span>
        );
      } else {
        treeMarkerEl.push(
          <span
            style={{
              width: "16px",
              display: "inline-block",
            }}
          />
        );
      }
      treeMarkerEl.push(
        <span
          style={{
            width: "16px",
            display: "inline-block",
          }}
        />
      );
    });

    if (segment.isLastChild) {
      treeMarkerEl.push(
        <span
          style={{
            width: "16px",
            display: "inline-block",
          }}
        >
          {upRightBar}
        </span>
      );
      treeMarkerEl.push(
        <span
          style={{
            width: "16px",
            display: "inline-block",
          }}
        >
          {rightBar}
        </span>
      );
    } else {
      treeMarkerEl.push(
        <span
          style={{
            width: "16px",
            display: "inline-block",
          }}
        >
          {vertRightBar}
        </span>
      );
      treeMarkerEl.push(
        <span
          style={{
            width: "16px",
            display: "inline-block",
          }}
        >
          {rightBar}
        </span>
      );
    }

    if (segment.hasChildren) {
      treeMarkerEl.push(
        <span
          style={{
            width: "16px",
            display: "inline-block",
          }}
        >
          {horizDownBar}
        </span>
      );
    } else {
      treeMarkerEl.push(
        <span
          style={{
            width: "16px",
            display: "inline-block",
          }}
        >
          {rightBar}
        </span>
      );
    }

    // Fill in url, host, and request size information.
    const url = segment.node.request.url;
    const { value, additionalValue } = parseUrl(url);
    treeMarkerEl.push(
      <Link to={url} style={{ marginLeft: "5px" }}>
        {value === "/"
          ? url
          : value.length > 20
          ? `${value.slice(0, 19)}...`
          : value}
      </Link>
    );
    treeMarkerEl.push(
      <span
        style={{
          marginLeft: "5px",
          color: "grey",
        }}
      >
        {` - ${additionalValue}`}
      </span>
    );
    if (!segment.hasChildren) {
      const { startTime, endTime, transferSize } = segment.node.request;

      treeMarkerEl.push(
        <span style={{ marginLeft: "5px" }}>{`${Math.round(
          (endTime - startTime) * 1000
        )} ms, ${transferSize / 1000} Kib`}</span>
      );
    }

    return <div style={{ verticalAlign: "middle" }}>{treeMarkerEl}</div>;
  };

  renderTree = (chains) => {
    const containerEl = [];
    const root = this.initTree(chains);
    const trees = Object.keys(root.tree).map((key) => {
      const segment = this.createSegment(
        root.tree,
        key,
        root.startTime,
        root.transferSize
      );
      return this.buildTree(segment, containerEl);
    });

    return trees;
  };
  render() {
    const {
      chains,
      diagnostic: { details },
    } = this.props;

    return (
      <>
        <Card>
          <CardHeader
            title={`Maximum critical path latency: ${Math.round(
              details.longestChain.duration
            )} ms`}
            subtitle="Initial Navigation"
          />
          <CardBody>{this.renderTree(chains)}</CardBody>
        </Card>
      </>
    );
  }
}

import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  Grid,
  GridItem,
  NrqlQuery,
  Spinner,
  Button,
  Tile,
} from "nr1";
const zlib = require("zlib");

export default class TreemapButton extends React.Component {
  constructor(props) {
    super(props);

  }
  render() {
    const {metadata, treemapData, locale, finalUrl, requestedUrl} = this.props;
    const payload = {
      lhr: {
        requestedUrl,
        finalUrl,
        audits: {
          "script-treemap-data": treemapData,
        },
        configSettings: { locale },
      },
    };
    var deflated = zlib.deflateSync(JSON.stringify(payload)).toString("base64");
    const url = "https://googlechrome.github.io/lighthouse/treemap/?gzip=1#";

    return (
      <Button
        iconType={Button.ICON_TYPE.DATAVIZ__DATAVIZ__SERVICE_MAP_CHART}
        type={Button.TYPE.PRIMARY}
        to={`${url}${deflated}`}
      >
        View Treemap
      </Button>
    );
  }
}

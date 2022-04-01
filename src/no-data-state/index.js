import React from 'react';
import { Card, CardBody, HeadingText, BlockText } from 'nr1';

const NoDataState = () => (
  <Card className="NoDataState">
    <CardBody className="NoDataState-cardBody">
      <div className="NoDataState-cardBody-background">
        <HeadingText
          className="NoDataState-headingText"
          type={HeadingText.TYPE.HEADING_3}
        >
          No chart data available
        </HeadingText>
        <BlockText
          className="NoDataState-bodyText"
          type={BlockText.TYPE.NORMAL}
        >
          Make sure you have a Synthetics script generating data for this URL and Device type
        </BlockText>
      </div>
    </CardBody>
  </Card>
);

export default NoDataState;

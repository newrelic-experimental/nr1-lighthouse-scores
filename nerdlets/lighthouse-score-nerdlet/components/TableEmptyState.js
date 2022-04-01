import React from 'react';
import { Card, CardBody, HeadingText, BlockText } from 'nr1';

const TableEmptyState = () => (
  <Card className="NoDataState">
    <CardBody className="NoDataState-cardBody">
      <div className="NoDataState-cardBody-background">
        <HeadingText
          className="NoDataState-headingText"
          type={HeadingText.TYPE.HEADING_3}
        >
          No data available
        </HeadingText>
        <BlockText
          className="NoDataState-bodyText"
          type={BlockText.TYPE.NORMAL}
        >
          Try creating some monitors by clicking the 'Build script' button or switch your account.
        </BlockText>
      </div>
    </CardBody>
  </Card>
);

export default TableEmptyState;
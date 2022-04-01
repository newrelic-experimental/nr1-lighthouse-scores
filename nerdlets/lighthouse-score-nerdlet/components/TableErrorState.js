import React from 'react';
import { Card, CardBody, HeadingText, BlockText } from 'nr1';

const ErrorState = ({error}) => (
  <Card className="ErrorState">
    <CardBody className="ErrorState-cardBody">
      <HeadingText
        className="ErrorState-headingText"
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
        type={HeadingText.TYPE.HEADING_3}
      >
        Oops! Something went wrong.
        {JSON.stringify(error)}
      </HeadingText>
    </CardBody>
  </Card>
);


export default ErrorState;
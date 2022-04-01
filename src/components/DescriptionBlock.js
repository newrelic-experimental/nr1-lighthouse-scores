import React from "react";
import { PropTypes } from 'prop-types';
import {
  Card,
  CardBody,
  HeadingText,
  Grid,
  GridItem,
  BlockText,
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

const DescriptionBlock = ({explanation, link}) => {
  return (
    <Grid
      spacingType={[
        Grid.SPACING_TYPE.EXTRA_LARGE,
        Grid.SPACING_TYPE.NONE,
        Grid.SPACING_TYPE.NONE,
      ]}
      gapType={Grid.GAP_TYPE.SMALL}
    >
      <GridItem columnSpan={12}>
        <BlockText>{explanation}</BlockText>
      </GridItem>
      <GridItem columnSpan={12}>
        <Link to={link}>Read more</Link>
      </GridItem>
    </Grid>
  );
};

DescriptionBlock.propTypes = {
  explanation: PropTypes.string,
  link: PropTypes.string,
}

export default DescriptionBlock;

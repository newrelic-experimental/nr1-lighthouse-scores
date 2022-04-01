import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Grid, GridItem } from 'nr1';

const Legend = ({ items, style, className }) => {
  return (
    <div className={cx('Legend', className)} style={{ ...style }}>
      <Grid gapType={Grid.GAP_TYPE.SMALL}>
        {items.map((item, index) => (
          <LegendItem {...item} key={index} />
        ))}
      </Grid>
    </div>
  );
};

Legend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  style: PropTypes.object,
  className: PropTypes.string,
};

const LegendItem = ({ color, label }) => {
  return (
    <GridItem columnSpan={3} className="LegendItem">
      <div className="LegendItem-content">
        <div className="LegendItem-dot" style={{ backgroundColor: color }} />
        <div className="LegendItem-label" title={label}>
          {label}
        </div>
      </div>
    </GridItem>
  );
};

LegendItem.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
};

export default Legend;

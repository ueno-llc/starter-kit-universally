import React from 'react';
import PropTypes from 'prop-types';

import s from './Heading.scss';

const Heading = ({ children }) => (
  <h1 className={s.heading}>
    {children}
  </h1>
);

Heading.propTypes = {
  children: PropTypes.node,
};

export default Heading;

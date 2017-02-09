import React, { PropTypes } from 'react';
import s from './Container.scss';

const Container = ({ children }) => (
  <div className={s('container')}>
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node,
};

export default Container;

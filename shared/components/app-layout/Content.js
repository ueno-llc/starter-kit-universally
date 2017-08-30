import React from 'react';
import PropTypes from 'prop-types';

import s from './Content.scss';

export default function Content({ children }) {
  return (
    <main className={s.content}>
      {children}
    </main>
  );
}

Content.propTypes = {
  children: PropTypes.node,
};

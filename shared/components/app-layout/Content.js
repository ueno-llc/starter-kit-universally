import React, { PropTypes } from 'react';
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

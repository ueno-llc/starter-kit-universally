/**
 * This is the HTML container that our React Application will be rendered in.
 * We keep it at this location to allow ourselves to make arbitrary changes
 * easily along with other changes to our app components.
 *
 * It's also useful to have a simple shared component like this that can be
 * shared by various parts of our system, for e.g. server side rendering
 * and/or a service worker offline page generator.
 */
/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/html-has-lang */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * The is the HTML shell for our React Application.
 */
function HTML(props) {
  const {
    htmlAttributes,
    headerElements,
    bodyElements,
    appBodyString,
  } = props;

  return (
    <html {...htmlAttributes}>
      <head>
        { headerElements }
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: appBodyString }} />
        { bodyElements }
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headerElements: PropTypes.node,
  bodyElements: PropTypes.node,
  appBodyString: PropTypes.string,
};

HTML.defaultProps = {
  appBodyString: '',
  headerElements: null,
  htmlAttributes: {},
  bodyElements: null,
};

// EXPORT

export default HTML;

import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import filterWithRules from '../../internal/utils/objects/filterWithRules';
import values from '../values';

// Filter the config down to the properties that are allowed to be included
// in the HTML response.
const clientConfig = filterWithRules(
  // These are the rules used to filter the config.
  values.clientConfigFilter,
  // The config values to filter.
  values,
);

const serializedClientConfig = serialize(clientConfig);

/**
 * A react component that generates a script tag that binds the allowed
 * values to the window so that config values can be read within the
 * browser.
 *
 * They get bound to window.__CLIENT_CONFIG__
 */
function ClientConfig({ addHash }) {
  return (
    <script
      type="text/javascript"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: addHash(`window.__CLIENT_CONFIG__=${serializedClientConfig}`),
      }}
    />
  );
}

ClientConfig.propTypes = {
  addHash: PropTypes.func.isRequired,
};

export default ClientConfig;

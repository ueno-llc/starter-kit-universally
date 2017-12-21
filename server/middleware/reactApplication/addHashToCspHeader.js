import crypto from 'crypto';

/**
 * Creates a function which has access to an express response object
 *
 * @param  {object} response An express response object
 * @return {function} A function
 */
export default response =>
  /**
   * Modifies the `content-security-policy` header of the response by
   * adding a sha256 hash of the input to the `script-src` directive
   *
   * @param  {string} content
   * @return {string} The input
   */
  (content) => {
    const sha256 = crypto.createHash('sha256').update(content).digest('base64');

    response.setHeader(
      'content-security-policy',
      (response.getHeader('content-security-policy') || '')
        .split(';')
        .map(directive => directive.includes('script-src')
          ?
          `${directive} 'sha256-${sha256}'`
          :
          directive)
        .join(';'),
    );

    return content;
  };

/* config-overrides.js */
const { override, useEslintRc } = require('customize-cra');
const path = require('path');
/**
 * @param {any} config
 * @return {any}
 */

const EslintRc = override(
  useEslintRc(path.resolve(__dirname, '.eslintrc.js'))
);
module.exports = function override(config, env) {
  // do stuff with the webpack config...

  return (
    EslintRc(config)
  )
};

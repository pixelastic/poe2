const wikijs = require('wikijs').default;
const { _ } = require('golgoth');

/**
 * This is a shared config singleton. All modules can require it and thus share
 * the same config values once it is initialized
 **/
module.exports = {
  __config: {},
  /**
   * Init the shared config with the specified object
   * @param {object} config Initial config object
   **/
  init(config) {
    this.__config = {
      ...config,
    };
  },
  /**
   * Returns the value of a specific config
   * @param {string} path Path to the config, in dot syntax
   * @param {any} fallback Fallback value if the key is not found
   * @returns {any} Config value, or fallback if no such config
   **/
  get(path, fallback) {
    return _.get(this.__config, path, fallback);
  },

  apiUrl() {
    const wikiUrl = _.trim(this.get('wikiUrl'), '/');
    return `${wikiUrl}/api.php`;
  },
  wiki() {
    const apiUrl = this.apiUrl();
    return wikijs({
      apiUrl,
      origin: null,
    });
  },
};

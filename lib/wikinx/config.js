const wikijs = require('wikijs').default;
const { _ } = require('golgoth');

module.exports = {
  __config: {},
  async init(config) {
    this.__config = {
      ...config,
    };
  },
  get(path, fallback) {
    return _.get(this.__config, path, fallback);
  },
  apiUrl() {
    const wikiUrl = this.get('wikiUrl');
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

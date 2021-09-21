const config = require('./config.js');
const { buildUrl, readJsonUrl } = require('firost');
const { _ } = require('golgoth');

module.exports = {
  // Get the page raw content
  async raw(pageName) {
    const apiUrl = config.apiUrl();
    // Get the raw content
    const rawApiUrl = buildUrl(apiUrl, {
      action: 'parse',
      prop: 'wikitext',
      format: 'json',
      page: pageName,
    });
    const rawResponse = await readJsonUrl(rawApiUrl);
    return _.get(rawResponse, 'parse.wikitext.*', '');
  },
};

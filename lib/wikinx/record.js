const { _ } = require('golgoth');
const { writeJson } = require('firost');
const page = require('./page.js');
const path = require('path');

module.exports = {
  // Return record data for a given page
  async data(pageName) {
    const raw = await page.raw(pageName);
    const title = pageName;
    return {
      title,
      raw,
    };
  },
  // Save record data on disk
  async save(pageName) {
    const data = await this.data(pageName);
    const filepath = this.getFilepath(pageName);
    await writeJson(data, filepath);
  },
  // Get record data filepath
  getFilepath(pageName) {
    const slug = this.getSlug(pageName);
    return path.resolve('./data/', `${slug}.json`);
  },
  // Get record slug
  getSlug(pageName) {
    return _.camelCase(pageName);
  },
};

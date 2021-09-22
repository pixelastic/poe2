const config = require('./config.js');
const { _ } = require('golgoth');
const { buildUrl, readJsonUrl, writeJson } = require('firost');
const path = require('path');

/**
 * A record is a JSON file saved on disk that represents a Wiki page
 **/
module.exports = {
  /**
   * Save a given page as a record on disk
   * @param {string} pageTitle Title of the page
   **/
  async save(pageTitle) {
    const data = await this.getData(pageTitle);
    const filepath = this.getFilepath(pageTitle);
    await writeJson(data, filepath);
  },
  /**
   * Returns a data object representing a page
   * @param {string} pageTitle Title of the page
   * @returns {object} Data object representing the page
   **/
  async getData(pageTitle) {
    const raw = await this.getRaw(pageTitle);
    const markdown = this.getMarkdownFromRaw(raw);
    const title = pageTitle;
    const slug = this.getSlug(pageTitle);
    return {
      title,
      slug,
      raw,
      markdown,
    };
  },
  /**
   * Returns the raw wiki content of a given page
   * @param {string} pageTitle Title of the page
   * @returns {string} Wikicontent of the page
   **/
  async getRaw(pageTitle) {
    const apiUrl = config.apiUrl();

    // Get the raw content
    const rawApiUrl = buildUrl(apiUrl, {
      action: 'parse',
      prop: 'wikitext',
      format: 'json',
      page: pageTitle,
    });
    const rawResponse = await readJsonUrl(rawApiUrl);

    return _.get(rawResponse, 'parse.wikitext.*', '');
  },
  getMarkdownFromRaw(rawContent) {
    return (
      _.chain(rawContent)
        .replace(/\{\{Infobox(.*?)\}\}/gs, '') // Skip infobox
        .replace(/==(.*?)==/g, '\n\n## $1\n\n') // Replace ==Header== to ## Header
        .replace(/^;(.*)$/gm, '\n\n###### $1\n\n') // Replace ;Bold with ###### Header
        // [[Link]] and [[Link|page]]
        .replace(/\[\[(.*?)\]\]/g, (match, linkContent) => {
          const split = linkContent.split('|');
          const pageTitle = split[0];
          const linkTitle = split[1] || split[0];
          const slug = this.getSlug(pageTitle);
          return `[${linkTitle}](/${slug}/)`;
        })
        .replace(/\n{2,}/g, '\n\n') // Keep only 2 new lines at most
        // TODO: Links and links with custom name
        .trim()
        .value()
    );
  },
  /**
   * Returns the page slug, used to uniquely identify the page in layouts and
   * filepaths
   * @param {string} pageTitle Title of the page
   * @returns {string} Page slug
   **/
  getSlug(pageTitle) {
    return _.camelCase(pageTitle);
  },
  /**
   * Returns the wiki slug, used in the wiki url, from a title
   * @param {string} pageTitle Title of the page
   * @returns {string} Wiki page slug
   **/
  getWikiSlug(pageTitle) {
    return _.chain(pageTitle).replace(/ /g, '_').replace(/'/g, '%27').value();
  },
  /**
   * Returns the path where to save the record on disk
   * @param {string} pageTitle Title of the page
   * @returns {string} Path to save the record
   **/
  getFilepath(pageTitle) {
    const slug = this.getSlug(pageTitle);
    return path.resolve(this.getDirname(), `${slug}.json`);
  },
  /**
   * Returns path to the data directory, where to save the records
   * @returns {string} Path to the data directory
   **/
  getDirname() {
    return path.resolve('./src/_data/pages/');
  },
};

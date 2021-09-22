const { pMap, _ } = require('golgoth');
const { spinner } = require('firost');
const config = require('./config.js');
const record = require('./record.js');

module.exports = {
  async run(userConfig) {
    config.init(userConfig);

    const pages = await this.getAllPages();
    const progress = spinner(pages.length);

    await pMap(pages, async (pageName) => {
      progress.tick(pageName);
      await record.save(pageName);

      // const details = await wiki.page(pageName);

      // const summary = await details.summary();
      // const mainImage = await details.mainImage();
      // const rawContent = await details.rawContent();
      // const content = await details.content();
      // const info = await details.info();
    }, { concurrency: 100 });
    progress.success('All records saved');
  },
  // Get all page titles of page in selected categories
  async getAllPages() {
    const wiki = config.wiki();
    const categories = config.get('categories', []);

    const pages = [];
    await pMap(categories, async (categoryName) => {
      const pagesInCategory = await wiki.pagesInCategory(
        `Category:${categoryName}`
      );
      pages.push(pagesInCategory);
    });

    return _.chain(pages).flatten().sort().uniq().value();
  },
};

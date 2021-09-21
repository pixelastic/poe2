const { pMap, _ } = require('golgoth');
const { spinner } = require('firost');
const config = require('./config.js');
const record = require('./record.js');

module.exports = {
  async initial(userConfig) {
    config.init(userConfig);


    const pages = await this.getAllPages();
    const progress = spinner(pages.length);

    await pMap(pages, async (pageName) => {
      progress.tick(pageName);
      await record.save(pageName);
      // TODO: Remove the infobox
      // TODO: Remove the summary

      // Convert to markdown
      // TODO: Convert ==TITLE== to ## Title
      // TODO: Convert ;title to ### Title
      // TODO: Convert [[Arkemyr]] to [Arkemyr](/Arkemyr)
      // TODO: Convert [[Arkemyr|Ivory]] to [Arkemyr](/Ivory)

      // POE specific code
      // Remove the Gallery section?
      //
      //
      //
      // MVP is getting the whole page as markdown
      //
      // const details = await wiki.page(pageName);

      // const summary = await details.summary();
      // const mainImage = await details.mainImage();
      // const rawContent = await details.rawContent();
      // const content = await details.content();
      // const info = await details.info();
      // To get the full raw stuff
      //https://pillarsofeternity.fandom.com/api.php?action=parse&page=Arkemyr%27s_Manor&prop=wikitext
      //
      //Then I can use wikijs info parsing
      //And replace [[]] with valid markdown

      // console.info({
      // summary,
      // mainImage,
      // content,
      // rawContent,
      // info,
      // });
    });
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

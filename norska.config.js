const { pMap, _ } = require('golgoth');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  hooks: {
    async afterHtml({ createPage }) {
      const template = '_includes/hooks/item.pug';

      let items = [...data];
      // Include fewer items in dev, to make reloading faster
      if (!isProduction) {
        items = _.filter(items, { title: 'Ring of the Ram' });
      }
      await pMap(items, async (item) => {
        const { gameSlug, slug } = item;
        const destination = `${gameSlug}/${slug}/index.html`;
        const pageData = {
          item,
          meta: {
            title: item.title,
            description: item.description,
          },
        };
        await createPage(template, destination, pageData);
      });
    },
  },
};


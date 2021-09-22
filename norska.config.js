const { pMap, _ } = require('golgoth');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  hooks: {
    // TODO: Document and test norska with data passed to afterHtml
    async afterHtml({ createPage, data }) {
      const template = '_includes/hooks/location.pug';
      let pages = _.values(data.pages);
      // if (!isProduction) {
      //   pages = _.filter(pages, { slug: 'arkemyrsManor' });
      // }

      await pMap(pages, async (page) => {
        const { slug } = page;
        const destination = `${slug}/index.html`;
        const pageData = {
          page,
          meta: {
            title: page.title,
          },
        };
        await createPage(template, destination, pageData);
      });
    },
  },
};

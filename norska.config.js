const { pMap, _ } = require('golgoth');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  hooks: {
    // TODO: Document and test norska with data passed to afterHtml
    async afterHtml({ createPage, data }) {
      const locationTemplate = '_includes/hooks/location.pug';
      let locationPages = data.locations;
      if (!isProduction) {
        locationPages = _.filter(locationPages, { slug: 'arkemyrsManor' });
      }

      await pMap(locationPages, async (page) => {
        const { slug } = page;
        const destination = `locations/${slug}/index.html`;
        const pageData = {
          page,
          meta: {
            title: page.title,
          },
        };
        await createPage(locationTemplate, destination, pageData);
      });
    },
  },
};

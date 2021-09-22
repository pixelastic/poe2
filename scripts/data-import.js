const wikinx = require('../lib/wikinx/');

(async () => {
  const config = {
    wikiUrl: 'https://pillarsofeternity.fandom.com/',
    categories: [
      'Pillars_of_Eternity_II:_Deadfire_locations',
      'Pillars_of_Eternity_II:_Deadfire_items',
      'Pillars_of_Eternity_II:_Deadfire_characters',
    ],
  };

  await wikinx.run(config);
})();

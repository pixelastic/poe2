const wikinx = require('../lib/wikinx/');

(async () => {
  const config = {
    wikiUrl: 'https://pillarsofeternity.fandom.com/',
    categories: [
      'Pillars_of_Eternity_II:_Deadfire_abilities',
      'Pillars_of_Eternity_II:_Deadfire_characters',
      'Pillars_of_Eternity_II:_Deadfire_items',
      'Pillars_of_Eternity_II:_Deadfire_locations',
      'Pillars_of_Eternity_II:_Deadfire_quests',
    ],
  };

  await wikinx.run(config);
})();

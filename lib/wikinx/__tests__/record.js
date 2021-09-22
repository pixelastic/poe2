const current = require('../record.js');
const config = require('../config.js');
const { readJson } = require('firost');

describe('record', () => {
  beforeEach(async () => {
    config.init({
      wikiUrl: `${serverUrl}/wiki/`,
    });
  });
  describe('getData', () => {
    it.each([["Arkemyr's Manor"]])('%s', async (title) => {
      const actual = await current.getData(title);
      const { slug } = actual;
      const expected = await readJson(`./fixtures/expected/${slug}.json`);
      expect(actual).toEqual(expected);
    });
  });
  describe('slugs', () => {
    it.each([["Arkemyr's Manor", 'arkemyrsManor', 'Arkemyr%27s_Manor']])(
      '%s',
      async (title, expectedSlug, expectedWikiSlug) => {
        const slug = current.getSlug(title);
        const wikiSlug = current.getWikiSlug(title);
        expect(slug).toEqual(expectedSlug);
        expect(wikiSlug).toEqual(expectedWikiSlug);
      }
    );
  });
  describe('getFilepath', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'getDirname').mockReturnValue('/__data__/');
    });
    it.each([["Arkemyr's Manor", '/__data__/arkemyrsManor.json']])(
      '%s',
      async (input, expected) => {
        const actual = current.getFilepath(input);
        expect(actual).toEqual(expected);
      }
    );
  });
  describe('getRaw', () => {
    it.each([["Arkemyr's Manor", '{{Infobox location poe2']])(
      '%s',
      async (input, expected) => {
        const actual = await current.getRaw(input);
        expect(actual).toStartWith(expected);
      }
    );
  });
  describe('getMarkdownFromRaw', () => {
    it.each([
      // Infobox
      [
        'Skipping the infobox',
        '{{Infobox location poe2\n| game          = poe2 }}==Background==',
        '## Background',
      ],
      // Headers
      [
        'One header',
        '==Background==\nThis vast manor...',
        '## Background\n\nThis vast manor...',
      ],
      [
        'Several headers on different lines',
        '==Background==\nThis vast manor...\n==History==\nSome notable information...',
        '## Background\n\nThis vast manor...\n\n## History\n\nSome notable information...',
      ],
      [
        'Several headers on the same line',
        '==Background==This vast manor...==History==Some notable information...',
        '## Background\n\nThis vast manor...\n\n## History\n\nSome notable information...',
      ],
      [
        ';Definition list used to do a small header',
        '==Loot==\n;Bedroom\nSome stuff',
        '## Loot\n\n###### Bedroom\n\nSome stuff',
      ],
      // Links
      [
        '[[Simple link]]',
        "You'll find a [[Black Pearl]]",
        "You'll find a [Black Pearl](/blackPearl/)",
      ],
      [
        '[[Boots of Speed (Deadfire)|Boots of Speed]]',
        "You'll find a pair of [[Boots of Speed (Deadfire)|Boots of Speed]]",
        "You'll find a pair of [Boots of Speed](/bootsOfSpeedDeadfire/)",
      ],
      [
        'Several links on the same line',
        "You'll find a [[Black Pearl]] and an [[Onyx]]",
        "You'll find a [Black Pearl](/blackPearl/) and an [Onyx](/onyx/)",
      ],
    ])('%s', async (_name, input, expected) => {
      const actual = current.getMarkdownFromRaw(input);
      // console.info({ actual, expected });
      expect(actual).toEqual(expected);
    });
  });
});

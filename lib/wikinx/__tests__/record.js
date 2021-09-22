const current = require('../record.js');
const config = require('../config.js');

describe('record', () => {
  beforeEach(async () => {
    config.init({});
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
    beforeEach(async () => {
      config.init({
        wikiUrl: `${serverUrl}/wiki/`,
      });
    });
    it.each([["Arkemyr's Manor", 'raw text']])(
      '%s',
      async (input, expected) => {
        const actual = await current.getRaw(input);
        expect(actual).toEqual(expected);
      }
    );
  });
});

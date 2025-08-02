

jest.mock('../../src/visualizer/utils');

const enums = require('../../src/common/enums');
const utils = require('../../src/visualizer/utils');
const exportDeck = require('../../src/visualizer/export');

describe('exportDeck', () => {
    beforeAll(() => {
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('includes headers when instructed to', () => {
        utils.parseCsv.mockReturnValue("Correct");
        exportDeck.exportDeck(
            [
                {
                    localStorageKey: "key",
                    header: "header",
                    export: word => word.word
                }
            ],
            [
                {
                    word: "word1",
                    count: 1,
                    state: enums.CardState.InDeck,
                    kuromojiId: 1
                }
            ],
            true
        );

        expect(utils.download).toHaveBeenCalledWith(expect.any(String), "Correct");
    });
});
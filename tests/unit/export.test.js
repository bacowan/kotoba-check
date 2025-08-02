jest.mock('../../src/visualizer/utils');

const enums = require('../../src/common/enums');
const utils = require('../../src/visualizer/utils');
const exportDeck = require('../../src/visualizer/export');

describe('exportDeck', () => {
    beforeAll(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
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

        const parseCsvCalledParam = utils.parseCsv.mock.calls[0][0]; // 0,0 is the first param of the first call
        expect(parseCsvCalledParam.length).toBe(2); // row for header and row for content
        expect(parseCsvCalledParam[0].length).toBe(1); // 0 is the first row
        expect(parseCsvCalledParam[0][0]).toBe('header'); // 0,0 is the first column of thee first row
        expect(utils.download).toHaveBeenCalledWith(expect.any(String), "Correct");
    });

    it('excludes headers when instructed to', () => {
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
            false
        );

        const parseCsvCalledParam = utils.parseCsv.mock.calls[0][0]; // 0,0 is the first param of the first call
        expect(parseCsvCalledParam.length).toBe(1); // just row for content
        expect(utils.download).toHaveBeenCalledWith(expect.any(String), "Correct");
    });
});
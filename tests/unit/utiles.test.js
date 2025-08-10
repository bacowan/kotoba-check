const { getMaxCount } = require("../../src/visualizer/utils");


describe('getMaxCount', () => {
    it('returns the max count in the array', () => {
        const words = [
            { word: 'word1', count: 2 },
            { word: 'word2', count: 5 },
            { word: 'word3', count: 3 }
        ];
        const maxCount = getMaxCount(words);
        expect(maxCount).toBe(5);
    });

    it('returns 0 for an empty array', () => {
        const words = [];
        const maxCount = getMaxCount(words);
        expect(maxCount).toBe(0);
    });
})
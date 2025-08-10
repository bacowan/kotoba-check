const { getMaxCount, reverseBinarySearch } = require("../../src/visualizer/utils");

describe('utils', () => {
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
    });

    describe('reverseBinarySearch', () => {
        it('returns the index of the item if it exists', () => {
            const arr = [8, 6, 4, 1];
            const index = reverseBinarySearch(arr, 6);
            expect(index).toBe(1);
        });

        it('returns the index of the item that would be to its right if it does not exist', () => {
            const arr = [8, 6, 4, 1];
            const index = reverseBinarySearch(arr, 3);
            expect(index).toBe(3);
        });
    });
});
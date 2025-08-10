const { CardState } = require("../../src/common/enums");
const { VisualizerController } = require("../../src/visualizer/visualizerController");
const { createWord } = require("./testUtils");

describe('VisualizerController', () => {
    beforeAll(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should sort words by CardState', () => {
            const words = [
                createWord('inDeck', CardState.InDeck),
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);

            expect(visualizerController.deckWords.length).toBe(1);
            expect(visualizerController.deckWords[0].word).toBe('inDeck');
            expect(visualizerController.hiddenWords.length).toBe(1);
            expect(visualizerController.hiddenWords[0].word).toBe('hidden');
            expect(visualizerController.newWords.length).toBe(1);
            expect(visualizerController.newWords[0].word).toBe('new');
        });
    });

    describe('moveWord', () => {
        it('should remove a word from one list and add it to the other', async () => {
            const words = [
                createWord('inDeck', CardState.InDeck),
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);
            await visualizerController.moveWord('inDeck', CardState.New);

            expect(visualizerController.deckWords.length).toBe(0);
            expect(visualizerController.newWords.length).toBe(2);
            expect(visualizerController.newWords.map(w => w.word)).toContain('new');
            expect(visualizerController.newWords.map(w => w.word)).toContain('inDeck');
        });

        it('should sort the new word by count in reverse order', async () => {
            const words = [
                createWord('inDeck', CardState.InDeck, 2),
                createWord('new', CardState.New, 1),
                createWord('hidden', CardState.New, 3)
            ];
            
            const visualizerController = new VisualizerController(words);
            await visualizerController.moveWord('inDeck', CardState.New);

            expect(visualizerController.newWords.length).toBe(3);
            expect(visualizerController.newWords[2].word).toBe('new');
            expect(visualizerController.newWords[1].word).toBe('inDeck');
            expect(visualizerController.newWords[0].word).toBe('hidden');
        });

        it('should call chrome.storage.local.set with the updated word', async () => {
            const storageLocalGet = jest.spyOn(chrome.storage.local, 'set');

            const inDeckWord = createWord('inDeck', CardState.InDeck);
            const words = [
                inDeckWord,
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);
            await visualizerController.moveWord('inDeck', CardState.New);

            expect(storageLocalGet).toHaveBeenCalled();
            expect(storageLocalGet).toHaveBeenCalledWith({ 'word_inDeck': inDeckWord });
        });

    });
});
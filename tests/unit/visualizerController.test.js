jest.mock('../../jmdict/jmdict.json', () => ({"test": { definitions: ["def"], readings: ["read"] }}));

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

            expect(storageLocalGet).toHaveBeenCalledWith({ 'word_inDeck': inDeckWord });
        });

        it('deckWordsUpdatedEvent triggered when moving from deck words', async () => {
            const words = [
                createWord('inDeck', CardState.InDeck),
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);

            let eventCalled = false;
            visualizerController.deckWordsUpdatedEvent.subscribe(() => {
                eventCalled = true;
            });

            await visualizerController.moveWord('inDeck', CardState.New);

            expect(eventCalled).toBe(true);
        });

        it('newWordsUpdatedEvent triggered when moving from new words', async () => {
            const words = [
                createWord('inDeck', CardState.InDeck),
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);

            let eventCalled = false;
            visualizerController.newWordsUpdatedEvent.subscribe(() => {
                eventCalled = true;
            });

            await visualizerController.moveWord('new', CardState.InDeck);

            expect(eventCalled).toBe(true);
        });

        it('hiddenWordsUpdatedEvent triggered when moving from hidden words', async () => {
            const words = [
                createWord('inDeck', CardState.InDeck),
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);

            let eventCalled = false;
            visualizerController.hiddenWordsUpdatedEvent.subscribe(() => {
                eventCalled = true;
            });

            await visualizerController.moveWord('hidden', CardState.New);

            expect(eventCalled).toBe(true);
        });

        it('deckWordsUpdatedEvent triggered when moving to deck words', async () => {
            const words = [
                createWord('inDeck', CardState.InDeck),
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);

            let eventCalled = false;
            visualizerController.deckWordsUpdatedEvent.subscribe(() => {
                eventCalled = true;
            });

            await visualizerController.moveWord('new', CardState.InDeck);

            expect(eventCalled).toBe(true);
        });

        it('newWordsUpdatedEvent triggered when moving to new words', async () => {
            const words = [
                createWord('inDeck', CardState.InDeck),
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);

            let eventCalled = false;
            visualizerController.newWordsUpdatedEvent.subscribe(() => {
                eventCalled = true;
            });

            await visualizerController.moveWord('inDeck', CardState.New);

            expect(eventCalled).toBe(true);
        });

        it('hiddenWordsUpdatedEvent triggered when moving to hidden words', async () => {
            const words = [
                createWord('inDeck', CardState.InDeck),
                createWord('new', CardState.New),
                createWord('hidden', CardState.Hidden)
            ];
            
            const visualizerController = new VisualizerController(words);

            let eventCalled = false;
            visualizerController.hiddenWordsUpdatedEvent.subscribe(() => {
                eventCalled = true;
            });

            await visualizerController.moveWord('new', CardState.Hidden);

            expect(eventCalled).toBe(true);
        });
    });

    describe('getDictEntry', () => {
        it('should return a word in the dictionary if it exists', () => {
            const visualizerController = new VisualizerController([]);
            const result = visualizerController.getDictEntry("test");
            expect(result).toEqual({
                definitions: ["def"],
                readings: ["read"]
            });
        });

        it('should return a blank entry if the entry does not exist', () => {
            const visualizerController = new VisualizerController([]);
            const result = visualizerController.getDictEntry("nope");
            expect(result).toEqual({
                definitions: [],
                readings: []
            });
        });
    });
});
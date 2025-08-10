const { CardState } = require("../../src/common/enums");
const { VisualizerController } = require("../../src/visualizer/visualizerController");
const { createWord } = require("./testUtils");

describe('VisualizerController', () => {
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
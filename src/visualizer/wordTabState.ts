import { WordInfo } from "./types";

export const wordTabState = {
    newWords: {} as { [key: string]: WordInfo},
    deckWords: {} as { [key: string]: WordInfo},
    excludedWords: {} as { [key: string]: WordInfo},
    setNewWords: function(words: { [key: string]: WordInfo}) {
        this.newWords = words;
    },
    setDeckWords: function(words: { [key: string]: WordInfo}) {
        this.deckWords = words;
    },
    setExcludedWords: function(words: { [key: string]: WordInfo}) {
        this.excludedWords = words;
    },
    moveWord: function(word: string, fromTab: 'new' | 'deck' | 'excluded', toTab: 'new' | 'deck' | 'excluded') {
        let source: { [key: string]: WordInfo };;
        let sink: { [key: string]: WordInfo };
        switch (fromTab) {
            case 'new':
                source = this.newWords;
                break;
            case 'deck':
                source = this.deckWords;
                break;
            case 'excluded':
                source = this.excludedWords;
                break;
            default:
                throw new Error(`Unknown source tab: ${fromTab}`);
        }
        switch (toTab) {
            case 'new':
                sink = this.newWords;
                break;
            case 'deck':
                sink = this.deckWords;
                break;
            case 'excluded':
                sink = this.excludedWords;
                break;
            default:
                throw new Error(`Unknown source tab: ${fromTab}`);
        }
        sink[word] = source[word];
        delete source[word];
    }
}
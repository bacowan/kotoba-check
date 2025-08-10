import { CardState } from "../common/enums";
import { DefaultIncludedColumnExporters } from "./columnExporters";
import { ExportSettings, JmdictEntry, WordInfo } from "./types";
import { reverseBinarySearch, getMaxCount } from "./utils";
import * as jmdict from "../../jmdict/jmdict.json";
import { Event } from "../common/event";

const jmdictJson = jmdict as { [key: string]: JmdictEntry | undefined };

export enum VisualizerControllerEventTypes {
    UpdateDeckWords,
    UpdateHiddenWords,
    UpdateNewWords
}

export class VisualizerController {
    allWords: {[word: string]: WordInfo}
    deckWords: WordInfo[];
    hiddenWords: WordInfo[];
    newWords: WordInfo[];
    exportSettings: ExportSettings;
    maxCount: number;

    wordMovedToNewEvent: Event<[]> = new Event();
    wordMovedToHiddenEvent: Event<[]> = new Event();
    wordMovedToDeckEvent: Event<[]> = new Event();

    constructor(allWords: WordInfo[], exportSettings: ExportSettings | undefined) {
        this.allWords = allWords.reduce((prev, curr) => {
            prev[curr.word] = curr;
            return prev;
        }, {} as {[word: string]: WordInfo});

        this.deckWords = allWords.filter(word => word.state === CardState.InDeck);
        this.hiddenWords = allWords.filter(word => word.state === CardState.Hidden);
        this.newWords = allWords.filter(word => word.state === CardState.New);

        this.deckWords.sort((a, b) => b.count - a.count);
        this.hiddenWords.sort((a, b) => b.count - a.count);
        this.newWords.sort((a, b) => b.count - a.count);

        if (!exportSettings) {
            exportSettings = {
                shouldIncludeHeaders: true,
                includedExporters: DefaultIncludedColumnExporters
            }
        }
        this.exportSettings = exportSettings;
        this.maxCount = getMaxCount(allWords);
    }

    async moveWord(word: string, newState: CardState): Promise<void> {
        const wordInfo = this.allWords[word];

        // remove the word from the previous list
        let source: WordInfo[] | null = null;
        let removeEvent: Event<[]> | null = null;
        if (wordInfo) {
            switch (wordInfo.state) {
            case CardState.New:
                source = this.newWords;
                removeEvent = this.wordMovedToNewEvent;
                break;
            case CardState.InDeck:
                source = this.deckWords;
                removeEvent = this.wordMovedToDeckEvent;
                break;
            case CardState.Hidden:
                source = this.hiddenWords;
                removeEvent = this.wordMovedToHiddenEvent;
                break;
            default:
                break;
            }
        }
        if (source && removeEvent !== null) {
            source.splice(source.findIndex(x => x.word === word), 1);
            removeEvent.trigger();
        }

        // add it to the new one
        let sink: WordInfo[] | null = null;
        let addEvent: Event<[]> | null = null;
        switch (newState) {
            case CardState.New:
                sink = this.newWords;
                addEvent = this.wordMovedToNewEvent;
                break;
            case CardState.InDeck:
                sink = this.deckWords;
                addEvent = this.wordMovedToDeckEvent;
                break;
            case CardState.Hidden:
                sink = this.hiddenWords;
                addEvent = this.wordMovedToHiddenEvent;
                break;
            default:
                break;
        }
        if (sink && addEvent !== null) {
            wordInfo.state = newState;
            const wordKey = `word_${word}`;
            await chrome.storage.local.set(
                { [wordKey]: wordInfo }
            );
            // add it sorted
            const newIndex = reverseBinarySearch(sink.map(s => s.count), wordInfo.count);
            sink.splice(newIndex, 0, wordInfo);
            addEvent.trigger();
        }
    }

    getDictEntry(word: string): JmdictEntry {
        let entry = jmdictJson[word];
        if (!entry) {
            entry = {
                definitions: [],
                readings: []
            }
        }
        return entry;
    }
}
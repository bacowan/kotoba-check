import { CardState } from "../common/enums";
import { DefaultIncludedColumnExporters } from "./columnExporters";
import { ExportSettings, JmdictEntry, WordInfo } from "./types";
import { reverseBinarySearch, getMaxCount } from "./utils";
import * as jmdict from "../../jmdict/jmdict.json";

const jmdictJson = jmdict as { [key: string]: JmdictEntry | undefined };

export enum VisualizerControllerEventTypes {
    UpdateDeckWords,
    UpdateHiddenWords,
    UpdateListedWords
}

export class VisualizerController {
    allWords: {[word: string]: WordInfo}
    deckWords: WordInfo[];
    hiddenWords: WordInfo[];
    listedWords: WordInfo[];
    exportSettings: ExportSettings;
    maxCount: number;

    wordMovedToListedSubscribers: (() => void)[] = [];
    wordMovedToHiddenSubscribers: (() => void)[] = [];
    wordMovedToDeckSubscribers: (() => void)[] = [];

    constructor(allWords: WordInfo[], exportSettings: ExportSettings | undefined) {
        this.allWords = allWords.reduce((prev, curr) => {
            prev[curr.word] = curr;
            return prev;
        }, {} as {[word: string]: WordInfo});

        this.deckWords = allWords.filter(word => word.state === CardState.InDeck);
        this.hiddenWords = allWords.filter(word => word.state === CardState.Hidden);
        this.listedWords = allWords.filter(word => word.state === CardState.Listed);

        this.deckWords.sort((a, b) => b.count - a.count);
        this.hiddenWords.sort((a, b) => b.count - a.count);
        this.listedWords.sort((a, b) => b.count - a.count);

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
        let removeEvent: VisualizerControllerEventTypes | null = null;
        if (wordInfo) {
            switch (wordInfo.state) {
            case CardState.Listed:
                source = this.listedWords;
                removeEvent = VisualizerControllerEventTypes.UpdateListedWords;
                break;
            case CardState.InDeck:
                source = this.deckWords;
                removeEvent = VisualizerControllerEventTypes.UpdateDeckWords;
                break;
            case CardState.Hidden:
                source = this.hiddenWords;
                removeEvent = VisualizerControllerEventTypes.UpdateHiddenWords;
                break;
            default:
                break;
            }
        }
        if (source && removeEvent !== null) {
            source.splice(source.findIndex(x => x.word === word), 1);
            this.emit(removeEvent);
        }

        // add it to the new one
        let sink: WordInfo[] | null = null;
        let addEvent: VisualizerControllerEventTypes | null = null;
        switch (newState) {
            case CardState.Listed:
                sink = this.listedWords;
                addEvent = VisualizerControllerEventTypes.UpdateListedWords;
                break;
            case CardState.InDeck:
                sink = this.deckWords;
                addEvent = VisualizerControllerEventTypes.UpdateDeckWords;
                break;
            case CardState.Hidden:
                sink = this.hiddenWords;
                addEvent = VisualizerControllerEventTypes.UpdateHiddenWords;
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
            const newIndex = reverseBinarySearch(sink.map(s => s.count), wordInfo.count);
            sink.splice(newIndex, 0, wordInfo);
            this.emit(addEvent);
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

    on(event: VisualizerControllerEventTypes, callback: () => void): void {
        switch (event) {
            case VisualizerControllerEventTypes.UpdateDeckWords:
                this.wordMovedToDeckSubscribers.push(callback);
            case VisualizerControllerEventTypes.UpdateHiddenWords:
                this.wordMovedToHiddenSubscribers.push(callback);
            case VisualizerControllerEventTypes.UpdateListedWords:
                this.wordMovedToListedSubscribers.push(callback);
            default:
                return;
        }
    }

    emit(event: VisualizerControllerEventTypes): void {
        let subscribers: (() => void)[];
        switch (event) {
            case VisualizerControllerEventTypes.UpdateDeckWords:
                subscribers = this.wordMovedToDeckSubscribers;
                break;
            case VisualizerControllerEventTypes.UpdateHiddenWords:
                subscribers = this.wordMovedToHiddenSubscribers;
                break;
            case VisualizerControllerEventTypes.UpdateListedWords:
                subscribers = this.wordMovedToListedSubscribers;
                break;
            default:
                return;
        }

        for (const sub of subscribers) {
            sub();
        }
    }
}
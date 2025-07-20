import { CardState } from "../common/enums";

export interface JmdictEntry {
    definitions: string[];
    readings: string[];
};

export interface ColumnExporter {
    localStorageKey: string,
    includeByDefault: boolean;
    header: string;
    export: (word: WordInfo) => string;
}

export interface WordInfo {
    word: string;
    count: number;
    state: CardState;
    reading: string;
}

export interface ExportSettings {
    includedExporters: string[],
    shouldIncludeHeaders: boolean
}
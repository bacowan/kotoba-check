import { CardState } from "../common/enums";

export interface JmdictEntry {
    definitions: string[];
    readings: string[];
};

export interface ColumnExporter {
    includeByDefault: boolean;
    header: string;
    export: (word: string) => string;
}

export interface WordInfo {
    word: string;
    count: number;
    state: CardState;
    reading: string;
}
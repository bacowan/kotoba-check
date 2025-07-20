import { ColumnExporter, WordInfo } from "./types";

export const WordColumnExporter: ColumnExporter = {
    localStorageKey: "word",
    includeByDefault: true,
    header: "Word",
    export: (word: WordInfo) => word.word
}

export const AllColumnExporters = [WordColumnExporter];
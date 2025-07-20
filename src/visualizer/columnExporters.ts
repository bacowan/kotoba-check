import { ColumnExporter, JmdictEntry, WordInfo } from "./types";
import * as jmdict from "../../jmdict/jmdict.json";
const jmdictJson = jmdict as { [key: string]: JmdictEntry | undefined };

export const WordColumnExporter: ColumnExporter = {
    localStorageKey: "word",
    header: "Word",
    export: (word: WordInfo) => word.word
}

export const PronounciationColumnExporter: ColumnExporter = {
    localStorageKey: "pron",
    header: "Pronounciation",
    export: (word: WordInfo) => jmdictJson[word.word]?.readings[0] ?? ""
}

export const DefinitionColumnExporter: ColumnExporter = {
    localStorageKey: "def",
    header: "Definition",
    export: (word: WordInfo) => jmdictJson[word.word]?.definitions[0] ?? ""
}

export const FrequencyColumnExporter: ColumnExporter = {
    localStorageKey: "freq",
    header: "Frequency",
    export: (word: WordInfo) => word.count.toString()
}

export const IdColumnExporter: ColumnExporter = {
    localStorageKey: "id",
    header: "ID",
    export: (word: WordInfo) => word.kuromojiId.toString()
}

export const AllColumnExporters = [
    WordColumnExporter,
    PronounciationColumnExporter,
    DefinitionColumnExporter,
    FrequencyColumnExporter,
    IdColumnExporter];
export const DefaultIncludedColumnExporters = [
    WordColumnExporter.localStorageKey,
    PronounciationColumnExporter.localStorageKey,
    DefinitionColumnExporter.localStorageKey]
export interface JmdictEntry {
    definitions: string[];
    readings: string[];
};

export interface ColumnExporter {
    includeByDefault: boolean;
    header: string;
    export: (word: string) => string;
}
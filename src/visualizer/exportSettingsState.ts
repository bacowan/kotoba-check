import { ColumnExporter } from "./types";

export const ExportSettingsState = {
    shouldIncludeHeader: false,
    includedColumns: [] as ColumnExporter[],
    excludedColumns: [] as ColumnExporter[],
    includeColumn: function(key: string, index: number) {
        const excludedIndex = this.excludedColumns.findIndex(c => c.localStorageKey === key);
        if (excludedIndex >= 0) {
            this.includedColumns.splice(index, 0, this.excludedColumns[excludedIndex]);
            this.excludedColumns.splice(excludedIndex, 1);
        }
    },
    excludeColumn: function(key: string, index: number) {
        const includedIndex = this.includedColumns.findIndex(c => c.localStorageKey === key);
        if (includedIndex >= 0) {
            this.excludedColumns.splice(index, 0, this.includedColumns[includedIndex]);
            this.includedColumns.splice(includedIndex, 1);
        }
    }
}
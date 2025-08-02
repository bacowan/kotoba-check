import { ColumnExporter, WordInfo } from "./types";
import { download, parseCsv } from "./utils";


export const exportDeck = (columnExporters: ColumnExporter[], deckWords: WordInfo[], shouldIncludeHeaders: boolean) => {
    const exportData: string[][] = [];
    if (shouldIncludeHeaders) {
        const newRow = [];
        for (const exporter of columnExporters) {
            newRow.push(exporter.header);
        }
        exportData.push(newRow);
    }
    
    for (const word of deckWords) {
        const newRow: string[] = [];
        for (const exporter of columnExporters) {
            newRow.push(exporter.export(word));
        }
        exportData.push(newRow);
    }

    const csv = parseCsv(exportData);
    download("deck.csv", csv);
}
import { ColumnExporter, WordInfo } from "./types";
import { download, parseCsv } from "./utils";


export const exportDeck = (columnExporters: ColumnExporter[], deckWords: WordInfo[]) => {
    const includedColumns = document.getElementById("included-columns");
    const deckTable = document.getElementById("deck-list");
    if (includedColumns && deckTable) {
        const exportData: string[][] = [];
        
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
}
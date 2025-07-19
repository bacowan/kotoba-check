import { ColumnExporter } from "./types";

export const WordColumnExporter: ColumnExporter = {
    includeByDefault: true,
    header: "Word",
    export: (word: string) => word
}
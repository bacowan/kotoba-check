export const parseCsv = (values: string[][]): string => {
    let ret = "";
    for (const row of values) {
        ret += row.map(value => `"${value.replace(/"/g, '""')}"`).join(",") + "\n";
    }
    return ret;
}
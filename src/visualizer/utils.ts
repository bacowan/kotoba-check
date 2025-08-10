import { WordInfo } from "./types";

export const getMaxCount = (allWords: WordInfo[]): number => {
    return allWords.reduce((max, word) => {
        const count = word.count;
        return Math.max(max, count);
    }, 0);
}


// Get the element in the container that is is expected to appear before the given screen Y coordinate
export const getDragAfterElement = (container: Element, y: number): Element | null => {
    const items = Array.from(container.querySelectorAll('.column-item:not(.dragging)'));

    return items.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY, element: null as Element | null }).element;
}

export const download = (filename: string, text: string) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export const parseCsv = (values: string[][]): string => {
    let ret = "";
    for (const row of values) {
        ret += row.map(value => `"${value.replace(/"/g, '""')}"`).join(",") + "\n";
    }
    return ret;
}

export const reverseBinarySearch = (arr: Array<number>, target: number) => {
    let left = 0;          // inclusive
    let right = arr.length; // exclusive

    while (left < right) {
        const mid = (left + right) >>> 1; // unsigned right‑shift = floor((l+r)/2)

        // For descending order, the “smaller” side is to the RIGHT.
        if (arr[mid] > target) {
            left = mid + 1;    // search the right half
        } else {
            right = mid;       // search the left half (value fits here or before)
        }
    }
    return left;           // insertion point
}

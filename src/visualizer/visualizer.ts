import { CardState } from "../common/enums";
import { parseCsv } from "./csv";
import { download } from "./download";
import { hideSvg, plusSvg } from "./svg";
import * as jmdict from "../../jmdict/jmdict.json";
import { ColumnExporter, JmdictEntry } from "./types";
import { WordColumnExporter } from "./columnExporters";

const jmdictJson = jmdict as { [key: string]: JmdictEntry | undefined };

interface WordInfo {
    word: string;
    count: number;
    state: CardState;
    reading: string;
}

const wordListElement = document.getElementById('word-list');
const deckListElement = document.getElementById('deck-list');

const getMaxCount = (allWords: WordInfo[]): number => {
    return allWords.reduce((max, word) => {
            const count = word.count;
            return Math.max(max, count);
        }, 0);
}

const getWordsOfState = (allData: { [key: string]: any }, state: CardState): {
    word: string;
    count: any;
}[] => {
    return Object.keys(allData)
        // exclude url data
        .filter(key => key.startsWith('word_'))
        // only include words that are in the listed state
        .filter(key => allData[key].state === state)
        // remove the prefix and attach the value
        .map(key => ({ word: key.slice(5), count: allData[key].count }))
        // sort by count
        .sort((a, b) => b.count - a.count);
}

const setupListedTab = async (allWords: WordInfo[]) => {
    if (!wordListElement) {
        console.error('Word list element not found');
        return;
    }

    const listedWords = allWords.filter(word => word.state === CardState.Listed);

    const maxCount = getMaxCount(allWords);

    for (const { word, count } of listedWords) {
        const dictEntry = jmdictJson[word];
        const reading = dictEntry && dictEntry.readings.length > 0 ? dictEntry.readings[0] : "";
        const definition = dictEntry && dictEntry.definitions.length > 0 ? dictEntry.definitions[0] : "";

        const row = document.createElement('tr');

        const wordCell = document.createElement('td');
        wordCell.textContent = word;
        row.appendChild(wordCell);

        const readingCell = document.createElement('td');
        readingCell.textContent = reading;
        row.appendChild(readingCell);

        const definitionCell = document.createElement('td');
        definitionCell.textContent = definition;
        row.appendChild(definitionCell);

        const barCell = document.createElement('td');
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.title = count.toString();
        const barElement = document.createElement('div');
        barElement.className = 'bar';
        barElement.style.width = `${count / maxCount * 100}%`;
        barContainer.appendChild(barElement);
        barCell.appendChild(barContainer);
        row.appendChild(barCell);

        const removeCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.innerHTML = hideSvg;
        removeButton.className = 'remove-button';
        removeButton.onclick = async () => {
            await setWordState(word, count, CardState.Removed);
            row.remove();
        }
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        const addCell = document.createElement('td');
        const addButton = document.createElement('button');
        addButton.innerHTML = plusSvg;
        addButton.className = 'add-button';
        addButton.onclick = async () => {
            await setWordState(word, count, CardState.InDeck);
            addWordToDeckDialog(word, count, maxCount);
            row.remove();
        }
        addCell.appendChild(addButton);
        row.appendChild(addCell);

        wordListElement.appendChild(row);
    }
};

// Set the state of a word card. This will update the local storage,
// but will not remove it from the UI.
const setWordState = async (word: string, count: number, state: CardState) => {
    const wordKey = `word_${word}`;
    // reload the word to make sure it's up to date
    const freshWords = await chrome.storage.local.get([wordKey]);
    let freshWord = freshWords[wordKey];
    if (!freshWord) {
        freshWord = {
            count: count,
            state: state
        };
    }
    else {
        freshWord.state = state;
    }

    await chrome.storage.local.set(
        { [wordKey]: freshWord }
    );
}

const addWordToDeckDialog = (word: string, count: number, maxCount: number) => {
    const dictEntry = jmdictJson[word];
    const reading = dictEntry && dictEntry.readings.length > 0 ? dictEntry.readings[0] : "";
    const definition = dictEntry && dictEntry.definitions.length > 0 ? dictEntry.definitions[0] : "";

    const row = document.createElement('tr');

    const wordCell = document.createElement('td');
    wordCell.textContent = word;
    row.appendChild(wordCell);

    const readingCell = document.createElement('td');
    readingCell.textContent = reading;
    row.appendChild(readingCell);

    const definitionCell = document.createElement('td');
    definitionCell.textContent = definition;
    row.appendChild(definitionCell);

    const barCell = document.createElement('td');
    const barContainer = document.createElement('div');
    barContainer.className = 'bar-container';
    barContainer.title = count.toString();
    const barElement = document.createElement('div');
    barElement.className = 'bar';
    barElement.style.width = `${count / maxCount * 100}%`;
    barContainer.appendChild(barElement);
    barCell.appendChild(barContainer);
    row.appendChild(barCell);

    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.textContent = '－';
    removeButton.className = 'remove-button';
    removeButton.onclick = async () => {
        // todo
    }
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);

    deckListElement?.appendChild(row);
}

const setupDeckTab = (allWords: WordInfo[]) => {

    // list of words
    if (!deckListElement) {
        console.error('Word list element not found');
        return;
    }
    const deckWords = allWords.filter(word => word.state === CardState.InDeck);

    const maxCount = getMaxCount(allWords);
    for (const { word, count } of deckWords) {
        addWordToDeckDialog(word, count, maxCount);
    }
}

const setupTabs = () => {
    const newWordsTab = document.getElementById('new-words-tab');
    const deckTab = document.getElementById('deck-tab');
    const newWordsTable = document.getElementById('new-words-table');
    const deckTable = document.getElementById('deck-table');

    if (newWordsTab && deckTab && newWordsTable && deckTable) {
        newWordsTab.onclick = () => {
            newWordsTab.classList.add('selected');
            deckTab.classList.remove('selected');
            newWordsTable.classList.remove('hidden');
            deckTable.classList.add('hidden');
        };

        deckTab.onclick = () => {
            deckTab.classList.add('selected');
            newWordsTab?.classList.remove('selected');
            newWordsTable.classList.add('hidden');
            deckTable.classList.remove('hidden');
        };
    }
}

const setupExportDialog = (allWords: WordInfo[]) => {
    const exportButton = document.getElementById('export-deck-button');
    const dialog = document.getElementById('export-dialog') as HTMLDialogElement;
    if (exportButton) {
        exportButton.onclick = async () => {
            dialog.showModal();
        };
    }

    // setup column options

    // close the dialog when clicking outside of it
    dialog.addEventListener('click', (event) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;

        if (!isInDialog) {
            dialog.close();
        }
    });

    // Setup buttons
    const cancelButton = document.getElementById('export-cancel-button');
    if (cancelButton) {
        cancelButton.onclick = () => {
            dialog.close();
        }
    }
    const finalizeButton = document.getElementById('export-finalize-button');
    if (finalizeButton) {
        finalizeButton.onclick = async () => {
            exportDeck();
            dialog.close();
        }
    }

    // Setup drag/drop
    const columnLists = Array.from(document.getElementsByClassName('column-list'));
    let draggedItem: HTMLElement | null = null;
    for (const columnList of columnLists) {
        columnList.addEventListener('dragstart', (event) => {
            if (event.target instanceof HTMLElement && event.target.classList.contains('column-item')) {
                draggedItem = event.target;
            }
        });

        columnList.addEventListener('dragend', (event) => {
            if (event.target instanceof HTMLElement && event.target.classList.contains('column-item')) {
                draggedItem = null;
            }
        });

        columnList.addEventListener('dragover', (event) => {
            event.preventDefault();
            if (draggedItem && event instanceof DragEvent) {
                const afterElement = getDragAfterElement(columnList, event.clientY);
                if (afterElement == null) {
                    columnList.appendChild(draggedItem);
                } else {
                    columnList.insertBefore(draggedItem, afterElement);
                }
            }
        });

        columnList.addEventListener('drop', (event) => {
            // drop is handled by dragover + insert logic above
            event.preventDefault();
        });
    }
}

// Get the element in the container that is is expected to appear before the given screen Y coordinate
function getDragAfterElement(container: Element, y: number): Element | null {
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

// Functions to get csv cells for words, keyed on the id of the column element in the export dialog
const columnExporters = new Map<string, ColumnExporter>([
    ["word-export-column", WordColumnExporter],
]);

function exportDeck() {
    const includedColumns = document.getElementById("included-columns");
    const deckTable = document.getElementById("deck-list");
    if (includedColumns && deckTable) {

        const deckWords = Array.from(deckTable.getElementsByTagName("tr"))
            .map(row => row.firstChild?.textContent)
            .filter(word => word !== undefined) as string[];

        const exporters = Array.from(includedColumns.getElementsByTagName("li"))
            .map(col => columnExporters.get(col.id));

        const exportData: string[][] = [];
        
        for (const word of deckWords) {
            const newRow: string[] = [];
            for (const exporter of exporters) {
                if (exporter) {
                    newRow.push(exporter.export(word));
                }
            }
            exportData.push(newRow);
        }

        const csv = parseCsv(exportData);
        download("deck.csv", csv);
    }
}

// retrieve all data that was stored by the content script
chrome.storage.local.get(null).then((allData) => {
    const words: WordInfo[] = Object.keys(allData)
        // exclude url data
        .filter(key => key.startsWith('word_'))
        // remove the prefix and attach the value
        .map(key => ({
            word: key.slice(5),
            count: allData[key].count,
            state: allData[key].state,
            reading: allData[key].reading }))
        // sort by count
        .sort((a, b) => b.count - a.count);


    setupTabs();
    setupListedTab(words);
    setupDeckTab(words);
    setupExportDialog(words);
});
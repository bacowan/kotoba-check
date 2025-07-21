import { CardState } from "../common/enums";
import { hideSvg, plusSvg, showSvg } from "./svg";
import { ColumnExporter, ExportSettings, WordInfo } from "./types";
import { AllColumnExporters, DefaultIncludedColumnExporters } from "./columnExporters";
import { getDragAfterElement } from "./utils";
import { exportDeck } from "./export";
import { VisualizerController, VisualizerControllerEventTypes } from "./visualizerController";

const wordListElement = document.getElementById('word-list');
const deckListElement = document.getElementById('deck-list');
const hiddenListElement = document.getElementById('hidden-list');
const mainElement = document.getElementById('main');

// initialize page sizes to 1 so that one element will always render
let wordListPageSize = 1;
let deckListPageSize = 1;
let hiddenListPageSize = 1;

let currentWordListPage = 0;
let currentDeckListPage = 0;
let currentHiddenListPage = 0;

let controller: VisualizerController;

// Setup functions
const setupListedTabWords = async () => {

    // initial page is 0. This adds the elements to the page as well.
    setListedPage(0);

    // subscribe for updates
    controller.on(VisualizerControllerEventTypes.UpdateListedWords, () => {
        setListedPage(currentDeckListPage);
    });

    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        console.log(entries);
        if (wordListElement && wordListElement.children.length > 0) {
            const pageSize = getTablePageSize(wordListElement);
            //if (wordListPageSize !== pageSize) {
                wordListPageSize = pageSize;
                setListedPage(currentDeckListPage);
            //}
        }
    });

    if (wordListElement && mainElement) {
        resizeObserver.observe(mainElement);
        // set the initial page size
        wordListPageSize = getTablePageSize(wordListElement);
        console.log(wordListPageSize)
        setListedPage(0);
    }
};

const setListedPage = (pageNumber: number) => {
    const firstElementIndex = pageNumber * wordListPageSize;
    const lastElementIndex = (pageNumber + 1) * wordListPageSize;
    
    wordListElement?.replaceChildren();
    for (const { word, count } of controller.listedWords.slice(firstElementIndex, lastElementIndex)) {
        addWordToListed(word, count);
    }

    currentDeckListPage = pageNumber;
}

const setupDeckTabWords = () => {
    // Add the words to the UI
    for (const { word, count } of controller.deckWords) {
        addWordToDeck(word, count);
    }

    // subscribe for updates
    controller.on(VisualizerControllerEventTypes.UpdateDeckWords, () => {
        deckListElement?.replaceChildren();
        for (const { word, count } of controller.deckWords) {
            addWordToDeck(word, count);
        }
    });
}

const setupHiddenTabWords = () => {
    // Add the words to the UI
    for (const { word, count } of controller.hiddenWords) {
        addWordToHidden(word, count);
    }

    // subscribe for updates
    controller.on(VisualizerControllerEventTypes.UpdateHiddenWords, () => {
        hiddenListElement?.replaceChildren();
        for (const { word, count } of controller.hiddenWords) {
            addWordToHidden(word, count);
        }
    });
}

const addWordToListed = (word: string, count: number) => {
    const jmdictEntry = controller.getDictEntry(word);
    const reading = jmdictEntry.readings.length > 0 ? jmdictEntry.readings[0] : "";
    const definition = jmdictEntry.definitions.length > 0 ? jmdictEntry.definitions[0] : "";

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
    barElement.style.width = `${count / controller.maxCount * 100}%`;
    barContainer.appendChild(barElement);
    barCell.appendChild(barContainer);
    row.appendChild(barCell);

    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.innerHTML = hideSvg;
    removeButton.className = 'remove-button';
    removeButton.onclick = async () => await controller.moveWord(word, CardState.Hidden);
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);

    const addCell = document.createElement('td');
    const addButton = document.createElement('button');
    addButton.innerHTML = plusSvg;
    addButton.className = 'add-button';
    addButton.onclick = async () => await controller.moveWord(word, CardState.InDeck);
    addCell.appendChild(addButton);
    row.appendChild(addCell);

    wordListElement?.appendChild(row);
}

// Add a singluar word to the deck UI
const addWordToDeck = (word: string, count: number) => {
    const jmdictEntry = controller.getDictEntry(word);
    const reading = jmdictEntry.readings.length > 0 ? jmdictEntry.readings[0] : "";
    const definition = jmdictEntry.definitions.length > 0 ? jmdictEntry.definitions[0] : "";

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
    barElement.style.width = `${count / controller.maxCount * 100}%`;
    barContainer.appendChild(barElement);
    barCell.appendChild(barContainer);
    row.appendChild(barCell);

    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.textContent = '－';
    removeButton.className = 'remove-button';
    removeButton.onclick = async () => await controller.moveWord(word, CardState.Listed);
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);

    deckListElement?.appendChild(row);
}

const addWordToHidden = (word: string, count: number,) => {
    const jmdictEntry = controller.getDictEntry(word);
    const reading = jmdictEntry.readings.length > 0 ? jmdictEntry.readings[0] : "";
    const definition = jmdictEntry.definitions.length > 0 ? jmdictEntry.definitions[0] : "";

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
    barElement.style.width = `${count / controller.maxCount * 100}%`;
    barContainer.appendChild(barElement);
    barCell.appendChild(barContainer);
    row.appendChild(barCell);

    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.innerHTML = showSvg;
    removeButton.className = 'show-button';
    removeButton.onclick = async () => await controller.moveWord(word, CardState.Listed);
    removeCell.appendChild(removeButton);
    row.appendChild(removeCell);

    hiddenListElement?.appendChild(row);
}

// setup the click handlers for the tab headers
const setupTabs = () => {
    const newWordsTab = document.getElementById('new-words-tab');
    const deckTab = document.getElementById('deck-tab');
    const hiddenTab = document.getElementById('hidden-tab');
    const newWordsTable = document.getElementById('new-words-table');
    const deckTable = document.getElementById('deck-table');
    const hiddenTable = document.getElementById('hidden-table');

    if (newWordsTab && deckTab && hiddenTab && newWordsTable && deckTable && hiddenTable) {
        newWordsTab.onclick = () => {
            newWordsTab.classList.add('selected');
            deckTab.classList.remove('selected');
            hiddenTab.classList.remove('selected');
            newWordsTable.classList.remove('hidden');
            deckTable.classList.add('hidden');
            hiddenTable.classList.add('hidden');
        };

        deckTab.onclick = () => {
            deckTab.classList.add('selected');
            newWordsTab.classList.remove('selected');
            hiddenTab.classList.remove('selected');
            newWordsTable.classList.add('hidden');
            deckTable.classList.remove('hidden');
            hiddenTable.classList.add('hidden');
        };

        hiddenTab.onclick = () => {
            hiddenTab.classList.add('selected');
            deckTab.classList.remove('selected');
            newWordsTab.classList.remove('selected');
            hiddenTable.classList.remove('hidden');
            newWordsTable.classList.add('hidden');
            deckTable.classList.add('hidden');
        };
    }
}

const idsToExporters: {[id: string]: ColumnExporter} = {};

const setupExportDialog = async () => {
    const exportButton = document.getElementById('export-deck-button');
    const dialog = document.getElementById('export-dialog') as HTMLDialogElement;
    if (exportButton) {
        exportButton.onclick = async () => {
            dialog.showModal();
        };
    }

    // setup column options
    const includedColumnsElement = document.getElementById("included-columns");
    const excludedColumnsElement = document.getElementById("excluded-columns");
    let exportSettings = (await chrome.storage.local.get(["export_settings"]))["export_settings"] as ExportSettings;

    if (!exportSettings) {
        exportSettings = {
            shouldIncludeHeaders: true,
            includedExporters: DefaultIncludedColumnExporters
        }
    }

    if (includedColumnsElement && excludedColumnsElement) {
        for (const exporter of AllColumnExporters) {
            const exportElement = document.createElement("li");
            exportElement.classList.add("column-item");
            exportElement.draggable = true;
            exportElement.innerText = exporter.header;
            exportElement.id = "exporter-" + exporter.localStorageKey;
            idsToExporters["exporter-" + exporter.localStorageKey] = exporter;
            if (exportSettings.includedExporters.includes(exporter.localStorageKey)) {
                includedColumnsElement.appendChild(exportElement);
            }
            else {
                excludedColumnsElement.appendChild(exportElement);
            }
        }
    }

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
    const includeHeadersCheckbox = document.getElementById('include-header-checkbox') as HTMLInputElement;
    if (finalizeButton && includedColumnsElement && includeHeadersCheckbox) {
        finalizeButton.onclick = async () => {
            const exporters = Array.from(includedColumnsElement.children).map(li => idsToExporters[li.id]);
            exportDeck(exporters, controller.deckWords, includeHeadersCheckbox.checked);
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

const getTablePageSize = (tableBody: HTMLElement): number => {
    const rows = Array.from(tableBody.children) as HTMLTableRowElement[];
    if (rows.length > 0) {
        const rowHeight = rows[0].offsetHeight;

        const tableElement = tableBody.parentElement as HTMLElement;
        const tableHeaderElement = tableBody.children[0] as HTMLElement;
        const tableWrapper = tableElement.parentElement as HTMLElement;
        const bodyHeight = tableWrapper.offsetHeight - tableHeaderElement.offsetHeight;
        // make sure the page size never goes below 1 so that one element always renders.
        return Math.max(Math.floor(bodyHeight / rowHeight), 1);
    }
    else {
        // If there is no row to sample, assume we can always display at least 1 row.
        return 1;
    }
}

// retrieve all data that was stored by the content script
chrome.storage.local.get(null).then(async (allData) => {

    const words: WordInfo[] = Object.keys(allData)
        // exclude url data
        .filter(key => key.startsWith('word_'))
        // remove the prefix and attach the value
        .map(key => ({
            word: key.slice(5),
            count: allData[key].count,
            state: allData[key].state,
            kuromojiId: allData[key].kuromojiId }));
    const exportSettings = allData["export_settings"] as ExportSettings | undefined;

    controller = new VisualizerController(words, exportSettings);

    setupTabs();
    setupListedTabWords();
    setupDeckTabWords();
    setupHiddenTabWords();
    await setupExportDialog();
});
import { CardState } from "../common/enums";
import { hideSvg, plusSvg, showSvg } from "./svg";
import { ColumnExporter, ExportSettings, WordInfo } from "./types";
import { AllColumnExporters, DefaultIncludedColumnExporters } from "./columnExporters";
import { getDragAfterElement } from "./utils";
import { exportDeck } from "./export";
import { VisualizerController, VisualizerControllerEventTypes } from "./visualizerController";
import { DeckWords, ListedWords, VisualizerList } from "./visualizerList";

const wordListElement = document.getElementById('word-list');
const deckListElement = document.getElementById('deck-list');
const hiddenListElement = document.getElementById('hidden-list');
const mainElement = document.getElementById('main');

// initialize page sizes to 1 so that one element will always render
let wordList: VisualizerList;
let deckList: VisualizerList;
let hiddenList: VisualizerList;

let controller: VisualizerController;

const setupPageResizeObserver = () => {
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        wordList.onPageResize();
        deckList.onPageResize();
        hiddenList.onPageResize();
    });
    
    if (mainElement) {
        resizeObserver.observe(mainElement);
    }
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

    deckList.setupList();
    hiddenList.setupList();
    wordList.setupList();
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

    if (deckListElement) {
        deckList = new DeckWords(deckListElement, controller);
    }
    if (wordListElement) {
        wordList = new ListedWords(wordListElement, controller)
    }
    if (hiddenListElement) {
        hiddenList = new ListedWords(hiddenListElement, controller)
    }

    setupTabs();
    await setupExportDialog();
    setupPageResizeObserver();
});
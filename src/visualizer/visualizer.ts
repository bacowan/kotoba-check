import { CardState } from "../common/enums";
import { hideSvg, plusSvg, showSvg } from "./svg";
import { ColumnExporter, ExportSettings, WordInfo } from "./types";
import { AllColumnExporters, DefaultIncludedColumnExporters } from "./columnExporters";
import { getDragAfterElement } from "./utils";
import { exportDeck } from "./export";
import { VisualizerController, VisualizerControllerEventTypes } from "./visualizerController";
import { DeckWords, HiddenWords, ListedWords, VisualizerList } from "./visualizerList";
import { TabUiController } from "./tabUiController";

const wordListElement = document.getElementById('word-list');
const deckListElement = document.getElementById('deck-list');
const hiddenListElement = document.getElementById('hidden-list');
const mainElement = document.getElementById('main');

let wordList: VisualizerList;
let deckList: VisualizerList;
let hiddenList: VisualizerList;
let currentDeckList: VisualizerList;

let deckTabUIController: TabUiController;
let hiddenTabUIController: TabUiController;
let listedTabUIController: TabUiController;

let controller: VisualizerController;

const setupPageResizeObserver = () => {
    const resizeObserver = new ResizeObserver((_: ResizeObserverEntry[]) => {
        wordList.recalculatePages();
        deckList.recalculatePages();
        hiddenList.recalculatePages();
    });
    
    if (mainElement) {
        resizeObserver.observe(mainElement);
    }
}

// setup the click handlers for the tab headers
const setupTabs = () => {
    deckTabUIController = new TabUiController(
        document.getElementById('deck-tab'),
        document.getElementById('deck-table'));
    hiddenTabUIController = new TabUiController(
        document.getElementById('hidden-tab'),
        document.getElementById('hidden-table'));
    listedTabUIController = new TabUiController(
        document.getElementById('new-words-tab'),
        document.getElementById('new-words-table'));
    deckTabUIController.setConnectedTabs(hiddenTabUIController, listedTabUIController);
    hiddenTabUIController.setConnectedTabs(deckTabUIController, listedTabUIController);
    listedTabUIController.setConnectedTabs(deckTabUIController, hiddenTabUIController);

    deckTabUIController.onTabEnabledEvent.subscribe(() => {
        currentDeckList = deckList;
        deckList.recalculatePages();
        updatePaginationText(deckList.currentPage, deckList.totalPages);
    });
    hiddenTabUIController.onTabEnabledEvent.subscribe(() => {
        currentDeckList = hiddenList;
        hiddenList.recalculatePages();
        updatePaginationText(hiddenList.currentPage, hiddenList.totalPages);
    });
    listedTabUIController.onTabEnabledEvent.subscribe(() => {
        currentDeckList = wordList;
        wordList.recalculatePages();
        updatePaginationText(wordList.currentPage, wordList.totalPages);
    });

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

const updatePaginationText = (currentPage: number, totalPages: number) => {
    const currentPageText = document.getElementById("current-page") as HTMLInputElement;
    const totalPagesText = document.getElementById("total-pages");
    if (currentPageText && totalPagesText) {
        currentPageText.value = (currentPage + 1).toString();
        totalPagesText.innerText = totalPages.toString();
    }
}

const setupPaginationArea = () => {
    const prevPageButton = document.getElementById("prev-page-button");
    const nextPageButton = document.getElementById("next-page-button");
    const currentPageText = document.getElementById("current-page") as HTMLInputElement;

    if (prevPageButton && nextPageButton && currentPageText) {
        updatePaginationText(currentDeckList.currentPage, currentDeckList.totalPages);
        currentPageText.onchange = (event) => {
            if (event.target && event.target instanceof HTMLInputElement) {
                currentDeckList.setCurrentPage(parseInt(event.target.value) - 1);
            }
        }
        prevPageButton.onclick = () => {
            currentDeckList.movePage(-1);
        }
        nextPageButton.onclick = () => {
            currentDeckList.movePage(1);
        }
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
        deckList.pageInfoUpdatedEvent.subscribe((currentPage, totalPages) => updatePaginationText(currentPage, totalPages));
    }
    if (wordListElement) {
        wordList = new ListedWords(wordListElement, controller);
        wordList.pageInfoUpdatedEvent.subscribe((currentPage, totalPages) => updatePaginationText(currentPage, totalPages));
        currentDeckList = wordList;
    }
    if (hiddenListElement) {
        hiddenList = new HiddenWords(hiddenListElement, controller);
        hiddenList.pageInfoUpdatedEvent.subscribe((currentPage, totalPages) => updatePaginationText(currentPage, totalPages));
    }

    setupTabs();
    await setupExportDialog();
    setupPageResizeObserver();
    setupPaginationArea();
});
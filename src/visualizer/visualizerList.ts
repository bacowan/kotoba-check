import { CardState } from "../common/enums";
import { hideSvg, plusSvg, showSvg } from "./svg";
import { WordInfo } from "./types";
import { VisualizerController, VisualizerControllerEventTypes } from "./visualizerController";

export class VisualizerList {
    pageSize = 1;
    currentPage = 0;
    totalPages = 1;
    controller: VisualizerController;
    updateEventType: VisualizerControllerEventTypes;
    listElement: HTMLElement;

    constructor(updateEventType: VisualizerControllerEventTypes, listElement: HTMLElement, controller: VisualizerController) {
        this.controller = controller;
        this.updateEventType = updateEventType;
        this.listElement = listElement;
    }

    setupList() {
        // initial page is 0. This adds the elements to the page as well.
        this.setCurrentPage(0);
    
        // subscribe for updates
        this.controller.on(this.updateEventType, () => {
            // setting the page to itself will trigger a rerender
            this.setCurrentPage(this.currentPage);
        });
    
        if (this.listElement) {
            // set the initial page size
            this.pageSize = this.getTablePageSize(this.listElement);
            this.totalPages = Math.ceil(this.getWordList().length / this.pageSize);
            // set the page size to itself to refresh the UI
            this.setCurrentPage(this.currentPage);
        }
    }

    movePage(count: number) {
        const newPageNumber = this.currentPage + count;
        if (newPageNumber >= 0 && newPageNumber < this.totalPages) {
            this.setCurrentPage(this.currentPage + count);
        }
    }

    setCurrentPage(pageNumber: number) {
        const firstElementIndex = pageNumber * this.pageSize;
        const lastElementIndex = (pageNumber + 1) * this.pageSize;
        
        this.listElement?.replaceChildren();
        for (const { word, count } of this.getWordList().slice(firstElementIndex, lastElementIndex)) {
            this.addWordToUI(word, count);
        }

        this.currentPage = pageNumber;
    }

    onPageResize(): void {
        const pageSize = this.getTablePageSize(this.listElement);
        if (this.pageSize !== pageSize) {
            this.pageSize = pageSize;
            this.totalPages = Math.ceil(this.getWordList().length / this.pageSize);
            // setting the page to the current page refreshes the data
            this.setCurrentPage(this.currentPage);
        }
    }

    getTablePageSize(tableBody: HTMLElement): number {
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

    getWordList(): WordInfo[] {
        throw new Error("unimplemented");
    }

    addWordToUI(word: string, count: number): void {
        throw new Error("unimplemented");
    }
}

export class DeckWords extends VisualizerList {
    constructor(listElement: HTMLElement, controller: VisualizerController) {
        super(VisualizerControllerEventTypes.UpdateDeckWords, listElement, controller);
    }

    getWordList(): WordInfo[] {
        return this.controller.deckWords;
    }

    addWordToUI(word: string, count: number): void {
        const jmdictEntry = this.controller.getDictEntry(word);
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
        barElement.style.width = `${count / this.controller.maxCount * 100}%`;
        barContainer.appendChild(barElement);
        barCell.appendChild(barContainer);
        row.appendChild(barCell);
    
        const removeCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = '－';
        removeButton.className = 'remove-button';
        removeButton.onclick = async () => await this.controller.moveWord(word, CardState.Listed);
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);
    
        this.listElement.appendChild(row);
    }
}

export class ListedWords extends VisualizerList {
    constructor(listElement: HTMLElement, controller: VisualizerController) {
        super(VisualizerControllerEventTypes.UpdateListedWords, listElement, controller);
    }

    getWordList(): WordInfo[] {
        return this.controller.listedWords;
    }

    addWordToUI(word: string, count: number): void {
        const jmdictEntry = this.controller.getDictEntry(word);
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
        barElement.style.width = `${count / this.controller.maxCount * 100}%`;
        barContainer.appendChild(barElement);
        barCell.appendChild(barContainer);
        row.appendChild(barCell);
    
        const removeCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.innerHTML = hideSvg;
        removeButton.className = 'remove-button';
        removeButton.onclick = async () => await this.controller.moveWord(word, CardState.Hidden);
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);
    
        const addCell = document.createElement('td');
        const addButton = document.createElement('button');
        addButton.innerHTML = plusSvg;
        addButton.className = 'add-button';
        addButton.onclick = async () => await this.controller.moveWord(word, CardState.InDeck);
        addCell.appendChild(addButton);
        row.appendChild(addCell);
    
        this.listElement.appendChild(row);
    }
}

export class HiddenWords extends VisualizerList {
    constructor(listElement: HTMLElement, controller: VisualizerController) {
        super(VisualizerControllerEventTypes.UpdateHiddenWords, listElement, controller);
    }

    getWordList(): WordInfo[] {
        return this.controller.hiddenWords;
    }

    addWordToUI(word: string, count: number): void {
        const jmdictEntry = this.controller.getDictEntry(word);
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
            barElement.style.width = `${count / this.controller.maxCount * 100}%`;
            barContainer.appendChild(barElement);
            barCell.appendChild(barContainer);
            row.appendChild(barCell);
        
            const removeCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.innerHTML = showSvg;
            removeButton.className = 'show-button';
            removeButton.onclick = async () => await this.controller.moveWord(word, CardState.Listed);
            removeCell.appendChild(removeButton);
            row.appendChild(removeCell);
        
            this.listElement?.appendChild(row);
    }
}
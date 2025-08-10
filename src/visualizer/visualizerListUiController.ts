import { CardState } from "../common/enums";
import { Event } from "../common/event";
import { hideSvg, plusSvg, showSvg } from "./svg";
import { WordInfo } from "./types";
import { VisualizerController } from "./visualizerController";

export enum VisualizerListEventTypes {
    PageInfoChanged
}

export class VisualizerListUiController {
    pageSize = 1;
    currentPage = 0;
    totalPages = 1;
    controller: VisualizerController;
    wordMovedEvent: (controller: VisualizerController) => Event<[]>;
    listElement: HTMLElement;

    pageInfoUpdatedEvent: Event<[currentPage: number, totalPages: number]> = new Event();

    constructor(wordMovedEvent: (controller: VisualizerController) => Event<[]>, listElement: HTMLElement, controller: VisualizerController) {
        this.controller = controller;
        this.wordMovedEvent = wordMovedEvent;
        this.listElement = listElement;
    }

    setupList() {
        // initial page is 0. This adds the elements to the page as well.
        this.setCurrentPage(0);
    
        // subscribe for updates
        this.wordMovedEvent(this.controller).subscribe(() => {
            // setting the page to itself will trigger a rerender
            this.setCurrentPage(this.currentPage);
        });
    
        this.recalculatePages();

        this.pageInfoUpdatedEvent.trigger(this.currentPage, this.totalPages);
    }

    movePage(count: number) {
        this.setCurrentPage(this.currentPage + count);
    }

    setCurrentPage(pageNumber: number) {
        if (pageNumber >= 0 && pageNumber < this.totalPages) {
            const firstElementIndex = pageNumber * this.pageSize;
            const lastElementIndex = (pageNumber + 1) * this.pageSize;
            
            this.listElement?.replaceChildren();
            for (const { word, count } of this.getWordList().slice(firstElementIndex, lastElementIndex)) {
                this.addWordToUI(word, count);
            }

            this.currentPage = pageNumber;
        }
            
        this.pageInfoUpdatedEvent.trigger(this.currentPage, this.totalPages);
    }

    recalculatePages(): void {
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

export class DeckWordsUiController extends VisualizerListUiController {
    constructor(listElement: HTMLElement, controller: VisualizerController) {
        super(controller => controller.wordMovedToDeckEvent, listElement, controller);
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
        removeButton.onclick = async () => await this.controller.moveWord(word, CardState.New);
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);
    
        this.listElement.appendChild(row);
    }
}

export class ListedWordsUiController extends VisualizerListUiController {
    constructor(listElement: HTMLElement, controller: VisualizerController) {
        super(controller => controller.wordMovedToNewEvent, listElement, controller);
    }

    getWordList(): WordInfo[] {
        return this.controller.newWords;
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

export class HiddenWordsUiController extends VisualizerListUiController {
    constructor(listElement: HTMLElement, controller: VisualizerController) {
        super(controller => controller.wordMovedToHiddenEvent, listElement, controller);
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
            removeButton.onclick = async () => await this.controller.moveWord(word, CardState.New);
            removeCell.appendChild(removeButton);
            row.appendChild(removeCell);
        
            this.listElement?.appendChild(row);
    }
}
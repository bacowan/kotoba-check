import { CardState } from "../common/enums";
import { hideSvg, plusSvg } from "./svg";

const wordListElement = document.getElementById('word-list');
const deckListElement = document.getElementById('deck-list');

const getMaxCount = (allData: {[key: string]: any}): number => {
    return Object.keys(allData)
        // exclude url data
        .filter(key => key.startsWith('word_'))
        // remove the prefix and attach the value
        .reduce((max, key) => {
            const count = allData[key].count;
            return Math.max(max, count);
        }, 0);
}

const getWordsOfState = (allData: {[key: string]: any}, state: CardState): {
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

const setupList = async (allData: {[key: string]: any}) => {
    if (!wordListElement) {
        console.error('Word list element not found');
        return;
    }
    
    const words = getWordsOfState(allData, CardState.Listed);
    
    const maxCount = getMaxCount(allData);

    for (const { word, count } of words) {
        const row = document.createElement('tr');
        
        const wordCell = document.createElement('td');
        wordCell.textContent = word;
        row.appendChild(wordCell);

        const barCell = document.createElement('td');
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        barContainer.title = count;
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
    const row = document.createElement('tr');
    
    const wordCell = document.createElement('td');
    wordCell.textContent = word;
    row.appendChild(wordCell);
    
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

const setupDeckList = (allData: {[key: string]: any}) => {

    // list of words
    if (!deckListElement) {
        console.error('Word list element not found');
        return;
    }
    const words = getWordsOfState(allData, CardState.InDeck);

    const maxCount = getMaxCount(allData);
    for (const { word, count } of words) {
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

const setupExportDialog = () => {
    const exportButton = document.getElementById('export-deck-button');
    const dialog = document.getElementById('export-dialog') as HTMLDialogElement;
    if (exportButton) {
        exportButton.onclick = async () => {
            dialog.showModal();
        };
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
}

// retrieve all data that was stored by the content script
chrome.storage.local.get(null).then((allData) => {
    setupTabs();
    setupList(allData);
    setupDeckList(allData);
    setupExportDialog();
});
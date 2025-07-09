const setup = async () => {
    const wordListElement = document.getElementById('word-list');
    if (!wordListElement) {
        console.error('Word list element not found');
        return;
    }
    
    // retrieve all data that was stored by the content script
    const allData = await chrome.storage.local.get(null);
    const words = Object.keys(allData)
        // exclude url data
        .filter(key => key.startsWith('word_'))
        // only include words that are in the listed state
        .filter(key => allData[key].state === CardState.Listed)
        // remove the prefix and attach the value
        .map(key => ({ word: key.slice(5), count: allData[key].count }))
        // sort by count
        .sort((a, b) => b.count - a.count);
    
    const maxCount = words.length > 0 ? words[0].count : 1;

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

        const removeRow = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = '－';
        removeButton.className = 'remove-button';
        removeButton.onclick = async () => {
            await removeWordFromList(word, count);
            removeWordFromUI(row);
        }
        removeRow.appendChild(removeButton);
        row.appendChild(removeRow);

        const addRow = document.createElement('td');
        const addButton = document.createElement('button');
        addButton.textContent = '＋';
        addButton.className = 'add-button';
        addButton.onclick = async () => {
            await addWordToDeck(word, count);
            removeWordFromUI(row);
        }
        addRow.appendChild(addButton);
        row.appendChild(addRow);

        wordListElement.appendChild(row);
    }
};

// Add a word to the deck. This will update the local storage
// to mark the word as in the deck, and it will appear in the deck
// list. This will not remove it from the UI.
const addWordToDeck = async (word: string, count: number) => {
        const wordKey = `word_${word}`;
    // reload the word to make sure it's up to date
    const freshWords = await chrome.storage.local.get([wordKey]);
    let freshWord = freshWords[wordKey];
    if (!freshWord) {
        freshWord = {
            count: count,
            state: CardState.InDeck
        };
    }
    else {
        freshWord.state = CardState.InDeck;
    }

    await chrome.storage.local.set(
        { [wordKey]: freshWord }
    );
}

// Remove a word from the word list. This will update local storage
// to mark the word as removed. This function does not remove the word from the UI.
const removeWordFromList = async (word: string, count: number) => {
}

// Remove a word from the UI.
const removeWordFromUI = (row: HTMLTableRowElement) => {
}

setup();
import { CardState } from "../common/enums";

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

        const removeCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = '－';
        removeButton.className = 'remove-button';
        removeButton.onclick = async () => {
            await setWordState(word, count, CardState.Removed);
            row.remove();
        }
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        const addCell = document.createElement('td');
        const addButton = document.createElement('button');
        addButton.textContent = '＋';
        addButton.className = 'add-button';
        addButton.onclick = async () => {
            await setWordState(word, count, CardState.InDeck);
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

setup();
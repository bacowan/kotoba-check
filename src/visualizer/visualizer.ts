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
        // remove the prefix and attach the value
        .map(key => ({ word: key.slice(5), count: allData[key] }))
        // sort by count
        .sort((a, b) => b.count - a.count);
    
    const maxCount = words.length > 0 ? words[0].count : 1;

    for (const { word, count } of words) {
        const rowElement = document.createElement('div');
        rowElement.className = 'word-row';
        
        const wordElement = document.createElement('span');
        wordElement.className = 'word';
        wordElement.textContent = word;
        rowElement.appendChild(wordElement);

        const countElement = document.createElement('span');
        countElement.className = 'word-count';
        countElement.textContent = count;
        rowElement.appendChild(countElement);

        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';

        const barElement = document.createElement('div');
        barElement.className = 'bar';
        barElement.style.width = `${count / maxCount * 100}%`; // Scale width to a max of 100%
        barContainer.appendChild(barElement);

        rowElement.appendChild(barContainer);

        const removeButton = document.createElement('button');
        removeButton.textContent = '－';
        removeButton.className = 'add-button';
        removeButton.onclick = async () => await addWord(word);
        rowElement.appendChild(removeButton);

        const addButton = document.createElement('button');
        addButton.textContent = '＋';
        addButton.className = 'add-button';
        addButton.onclick = async () => await addWord(word);
        rowElement.appendChild(addButton);

        wordListElement.appendChild(rowElement);
    }
};

const addWord = async (word: string) => {

}

setup();
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
        removeButton.onclick = async () => await addWord(word);
        removeRow.appendChild(removeButton);
        row.appendChild(removeRow);
        
        const addRow = document.createElement('td');
        const addButton = document.createElement('button');
        addButton.textContent = '＋';
        addButton.className = 'add-button';
        addButton.onclick = async () => await addWord(word);
        addRow.appendChild(addButton);
        row.appendChild(addRow);

        wordListElement.appendChild(row);
    }
};

const addWord = async (word: string) => {

}

setup();
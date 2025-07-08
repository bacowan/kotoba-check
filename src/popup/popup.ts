document.getElementById('openPage')?.addEventListener('click', () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('visualizer/index.html')
    });
});
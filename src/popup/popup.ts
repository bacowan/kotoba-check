window.addEventListener('load', () => {
    document.getElementById('review-button')?.addEventListener('click', () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL('visualizer/visualizer.html')
        });
    });

    document.getElementById('options-button')?.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});
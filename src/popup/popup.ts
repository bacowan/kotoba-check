window.addEventListener('load', () => {
    document.getElementById('review-button')?.addEventListener('click', () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL('visualizer/index.html')
        });
    });

    document.getElementById('options-button')?.addEventListener('click', () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL('options/options.html')
        });
    });
});
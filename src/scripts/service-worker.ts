// Run an update whenever the URL changes via the History API
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  // Send message to the tab where the content script is running
  chrome.tabs.sendMessage(details.tabId, { type: 'RUN_UPDATE' });
});

// Run an update whenever the URL changes via regular navigation
chrome.webNavigation.onCompleted.addListener((details) => {
  chrome.tabs.sendMessage(details.tabId, { type: 'RUN_UPDATE' });
});
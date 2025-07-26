const clearDataButton = document.getElementById('clear-data-button');
const confirmArea = document.getElementById('confirm-section');
const confirmButton = document.getElementById('confirm');
const cancelButton = document.getElementById('cancel');
const completedMessage = document.getElementById('completed-message');

clearDataButton?.addEventListener('click', () => {
    clearDataButton.classList.add('hidden');
    confirmArea?.classList.remove('hidden');


    if (window.confirm("Are you sure you want to clear data stored for Kotoba Check?")) {
        chrome.storage.local.clear(() => {
            alert("Data for Kotoba Check has been cleared");
        });
    }
});

cancelButton?.addEventListener('click', () => {
    confirmArea?.classList.add('hidden');
    clearDataButton?.classList.remove('hidden');
});

confirmButton?.addEventListener('click', () => {
    chrome.storage.local.clear(() => {
        confirmArea?.classList.add('hidden');
        completedMessage?.classList.remove('hidden');
        setTimeout(() => {
            clearDataButton?.classList.remove('hidden');
            completedMessage?.classList.add('hidden');
        }, 5000);
    });
})
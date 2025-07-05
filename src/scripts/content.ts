import { Readability } from "@mozilla/readability";

const parse = () => {
    const article = new Readability(document.cloneNode(true) as Document).parse();
    console.log(article);
}

// Listen for changes in the URL in ways other than regular navigation.
// These updates will come from the service worker.
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'RUN_UPDATE') {
    parse();
  }
});
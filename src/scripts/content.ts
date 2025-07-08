import { Readability } from "@mozilla/readability";
import kuromoji from "kuromoji";

const addWordsToDictionary = async (words: kuromoji.IpadicFeatures[]) => {
  const wordKeys = words.map(word => 'word_' + word.basic_form);
  const wordCounts = await chrome.storage.local.get(wordKeys);
  for (const key of wordKeys) {
    if (wordCounts[key] === undefined) {
      wordCounts[key] = 1;
    }
    else {
      wordCounts[key]++;
    }
  }
  await chrome.storage.local.set(wordCounts);
}

const parse = async () => {
  const article = new Readability(document.cloneNode(true) as Document).parse();
  if (article) {
    kuromoji.builder({ dicPath: chrome.runtime.getURL('dict') }).build(function (err, tokenizer) {
      const title = tokenizer.tokenize(article.title);
      const content = tokenizer.tokenize(article.textContent);
      addWordsToDictionary(title);
      addWordsToDictionary(content);
    });
  }
}

const checkPage = async () => {
  // only parse the page if it hasn't been visited before
  const visitedKey = "visited_" + window.location.href;
  const wasVisited = await chrome.storage.local.get([visitedKey]);
  console.log(wasVisited[visitedKey]);

  if (!wasVisited[visitedKey]) {
    await chrome.storage.local.set({ [visitedKey]: true });
    await parse();
  }
}

// Listen for changes in the URL in ways other than regular navigation.
// These updates will come from the service worker.
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'RUN_UPDATE') {
    checkPage();
  }
});
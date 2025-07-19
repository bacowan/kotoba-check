import { Readability } from "@mozilla/readability";
import kuromoji from "kuromoji";
import { CardState } from "../common/enums";

const includedPartsOfSpeech = [
  "名詞",
  "連体詞",
  "動詞",
  "接続詞",
  "形容詞",
  "副詞",
  "接頭詞",
  "感動詞"
]

const excludedPosDetail = [
  "非自立",
  "接尾"
]

const addWordsToDictionary = async (words: kuromoji.IpadicFeatures[]) => {
  const wordKeys = words
    .filter(word =>
      word.word_type === "KNOWN" &&
      includedPartsOfSpeech.includes(word.pos) &&
      !excludedPosDetail.includes(word.pos_detail_1) &&
      !excludedPosDetail.includes(word.pos_detail_2) &&
      !excludedPosDetail.includes(word.pos_detail_3))
    .map(word => ({
      word: 'word_' + word.basic_form,
      pronounciation: word.pronunciation,
      reading: word.reading
    }));
  const wordCounts = await chrome.storage.local.get(wordKeys);
  for (const key of wordKeys) {
    if (wordCounts[key.word] === undefined) {
      wordCounts[key.word] = {
        count: 1,
        state: CardState.Listed,
        reading: key.reading
      };
    }
    else {
      wordCounts[key.word].count++;
    }
  }
  await chrome.storage.local.set(wordCounts);
}

const parse = async () => {
  const article = new Readability(document.cloneNode(true) as Document).parse();
  if (article && article.title && article.textContent) {
    const title = article.title;
    const textContent = article.textContent;
    kuromoji.builder({ dicPath: chrome.runtime.getURL('dict') }).build(function (err, tokenizer) {
      const tokenizedTitle = tokenizer.tokenize(title);
      const tokenizedContent = tokenizer.tokenize(textContent);
      addWordsToDictionary(tokenizedTitle);
      addWordsToDictionary(tokenizedContent);
    });
  }
}

const checkPage = async () => {
  // only parse the page if it hasn't been visited before
  const visitedKey = "visited_" + window.location.href;
  const wasVisited = await chrome.storage.local.get([visitedKey]);

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
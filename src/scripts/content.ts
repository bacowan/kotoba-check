import { Readability } from "@mozilla/readability";
//import kuromoji from "kuromoji";

const parse = async () => {
  // only parse the page if it hasn't been visited before
  const visitedKey = "visited_" + window.location.href;
  const visited = chrome.storage.local.get(visitedKey);
  
  if (!visited) {
    chrome.storage.local.set({ [visitedKey]: true });
    const article = new Readability(document.cloneNode(true) as Document).parse();
    if (article) {
      
    }
  }
}

// Listen for changes in the URL in ways other than regular navigation.
// These updates will come from the service worker.
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'RUN_UPDATE') {
    parse();
  }
});


/*kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build((err, tokenizer) => {
  if (err) throw err;

  const tokens = tokenizer.tokenize("ご飯を食べました");
  tokens.forEach(token => {
    console.log(token.surface_form, "→", token.basic_form); // 食べました → 食べる
  });
});*/
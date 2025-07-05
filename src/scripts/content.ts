import { Readability } from "@mozilla/readability";

const article = new Readability(document.cloneNode(true) as Document).parse();
console.log(article);
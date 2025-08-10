const { CardState } = require("../../src/common/enums");

const createWord = (word, state) => {
    return {
        word: word,
        count: 1,
        state: state ?? CardState.InDeck,
        kuromojiId: 1
    };
}

exports.createWord = createWord;
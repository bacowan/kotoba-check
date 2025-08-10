const { CardState } = require("../../src/common/enums");

const createWord = (word, state, count) => {
    return {
        word: word,
        count: count ?? 1,
        state: state,
        kuromojiId: 1
    };
}

exports.createWord = createWord;
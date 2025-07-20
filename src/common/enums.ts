export enum CardState {
    Listed = 0, // Neither the plus nor minus button has been clicked, the word is listed
    InDeck, // The plus button has been clicked and the word is in the deck
    Hidden // The minus button has been clicked and the word is not in the deck or the list
}
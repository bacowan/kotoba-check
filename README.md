# Kotoba Check
## Overview
Kotoba Check is a plugin for Google Chrome to help with studying Japanese Vocabulary.

As you browse the internet, it keeps track of Japanese words that you encounter and the number of times you have seen them. You can view the list of words and mark ones that you want to study. The idea is that the more frequently you encounter a word, the more important it may be to you personally. For example, if you spend a lot of time on websites about your hobby, you might encounter a lot of words related to that hobby which would be more useful to you than someone who is not interested in that.

### Features
- Parses websites that you visit for Japanese vocabulary;
- Stores words that have been parsed along with the number of times you have encountered them in total;
- UI that includes a list of all words that you have encountered and the number of times you have encountered them;
- Words can be marked as "new", "deck", or "hidden". Words are shown in the UI in separate lists based on this state:
  - Words will default to the "new" state;
  - Words that you want to study can be marked for the "deck";
  - Words that you do not want to study can be marked as "hidden";
- Words that have been marked as in the "deck" can be exported in csv format (for example, to import into Anki);
- Saved data can be cleared.

## Building

1. Kotoba Check uses JMDict for dictionary definitions. The dictionary is too big to store in Git, so you must download it yourself. Download one of the releases from https://github.com/scriptin/jmdict-simplified
1. Extract the downloaded files and place it in `/jmdict` with the name `raw.json`;
1. The dictionary file must be converted to the correct format. Run `npm run generate-jmdict` to do this;
1. Run `npm run build` to create the `dist` folder and its contents, which can be run as a Google Chrome extension.

## Running
1. Once the steps in build have been completed, open up Google Chrome and go to the Manage Extensions page;
1. Ensure that Developer mode is enabled;
1. Click "Load Unpacked";
1. Navigate to the `dist` folder of the project and click "Select Folder".

## Tests
There are two sets of tests: end to end tests and Unit tests.
- To run the UI tests, run `npm run test:e2e`;
- To run the Unit tests, run `npm run test:unit`. Note that this command also includes test coverage information;
- To run both, run `npm run test`;
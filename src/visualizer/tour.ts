import Shepherd from "shepherd.js";
import 'shepherd.js/dist/css/shepherd.css';

export const startTour = () => {
    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'shadow-md bg-purple-dark',
            scrollTo: true
        }
    });

    tour.addSteps([
        {
            id: 'welcome-step',
            text: 'Welcome to Kotoba Check! This plugin will help you to learn Japanese words that you encounter frequently. It keeps track of how often you see words when browsing the internet.',
            canClickTarget: false,
            buttons: [
                {
                    text: 'Next',
                    action: tour.next
                }
            ]
        },
        {
            id: 'list-step',
            text: 'Once you have encountered some words, they will appear here in order of frequency.',
            canClickTarget: false,
            attachTo: {
                element: '#main',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Next',
                    action: tour.next
                }
            ]
        },
        {
            id: 'add-step',
            text: 'If you want to review a word later, press the + button. If you want to hide a word from the list, press the hide button.',
            canClickTarget: false,
            attachTo: {
                element: '#main',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Next',
                    action: tour.next
                }
            ]
        },
        {
            id: 'new-tab-step',
            text: 'This tab contains words new words.',
            canClickTarget: false,
            attachTo: {
                element: '#new-words-tab',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Next',
                    action: tour.next
                }
            ]
        },
        {
            id: 'deck-tab-step',
            text: 'This tab contains words that you have saved for review.',
            canClickTarget: false,
            attachTo: {
                element: '#deck-tab',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Next',
                    action: tour.next
                }
            ]
        },
        {
            id: 'hidden-tab-step',
            text: 'This tab contains words that you have marked to hide.',
            canClickTarget: false,
            attachTo: {
                element: '#hidden-tab',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Next',
                    action: tour.next
                }
            ]
        },
        {
            id: 'export-step',
            text: 'You can export your deck so that you can import it into a flascard app like anki here.',
            canClickTarget: false,
            attachTo: {
                element: '#export-deck-button',
                on: 'top'
            },
            buttons: [
                {
                    text: 'Next',
                    action: tour.next
                }
            ]
        },
        {
            id: 'final-step',
            text: 'We hope that you enjoy Kotoba Check!',
            canClickTarget: false,
            buttons: [
                {
                    text: 'Next',
                    action: tour.next
                }
            ]
        }
    ]);

    tour.start();
}
import { Event } from "../common/event";

export class TabUiController {
    tabElement: HTMLElement | null;
    contentElement: HTMLElement | null;
    connectedTabs: TabUiController[] | undefined;
    isSelected: boolean;
    onTabEnabledEvent: Event<[]> = new Event<[]>();

    constructor(tabElement: HTMLElement | null, contentElement: HTMLElement | null) {
        this.tabElement = tabElement;
        this.contentElement = contentElement;
        if (tabElement?.classList.contains("selected")) {
            this.isSelected = true;
        }
        else {
            this.isSelected = false;
        }

        if (tabElement) {
            tabElement.onclick = () => {
                this.enable();
                if (this.connectedTabs) {
                    for (const tab of this.connectedTabs) {
                        tab.disable();
                    }
                }
                this.onTabEnabledEvent.trigger();
            }
        }
    }

    setConnectedTabs(...tabs: TabUiController[]) {
        this.connectedTabs = tabs;
    }

    enable() {
        this.isSelected = true;
        this.tabElement?.classList.add("selected");
        this.contentElement?.classList.remove("hidden");
    }

    disable() {
        this.isSelected = false;
        this.tabElement?.classList.remove("selected");
        this.contentElement?.classList.add("hidden");
    }
}
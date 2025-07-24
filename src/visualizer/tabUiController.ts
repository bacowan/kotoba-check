export class TabUiController {
    tabElement: HTMLElement | null;
    contentElement: HTMLElement | null;
    connectedTabs: TabUiController[] | undefined;
    isSelected: boolean;
    onTabEnabledListeners: (() => void)[] = [];

    constructor(tabElement: HTMLElement | null, contentElement: HTMLElement | null, onTabEnabled: () => void) {
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
                onTabEnabled();
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
    
    onTabClicked(callback: () => void) {
        this.onTabEnabledListeners.push(callback);
    }
}
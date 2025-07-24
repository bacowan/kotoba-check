import { TabUiController } from "./tabUiController";

export class TabWrapperUiController {
    
    tabs: TabUiController[];

    constructor(...tabs: TabUiController[]) {
        this.tabs = tabs;

        for (const tab of tabs) {
            tab.onTabClicked(() => {
                for (const otherTab of tabs.filter(t => t !== tab)) {
                    otherTab.disable();
                }
                tab.enable();
            });
        }
    }

    getSelectedTab(): TabUiController | null {
        return this.tabs.find(t => t.isSelected) || null;
    }
}
import { ProviderResult, TreeItem, TreeItemCollapsibleState } from "vscode";

export class TreeData {

    text: string;
    type: string;

    constructor(text: string, type: string) {
        this.text = text;
        this.type = type;
    }

    getTreeItem(): TreeItem {
        return new TreeItem(this.text, TreeItemCollapsibleState.None);
    }

    getChildren(): ProviderResult<TreeData[]> {
        return [];
    }
}
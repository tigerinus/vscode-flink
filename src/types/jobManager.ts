import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { TreeData } from "../treeData";
import { JobGroup } from "./jobGroup";

export class JobManager extends TreeData {

    address: string;
    displayName: string;

    constructor(address: string, displayName: string) {
        super(address, "JobManager");

        this.address = address;
        this.displayName = displayName;
    }

    getTreeItem(): TreeItem {
        let treeItem: TreeItem = new TreeItem(this.text, TreeItemCollapsibleState.Collapsed);
        treeItem.contextValue = 'jobmanager';
        treeItem.id = this.address;
        treeItem.description = this.displayName;
        return treeItem;
    }

    getChildren(): TreeData[] {
        return [new JobGroup(this.address)];
    }
}
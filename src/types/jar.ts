import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { TreeData } from "../treeData";
import { JobManager } from "./jobManager";

export class Jar extends TreeData {

    jobManager: JobManager;

    jarId: string;
    jarName: string;

    constructor(jobManager: JobManager, jarId: string, jarName: string) {
        super(jarName, "Jar");

        this.jobManager = jobManager;

        this.jarId = jarId;
        this.jarName = jarName;
    }

    getTreeItem(): TreeItem {
        let treeItem: TreeItem = new TreeItem(this.text, TreeItemCollapsibleState.None);

        treeItem.contextValue = 'jar';
        treeItem.id = this.jarId;
        treeItem.tooltip = this.jarId;

        return treeItem;
    }
}
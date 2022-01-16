import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { TreeData } from "../treeData";
import { JarGroup } from './jarGroup';
import { JobGroup } from "./jobGroup";

export class JobManager extends TreeData {

    id: string;
    address: string;
    displayName: string;

    constructor(address: string, displayName: string) {
        super(address, "JobManager");

        this.id = uuidv4();
        this.address = address;
        this.displayName = displayName;
    }

    getTreeItem(): TreeItem {
        let treeItem: TreeItem = new TreeItem(this.text, TreeItemCollapsibleState.Collapsed);
        treeItem.contextValue = 'jobmanager';
        treeItem.id = this.address;
        treeItem.description = this.displayName;
        treeItem.iconPath = {
            light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'logo.svg'),
            dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'logo.svg')
        };
        return treeItem;
    }

    getChildren(): TreeData[] {
        return [
            new JobGroup(this),
            new JarGroup(this)
        ];
    }
}
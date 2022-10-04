import path = require("path");
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { TreeData } from "../treeData";
import { JobGroup } from "./jobGroup";
import { JobManager } from "./jobManager";

export class Job extends TreeData {

    group: JobGroup;

    id: string;
    name: string;
    state: string;

    constructor(group: JobGroup, id: string, name: string, state: string) {
        super(name, "Job");

        this.group = group;

        this.id = id;
        this.name = name;
        this.state = state;
    }

    getTreeItem(): TreeItem {
        let treeItem: TreeItem = new TreeItem(this.text, TreeItemCollapsibleState.None);

        treeItem.contextValue = 'job';
        treeItem.id = this.id;
        treeItem.description = this.state;
        treeItem.tooltip = this.id;

        switch (this.state) {
            case 'INITIALIZING':
            case 'RESTARTING':
            case 'RECONCILING':
            case 'CANCELLING':
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'loading.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'loading.svg')
                };
                break;
            case 'CREATED':
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'check.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'check.svg')
                };
                break;
            case 'RUNNING':
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'watch.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'watch.svg')
                };
                break;
            case 'SUSPENDED':
            case 'FAILING':
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'warning.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'warning.svg')
                };
                break;
            case 'FAILED':
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'error.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'error.svg')
                };
                break;
            case 'CANCELED':
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'blocked.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'blocked.svg')
                };
                break;
            case 'FINISHED':
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'pass.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'pass.svg')
                };
                break;
        }

        return treeItem;
    }
}
import path = require("path");
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { JobStatus } from "@tensorsmart/flink-typescript";
import { TreeData } from "../treeData";
import { JobGroup } from "./jobGroup";

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
            case JobStatus.INITIALIZING:
            case JobStatus.RESTARTING:
            case JobStatus.RECONCILING:
            case JobStatus.CANCELLING:
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'loading.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'loading.svg')
                };
                break;
            case JobStatus.CREATED:
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'check.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'check.svg')
                };
                break;
            case JobStatus.RUNNING:
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'watch.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'watch.svg')
                };
                break;
            case JobStatus.SUSPENDED:
            case JobStatus.FAILING:
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'warning.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'warning.svg')
                };
                break;
            case JobStatus.FAILED:
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'error.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'error.svg')
                };
                break;
            case JobStatus.CANCELED:
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'blocked.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'blocked.svg')
                };
                break;
            case JobStatus.FINISHED:
                treeItem.iconPath = {
                    light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'pass.svg'),
                    dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'pass.svg')
                };
                break;
        }

        return treeItem;
    }
}
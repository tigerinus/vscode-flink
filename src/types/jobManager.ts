import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { TreeData } from "../treeData";
import { JarGroup } from './jarGroup';
import { JobGroup } from "./jobGroup";
import { JobManagerDataProvider } from '../treeDataProvider';


export class JobManager extends TreeData {

    id: string;
    address: string;
    displayName: string;
    jobManagerDataProvider: JobManagerDataProvider | null;

    constructor(address: string, displayName: string, jobManagerDataProvider: JobManagerDataProvider | null) {
        super(address, "JobManager");

        this.id = uuidv4();
        this.address = address;
        this.displayName = displayName;
        this.jobManagerDataProvider = jobManagerDataProvider;
    }

    refresh(): void {
        if (this.jobManagerDataProvider) {
            this.jobManagerDataProvider.refresh(this);
        }
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
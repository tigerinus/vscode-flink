import axios from 'axios';

import { ProviderResult, TreeItem, TreeItemCollapsibleState } from "vscode";
import { JarFileInfo, JarListInfo } from "../interface/getJars";
import { TreeData } from "../treeData";
import { Description } from "./description";
import { Jar } from "./jar";
import { JobManager } from "./jobManager";


export class JarGroup extends TreeData {

    jobManager: JobManager;

    constructor(jobManager: JobManager) {
        super("Jars", "JarGroup");
        this.jobManager = jobManager;
    }

    getTreeItem(): TreeItem {
        let treeItem: TreeItem = new TreeItem(this.text, TreeItemCollapsibleState.Collapsed);
        treeItem.contextValue = 'jargroup';
        return treeItem;
    }

    getChildren(): ProviderResult<TreeData[]> {
        if (this.jobManager.address === 'test:1234') {
            return [

            ];
        }

        let url = `${this.jobManager.address}/v1/jars`;

        return axios.get(url)
            .then(response => {
                let result = response.data as JarListInfo;

                return result.files!.map((file: JarFileInfo) => new Jar(this.jobManager, file.id!, file.name!));
            })
            .catch(error => {
                return [new Description(`(error when calling ${url} - status code ${error.response.status})`)];
            });
    }
}
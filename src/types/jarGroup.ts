import 'isomorphic-fetch';

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

        return fetch(`${this.jobManager.address}/v1/jars`)
            .then(response => {
                if (!response.ok) {
                    return [new Description(`(failed to fetch - status code ${response.status})`)];
                }

                let result = response.json() as Promise<JarListInfo>;

                return result.then(data =>
                    data.files!.map((file: JarFileInfo) => new Jar(this.jobManager, file.id!, file.name!)));
            });
    }
}
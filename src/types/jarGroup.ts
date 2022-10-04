import axios from 'axios';
import FormData = require('form-data');
import * as fs from 'fs';

import { ProviderResult, TreeItem, TreeItemCollapsibleState, window } from "vscode";
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

    addJar() {
        window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                'jars': ['jar'],
            },
            title: 'Add Jar',
        }).then(async uriList => {
            if (undefined === uriList || uriList.length === 0) {
                return;
            }

            let formData = new FormData();
            formData.append('jarfile', fs.createReadStream(uriList[0].fsPath), uriList[0].path);

            let url = `${this.jobManager.address}/v1/jars/upload`;

            axios.post(url, formData, {
                headers: formData.getHeaders(),
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }).then(() => {
                if (this.jobManager.jobManagerDataProvider !== null) {
                    this.jobManager.jobManagerDataProvider.refresh();
                }
            }).catch(error => {
                window.showErrorMessage(`(error when adding jar - status code ${error.response.status})`);
            });
        });
    }

    removeJar(jar: Jar) {
        let url = `${this.jobManager.address}/v1/jars/${jar.id}`;

        axios.delete(url).then(() => {
            if (this.jobManager.jobManagerDataProvider !== null) {
                this.jobManager.jobManagerDataProvider.refresh();
            }
        }).catch(error => {
            window.showErrorMessage(`(error when removing jar - status code ${error.response.status})`);
        });
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

        return axios.get(url).then(response => {
            let result = response.data as JarListInfo;
            return result.files!.map((file: JarFileInfo) => new Jar(this, file.id!, file.name!));
        }).catch(error => {
            return [new Description(`(error when getting jars - status code ${error.response.status})`)];
        });
    }
}
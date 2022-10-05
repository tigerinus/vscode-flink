import { TreeItem, TreeItemCollapsibleState, window } from "vscode";
import { TreeData } from "../treeData";
import { JarGroup } from "./jarGroup";

export class Jar extends TreeData {

    group: JarGroup;

    id: string;
    name: string;

    constructor(group: JarGroup, id: string, name: string) {
        super(name, "Jar");

        this.group = group;

        this.id = id;
        this.name = name;
    }

    run() {
        window.showInputBox({
            prompt: "Please enter the entry class name",
            placeHolder: "e.g. org.apache.flink.examples.java.wordcount.WordCount",
            title: "Run Jar",
            ignoreFocusOut: true,
        }).then(async entryClass => {
            console.log(entryClass); // TODO
        });
    }

    getTreeItem(): TreeItem {
        let treeItem: TreeItem = new TreeItem(this.text, TreeItemCollapsibleState.None);

        treeItem.contextValue = 'jar';
        treeItem.id = this.id;
        treeItem.tooltip = this.id;

        return treeItem;
    }
}
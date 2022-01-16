import { Event, EventEmitter, ExtensionContext, ProviderResult, TreeDataProvider, TreeItem } from 'vscode';
import { TreeData } from './treeData';
import { Description } from './types/description';
import { JobManager } from './types/jobManager';

type TreeDataType = TreeData | undefined | void;

export class JobManagerDataProvider implements TreeDataProvider<TreeData> {

    private _context: ExtensionContext;

    private _onDidChangeTreeData: EventEmitter<TreeDataType> = new EventEmitter<TreeDataType>();
    readonly onDidChangeTreeData: Event<TreeDataType> = this._onDidChangeTreeData.event;

    constructor(context: ExtensionContext) {
        this._context = context;
    }

    refresh(treeData: TreeDataType): void {
        if (undefined === treeData) {
            this._onDidChangeTreeData.fire();
            return;
        }

        this._onDidChangeTreeData.fire(treeData);
    }

    getTreeItem(treeData: TreeData): TreeItem | Thenable<TreeItem> {
        return treeData.getTreeItem();
    }

    getChildren(treeData?: TreeData): ProviderResult<TreeData[]> {
        if (undefined === treeData) {
            return this._context.globalState.get('jobManagerList', [])
                .map((object: Object) => {
                    // workaround for deserialization into prototype, or methods will be missing.
                    return Object.assign(new JobManager('', ''), object);
                });
        }

        switch (treeData.type) {
            case 'JobManager':
            case 'JobGroup':
            case 'JarGroup':
                return treeData.getChildren();

            default:
                return [new Description("intenal error")];
        }
    }
}
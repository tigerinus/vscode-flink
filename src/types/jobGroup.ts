import { ProviderResult, TreeItem, TreeItemCollapsibleState } from "vscode";
import { JobDetails, MultipleJobsDetails } from "../interface/getJobsOverview";
import { TreeData } from "../treeData";
import { Description } from "./description";
import { Job } from "./job";

export class JobGroup extends TreeData {

    address: string;

    constructor(address: string) {
        super(`Jobs`, "JobGroup");

        this.address = address;
    }

    getTreeItem(): TreeItem {
        let treeItem: TreeItem = new TreeItem(this.text, TreeItemCollapsibleState.Collapsed);
        treeItem.contextValue = 'jobgroup';
        return treeItem;
    }

    getChildren(): ProviderResult<TreeData[]> {
        if (this.address === 'test:1234') {
            return [
                new Job("1", "Job 1", "INITIALIZING"),
                new Job("2", "Job 2", "CREATED"),
                new Job("3", "Job 3", "RUNNING"),
                new Job("4", "Job 4", "FAILING"),
                new Job("5", "Job 5", "FAILED"),
                new Job("6", "Job 6", "CANCELLING"),
                new Job("7", "Job 7", "CANCELED"),
                new Job("8", "Job 8", "FINISHED"),
                new Job("9", "Job 9", "RESTARTING"),
                new Job("10", "Job 10", "SUSPENDED"),
                new Job("11", "Job 11", "RECONCILING")
            ];
        }

        return fetch("http://" + this.address + "/v1/jobs/overview").then(response => {
            if (!response.ok) {
                return [new Description("failed to connnect")];
            }

            let result = response.json() as Promise<MultipleJobsDetails>;

            return result.then(data =>
                data.jobs!.map((job: JobDetails) => new Job(job.jid!, job.name!, job.state!)));
        });
    }
}
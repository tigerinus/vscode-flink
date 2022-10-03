import 'isomorphic-fetch';

import { ProviderResult, TreeItem, TreeItemCollapsibleState } from "vscode";
import { JobDetails, MultipleJobsDetails } from "../interface/getJobsOverview";
import { TreeData } from "../treeData";
import { Description } from "./description";
import { Job } from "./job";
import { JobManager } from "./jobManager";

export class JobGroup extends TreeData {

    jobManager: JobManager;

    constructor(jobManager: JobManager) {
        super(`Jobs`, "JobGroup");
        this.jobManager = jobManager;
    }

    getTreeItem(): TreeItem {
        let treeItem: TreeItem = new TreeItem(this.text, TreeItemCollapsibleState.Collapsed);
        treeItem.contextValue = 'jobgroup';
        return treeItem;
    }

    getChildren(): ProviderResult<TreeData[]> {
        if (this.jobManager.address === 'test:1234') {
            return [
                new Job(this.jobManager, "1", "Job 1", "INITIALIZING"),
                new Job(this.jobManager, "2", "Job 2", "CREATED"),
                new Job(this.jobManager, "3", "Job 3", "RUNNING"),
                new Job(this.jobManager, "4", "Job 4", "FAILING"),
                new Job(this.jobManager, "5", "Job 5", "FAILED"),
                new Job(this.jobManager, "6", "Job 6", "CANCELLING"),
                new Job(this.jobManager, "7", "Job 7", "CANCELED"),
                new Job(this.jobManager, "8", "Job 8", "FINISHED"),
                new Job(this.jobManager, "9", "Job 9", "RESTARTING"),
                new Job(this.jobManager, "10", "Job 10", "SUSPENDED"),
                new Job(this.jobManager, "11", "Job 11", "RECONCILING")
            ];
        }

        return fetch(`${this.jobManager.address}/v1/jobs/overview`)
            .then(response => {
                if (!response.ok) {
                    return [new Description(`(failed to fetch - status code ${response.status})`)];
                }

                let result = response.json() as Promise<MultipleJobsDetails>;

                return result.then(data =>
                    data.jobs!.map((job: JobDetails) => new Job(this.jobManager, job.jid!, job.name!, job.state!)));
            });
    }
}
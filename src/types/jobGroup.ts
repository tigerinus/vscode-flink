import axios from 'axios';

import { ProviderResult, TreeItem, TreeItemCollapsibleState } from "vscode";
import { JobDetails, MultipleJobsDetails } from "../interface/jobsOverview";
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
                new Job(this, "1", "Job 1", "INITIALIZING"),
                new Job(this, "2", "Job 2", "CREATED"),
                new Job(this, "3", "Job 3", "RUNNING"),
                new Job(this, "4", "Job 4", "FAILING"),
                new Job(this, "5", "Job 5", "FAILED"),
                new Job(this, "6", "Job 6", "CANCELLING"),
                new Job(this, "7", "Job 7", "CANCELED"),
                new Job(this, "8", "Job 8", "FINISHED"),
                new Job(this, "9", "Job 9", "RESTARTING"),
                new Job(this, "10", "Job 10", "SUSPENDED"),
                new Job(this, "11", "Job 11", "RECONCILING")
            ];
        }

        let url = `${this.jobManager.address}/v1/jobs/overview`;

        return axios.get(url).then(response => {
            let result = response.data as MultipleJobsDetails;

            return result.jobs!.map((job: JobDetails) => new Job(this, job.jid!, job.name!, job.state!));
        }).catch(error => {
            return [new Description(`(error getting jobs - status code ${error.response.status})`)];
        });
    }
}
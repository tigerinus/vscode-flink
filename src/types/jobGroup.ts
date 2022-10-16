import axios from 'axios';

import { ProviderResult, TreeItem, TreeItemCollapsibleState } from "vscode";
import { JobDetails, JobStatus, MultipleJobsDetails, DefaultService } from "@tensorsmart/flink-typescript";
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
                new Job(this, "1", "Job 1", JobStatus.INITIALIZING),
                new Job(this, "2", "Job 2", JobStatus.CREATED),
                new Job(this, "3", "Job 3", JobStatus.RUNNING),
                new Job(this, "4", "Job 4", JobStatus.FAILING),
                new Job(this, "5", "Job 5", JobStatus.FAILED),
                new Job(this, "6", "Job 6", JobStatus.CANCELLING),
                new Job(this, "7", "Job 7", JobStatus.CANCELED),
                new Job(this, "8", "Job 8", JobStatus.FINISHED),
                new Job(this, "9", "Job 9", JobStatus.RESTARTING),
                new Job(this, "10", "Job 10", JobStatus.SUSPENDED),
                new Job(this, "11", "Job 11", JobStatus.RECONCILING)
            ];
        }

        let url = `${this.jobManager.address}/v1/jobs/overview`;

        DefaultService.getJobsOverview()

        return axios.get(url).then(response => {
            let result = response.data as MultipleJobsDetails;

            return result.jobs!.map((job: JobDetails) => new Job(this, job.jobId!, job.jobName!, job.status!));
        }).catch(error => {
            return [new Description(`(error getting jobs - status code ${error.response.status})`)];
        });
    }
}
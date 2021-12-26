export interface MultipleJobsDetails {
    jobs?: JobDetails[]
    [k: string]: unknown
}

export interface JobDetails {
    jid?: string
    name?: string
    state?:
    | "INITIALIZING"
    | "CREATED"
    | "RUNNING"
    | "FAILING"
    | "FAILED"
    | "CANCELLING"
    | "CANCELED"
    | "FINISHED"
    | "RESTARTING"
    | "SUSPENDED"
    | "RECONCILING"
    [k: string]: unknown
}

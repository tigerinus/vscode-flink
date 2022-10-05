export interface JobIdsWithStatusOverview {
    jobs?: JobIdWithStatus[]
    [k: string]: unknown
}

export interface JobIdWithStatus {
    id?: unknown
    status?:
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

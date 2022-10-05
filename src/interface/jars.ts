export interface JarListInfo {
    address?: string;
    files?: JarFileInfo[];
    [k: string]: unknown;
}

export interface JarFileInfo {
    entry?: JarEntryInfo[];
    id?: string;
    name?: string;
    uploaded?: number;
    [k: string]: unknown;
}

export interface JarEntryInfo {
    description?: string;
    name?: string;
    [k: string]: unknown;
}

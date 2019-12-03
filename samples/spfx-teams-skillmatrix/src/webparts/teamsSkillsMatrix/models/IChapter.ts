export interface IChapter {
    title: string;
    members: string[];
    leads: string[];
    capabilities: ICapabilities[];
}

export interface ICapabilities {
    key: number;
    name: string;
    value: any;
}

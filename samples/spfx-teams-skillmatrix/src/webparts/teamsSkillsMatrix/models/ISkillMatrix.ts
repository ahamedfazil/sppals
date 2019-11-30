export interface ISkillMatrix {
    title: string;
    chapter: string;
    member: any;
    squad: string;
    capability: ICapability[];
}

export interface ICapability {
    key: number;
    name: string;
    value: number;
}
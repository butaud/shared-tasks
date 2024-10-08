export type Task = {
    id: number;
    content: string;
    completed: boolean;
}

export type Section = {
    id: number;
    title: string;
    tasks: Task[];
}

export type List = {
    id: number;
    title: string;
    defaultSection: Section;
    sections: Section[];
}
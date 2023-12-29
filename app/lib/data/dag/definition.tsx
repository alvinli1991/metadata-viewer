import { Edge, Node } from "reactflow"

export enum DagType {
    xml = "xml",
    py = "py",
}

export enum PyNodeType {
    unknown = "unknown",
    condition = "condition",
    conditionStart = "conditionStart",
    conditionEnd = "conditionEnd",
    operation = "operation",
    function = "function",
    functionStart = "functionStart",
    functionEnd = "functionEnd",
    functionRef = "functionRef",
    functionRefStart = "functionRefStart",
    functionRefEnd = "functionRefEnd",
}

export type DagMenus = DagMenuItem[];

export type DagMenuItem = {
    project: string,
    dags: DagMenuInfo[],
}

export type DagMenuInfo = {
    id: string,
    fileName: string,
    filePath: string,
    dagType: keyof typeof DagType,
}

export type Dag = {
    id: string,
    project: string,
    fileName: string,
    filePath: string,
    nodes: Node[],
    edges: Edge[],
}
import React from 'react';
import { Handle, Position } from "reactflow"
import clsx from 'clsx';
import { PyNodeType } from '@/app/lib/data/dag/definition';

function XmlNode({ data }: { data: any }) {

    return (
        <div className={clsx("px-4 py-2 shadow-md border-2 border-stone-400", {
            "bg-pink-200 text-slate-600 rounded-full": data?.nodeType === "Stage",
            "bg-white text-slate-600 rounded-md": data?.nodeType !== "Stage",
        })}>
            <div className="flex">
                <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
                    {data?.nodeType}
                </div>
                <div className="ml-2">
                    <div className="text-sm font-bold">{data?.label}</div>
                    <div className="text-gray-500">{data?.desc}</div>
                </div>
            </div>
            <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
            <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
        </div>
    )
}

const PyNodeRepresent: { [key: string]: string } = {
    "functionStart": "函数起",
    "functionEnd": "函数止",
    "functionRefStart": "函数引用起",
    "functionRefEnd": "函数引用止",
    "conditionStart": "条件起",
    "conditionEnd": "条件止",
    "function": "函数",
    "operation": "算子",
    "condition": "条件",
    "args": "传参"
}

function PyNode({ data }: { data: any }) {
    let nodeType = data?.pyNodeType ?? "";


    if (nodeType === PyNodeType.functionStart
        || nodeType === PyNodeType.functionEnd
        || nodeType === PyNodeType.functionRefStart
        || nodeType === PyNodeType.functionRefEnd
        || nodeType === PyNodeType.conditionStart
        || nodeType === PyNodeType.conditionEnd) {

        let functionName = data?.function;
        if (nodeType === PyNodeType.functionRefStart || nodeType === PyNodeType.functionRefEnd) {
            functionName = data?.refFuncCallName;
        }
        return (
            <div className={clsx("rounded-full px-4 py-2 shadow-md border-2 border-stone-400", {
                " bg-green-200 text-slate-600 ": data?.condBranch === "true",
                " bg-pink-200 text-slate-600 ": data?.condBranch === "false",
                "bg-white text-gray-300": data?.condBranch === undefined || data?.condBranch === "",
            })}>
                <div>{PyNodeRepresent[nodeType]}</div>
                <div>{functionName}</div>
                <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
                <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
            </div>
        );
    } else {
        let desc = "";
        if (nodeType === PyNodeType.function) {
            desc = data?.function;
        } else if (nodeType === PyNodeType.operation || nodeType === PyNodeType.condition) {
            desc = data?.refFuncCallName;
        }

        return (
            <div className={clsx("px-4 py-2 shadow-md rounded-md border-2 border-stone-400", [{
                " bg-green-200": data?.condBranch === "true",
                " bg-pink-200": data?.condBranch === "false",
                "bg-white": data?.condBranch === undefined || data?.condBranch === "",
            }])}>
                <div className="flex">
                    <div className="rounded-full w-12 h-12 flex justify-center items-center text-gray-500 bg-gray-100">
                        {PyNodeRepresent[data?.pyNodeType]}
                    </div>
                    <div className="ml-2">
                        <div className="text-sm font-bold text-gray-500">{data?.label}</div>
                        <div className="text-gray-500">{desc}</div>
                        <div className="primary-content">{data?.clz}</div>
                    </div>
                </div>
                <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
                <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
            </div>
        );
    }


}


export { XmlNode, PyNode }
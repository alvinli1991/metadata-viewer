'use client'
import { Node } from "reactflow"
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { clearMenus, selectMenus } from "@/app/lib/features/dag/menuSlice"
import { selectDagNode } from "@/app/lib/features/dag/dagSlice"
import { selectAliveSyncAction, setSyncAction } from "@/app/lib/features/dag/aliveSlice";

const KeyRepresent: { [key: string]: string } = {
    "nodeType": "节点类型",
    "desc": "说明",
    "clz": "类名",
    "conditionClz": "准入条件类",
    "condition": "准入判断条件",
    "inputs": "输入",
    "outputs": "输出",
    "pyNodeType": "Python节点类型",
    "args": "传参",
    "condBranch": "条件分支",
    "refFuncCallName": "引用函数名",
    "function": "函数名",
    "comment": "注解",
    "exp": "实验",
}

export function DetailForm() {
    const selectedDagNode: Node | undefined = useAppSelector(selectDagNode)

    if (selectedDagNode === undefined) {
        return (
            <div className="flex flex-col gap-4 w-full">
                <SyncIdeaAction />
                <div className="badge badge-primary">请选择节点</div>
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
            </div>);
    }

    const nodeType = selectedDagNode?.type;
    if (nodeType === "pyNode") {
        return (<PyDetailForm selectedDagNode={selectedDagNode} />);
    } else {
        return (<XmlDetailForm selectedDagNode={selectedDagNode} />);
    }
}

function XmlDetailForm({ selectedDagNode }: { selectedDagNode: Node }) {
    let dataShow = Object.entries(selectedDagNode.data)
        .filter(([key, value]) => key !== "label" && key !== "inputs" && value !== "" && value !== "{}" && value !== null && value !== undefined)
        .map(([key, value]) => {
            return (<XmlTextInput key={key} xmlData={{ key: key || key, value: value ?? "" }} />)
        });

    return (
        <div className="form-control w-full  gap-y-1.5 px-4">
            <SyncIdeaAction />
            {dataShow}
        </div>
    );
}

function PyDetailForm({ selectedDagNode }: { selectedDagNode: Node }) {
    let dataShow = Object.entries(selectedDagNode.data)
        .filter(([key, value]) => key !== "label" && value !== "" && value !== "{}" && value !== null && value !== undefined)
        .map(([key, value]) => {
            return (<PyTextInput key={key} pyData={{ key: key || key, value: value ?? "" }} />)
        });

    return (
        <div className="form-control w-full max-h-full gap-y-1.5 px-4">
            <SyncIdeaAction />
            <div className="max-h-full overflow-auto">
                {dataShow}
            </div>
        </div>
    );
}

function SyncIdeaAction() {
    const dispatch = useAppDispatch();
    const syncAction = useAppSelector(selectAliveSyncAction);
    return (<div className="form-control w-52">
        <label className="cursor-pointer label">
            <span className="label-text">同步定位IDEA的算子类</span>
            <input type="checkbox" className="toggle toggle-accent" onChange={() => { dispatch(setSyncAction(!syncAction)); }} checked={syncAction} />
        </label>
    </div>);
}

function XmlTextInput({ xmlData = { key: "key", value: "value" } }
    : { xmlData: { key: any, value: any } }) {
    let text = xmlData.value;
    let inputHolder;
    if (text.length > 20) {
        inputHolder = <textarea className="textarea textarea-bordered w-full h-fit" readOnly value={text} />
    } else {
        inputHolder = <input type="text" placeholder="" value={text}
            className="input input-bordered w-full px-2" readOnly />
    }

    return (
        <div className="w-full">
            <div className="label w-full">
                <span className="label-text text-primary">{KeyRepresent[xmlData.key]}</span>
            </div>
            {inputHolder}
        </div>
    );
}

function PyTextInput({ pyData = { key: "key", value: "value" } }
    : { pyData: { key: any, value: any } }) {

    let inputHolder;
    if (pyData.key === "inputs" || pyData.key === "outputs") {
        //split value by ,
        const valueArray = pyData.value.split(",");
        const splitInputHolder = valueArray.map((value: string) => {
            return (<input key={value} type="text" placeholder="" value={value}
                className="input input-bordered w-full px-5" readOnly />);
        });
        inputHolder = <div className="flex flex-col gap-2 pl-3">{splitInputHolder}</div>
    } else if (pyData.key === "args") {
        const argKv: { key: string, value: string } = JSON.parse(pyData.value);
        const argKvArray = Object.entries(argKv)
            .filter(([key, value]) => value !== "" && value !== null && value !== undefined)
            .map(([key, value]) => {
                let valueHolder;
                if (key === "exp") {
                    const exps = value.split(";").map((exp: string) => {
                        if (exp.length > 20) {
                            return (<textarea key={exp} className="textarea textarea-bordered w-full h-fit" readOnly value={exp} />)
                        } else {
                            return (<input key={exp} type="text" placeholder="" value={exp}
                                className="input input-bordered w-full px-2" readOnly />)
                        }
                    });
                    valueHolder = <div className="basis-3/4 pl-2">{exps}</div>
                } else {
                    if (value.length > 20) {
                        valueHolder = <textarea className="basis-3/4 textarea textarea-bordered w-full h-fit" readOnly value={value} />
                    } else {
                        valueHolder = <input type="text" placeholder="" value={value}
                            className="basis-3/4 input input-bordered w-full px-2" readOnly />


                    }
                }
                return (
                    <div key={key} className="flex flex-row space-x-1">
                        <div className="label w-full basis-1/4 select-text"> <span className="label-text ">{key}</span></div>
                        {valueHolder}
                    </div>
                )
            });
        inputHolder = <div className="flex flex-col gap-2 pl-3">{argKvArray}</div>
    } else {
        let text = pyData.value;
        if (text.length > 20) {
            inputHolder = <textarea className="textarea textarea-bordered w-full h-fit" readOnly value={text} />
        } else {
            inputHolder = <input type="text" placeholder="" value={text}
                className="input input-bordered w-full px-2" readOnly />
        }
    }

    return (
        <div className="w-full">
            <div className="label w-full">
                <span className="label-text text-primary">{KeyRepresent[pyData.key]}</span>
            </div>
            {inputHolder}
        </div>
    );
}
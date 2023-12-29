'use client'

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    ReactFlowProvider,
    Panel,
    Node,
    useReactFlow,
    useNodesInitialized, useOnSelectionChange, NodeChange, EdgeChange, Connection
} from 'reactflow';
import { XmlNode, PyNode } from "@/app/ui/dag/component/node";
import { defaultEdgeOptions, fitViewOptions } from "@/app/ui/dag/config/dagConfig";
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks';
import {
    setNodes,
    setEdges, selectNodes, selectEdges, onNodesChange,
    onEdgesChange,
    onConnect,
    chooseNode,
    jumpToNode,
    selectActiveDag,
    fetchDag,
    clearDag,
    clearNode,
    setSearchNode,
    selectSearchNode
} from "@/app/lib/features/dag/dagSlice"
import { selectAlivePort, selectAliveSyncAction } from "@/app/lib/features/dag/aliveSlice"


import 'reactflow/dist/style.css';
import { LayoutFunction } from '@/app/ui/dag/layout/nodeLayout';
// import DownloadButton from '@/app/ui/dag/component/downloadButton';
import { selectActiveMenu, selectMenus } from '@/app/lib/features/dag/menuSlice';
import { DagMenuInfo } from '@/app/lib/data/dag/definition';
import { useDebouncedCallback } from 'use-debounce';

const nodeTypes = { XmlNode: XmlNode, PyNode: PyNode };

const LayoutFlow = ({
    className,
    layoutFn,
}: {
    className?: string;
    layoutFn: LayoutFunction;
}) => {
    //get current DOM element
    const flowRef = useRef(null);
    const dispatch = useAppDispatch();

    const { fitView, getNodes, setCenter } = useReactFlow();
    // const nodeTypes = useMemo(() => ({ XmlNode: XmlNode, PyNode: PyNode }), [])
    const initialNodes = useAppSelector(selectNodes);
    const initialEdges = useAppSelector(selectEdges);
    const port = useAppSelector(selectAlivePort);
    const theActiveDag = useAppSelector(selectActiveDag);
    const syncAction = useAppSelector(selectAliveSyncAction);
    const searchNodeInfo = useAppSelector(selectSearchNode);

    const menus = useAppSelector(selectMenus);
    const activeMenu: DagMenuInfo | undefined = useAppSelector(selectActiveMenu);

    //layout just after nodes are initialized
    const options = {
        includeHiddenNodes: false,
    };

    const nodesInitialized = useNodesInitialized(options);
    useEffect(() => {
        if (nodesInitialized) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = layoutFn(initialNodes, initialEdges, { direction: "TB" });
            dispatch(setNodes([...layoutedNodes]));
            dispatch(setEdges([...layoutedEdges]));
            window.requestAnimationFrame(() => {
                fitView(fitViewOptions);
            });
        }
    }, [nodesInitialized]);

    const handleOnSearchNode = useDebouncedCallback((term: string) => {
        dispatch(setSearchNode(term));
    }, 300);

    const locateToNode = () => {
        if (searchNodeInfo !== undefined && searchNodeInfo !== null && searchNodeInfo !== "") {
            let node = initialNodes.find((node: Node) => {
                return searchNodeInfo === node.id
                    || searchNodeInfo === node.data?.clz
                    || searchNodeInfo === node.data?.name
                    || searchNodeInfo === node.data?.function
                    || searchNodeInfo === node.data?.refFuncCallName;
            });

            if (node !== undefined) {
                dispatch(chooseNode(node));
                setCenter(node.position.x, node.position.y, { duration: 800, zoom: 1.1 });
            }
        }
    };
    const onLayout = useCallback(
        (direction: any) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = layoutFn(initialNodes, initialEdges, { direction: direction });
            dispatch(setNodes([...layoutedNodes]));
            dispatch(setEdges([...layoutedEdges]));
            window.requestAnimationFrame(() => {
                fitView(fitViewOptions);
            });

        },
        [initialNodes, initialEdges]
    );

    useOnSelectionChange({
        "onChange": ({ nodes, edges }) => {
            if (nodes.length > 0) {
                const theNode = nodes[0];
                dispatch(chooseNode(theNode));
                if (theNode.data?.clz !== "" && syncAction) {
                    dispatch(jumpToNode({ port: port, project: theActiveDag?.project, node: theNode }));
                }
            }
        }
    });

    return (
        <ReactFlow
            className={`${className}`}
            nodes={initialNodes}
            edges={initialEdges}
            onNodesChange={(changes: NodeChange[]) => dispatch(onNodesChange(changes))}
            onEdgesChange={(changes: EdgeChange[]) => dispatch(onEdgesChange(changes))}
            onConnect={(connection: Connection) => dispatch(onConnect(connection))}
            nodeTypes={nodeTypes}
            // fitView
            // fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
            ref={flowRef}
        >
            <Panel position="top-right" className='space-y-1 flex flex-col'>
                <button className='btn btn-primary' onClick={() => {
                    dispatch(clearDag());
                    dispatch(clearNode());
                    dispatch(fetchDag({
                        port: port, project: menus[0].project ?? ""
                        , fileName: activeMenu?.fileName ?? ""
                        , filePath: activeMenu?.filePath ?? ""
                        , dagType: activeMenu?.dagType ?? ""
                    }));
                }}>刷新DAG</button>
                {/* <button className='btn' onClick={() => onLayout('TB')}>vertical</button>
                <button className='btn' onClick={() => onLayout('LR')}>horizontal</button> */}
                <div className='flex space-x-1'>
                    <button className='btn btn-secondary' onClick={() => {
                        locateToNode();
                    }}>定位</button>
                    <input className='input input-bordered input-secondary w-fit max-w-xs bg-slate-50' type="text" placeholder="输入类名、函数名" onChange={(e) => {
                        handleOnSearchNode(e.target.value);
                    }} />

                </div>



            </Panel>
            <Controls >
                {/* <DownloadButton /> */}
            </Controls>
            <MiniMap pannable zoomable />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
    );
};

export default function LayoutDag({
    className,
    layoutFn,
}: {
    className?: string;
    layoutFn: LayoutFunction
}) {
    return (
        <ReactFlowProvider>
            <LayoutFlow className={`${className}`}
                layoutFn={layoutFn} />
        </ReactFlowProvider>
    );
}
'use client'

import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    ReactFlowProvider,
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
    Edge, Node, useNodesInitialized,
} from 'reactflow';
import { XmlNode } from "@/app/ui/dag/component/node";
import { defaultEdgeOptions, fitViewOptions } from "@/app/ui/dag/config/dagConfig";

import 'reactflow/dist/style.css';
import { LayoutAlgorithm, LayoutFunction, layoutFunctionMap, getLayoutAlgorithm } from './layout/nodeLayout';

const LayoutFlow = ({
    initialNodes,
    initialEdges,
    className,
}: {
    initialNodes: Node[];
    initialEdges: Edge[];
    className?: string;
}) => {
    const { fitView } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const nodeTypes = useMemo(() => ({ XmlNode: XmlNode }), [])


    //layout just after nodes are initialized
    const options = {
        includeHiddenNodes: false,
    };

    const nodesInitialized = useNodesInitialized(options);
    useEffect(() => {
        if (nodesInitialized) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutAlgorithm(LayoutAlgorithm.DAGRE)(nodes, edges, { direction: "TB" });
            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
            window.requestAnimationFrame(() => {
                fitView();
            });
        }
    }, [nodesInitialized]);


    const onLayout = useCallback(
        (layout: LayoutAlgorithm, layoutFuncMap: layoutFunctionMap, options: any) => {
            const layouted = layoutFuncMap(layout)(nodes, edges, options);

            setNodes([...layouted.nodes]);
            setEdges([...layouted.edges]);

            window.requestAnimationFrame(() => {
                fitView();
            });
        },
        [nodes, edges]
    );

    const layoutBtns = Object.values(LayoutAlgorithm).map((value, index) => {
        return (<button key={index} className='btn' onClick={() => onLayout(value, getLayoutAlgorithm, { direction: "TB" })}>{value}</button>)
    })

    return (
        <ReactFlow
            className={`${className}`}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={fitViewOptions}
            defaultEdgeOptions={defaultEdgeOptions}
        >
            <Panel position="top-right">
                {layoutBtns}
            </Panel>
            <Controls />
            <MiniMap pannable zoomable />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
    );
};

export default function AllLayoutDag({
    nodes,
    edges,
    className,
}: {
    nodes: Node[];
    edges: Edge[];
    className?: string;
}) {
    return (
        <ReactFlowProvider>
            <LayoutFlow className={`${className}`}
                initialNodes={nodes}
                initialEdges={edges}
            />
        </ReactFlowProvider>
    );
}
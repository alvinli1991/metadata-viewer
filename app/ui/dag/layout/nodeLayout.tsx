
import Graph from 'graphology';
import Dagre from '@dagrejs/dagre';
import noverlap from 'graphology-layout-noverlap';
import {
    Edge, Node
} from 'reactflow';

export enum LayoutAlgorithm {
    DAGRE = "dagre",
    GRAPHOLOGY_NOVERLAP = "graphology-noverlap",
    NOVERLAP_DAGRE = "noverlap-dagre",
}

export type LayoutFunction = (nodes: Node[], edges: Edge[], options: any) => { nodes: Node[], edges: Edge[], options: any };
export type layoutFunctionMap = (algorithm: LayoutAlgorithm) => LayoutFunction;

const LAYOUTS: { [key in LayoutAlgorithm]: LayoutFunction } = {
    [LayoutAlgorithm.DAGRE]: dagreLayout,
    [LayoutAlgorithm.GRAPHOLOGY_NOVERLAP]: graphologyNoverlapLayout,
    [LayoutAlgorithm.NOVERLAP_DAGRE]: (nodes: Node[], edges: Edge[], options: any) => graphologyNoverlapLayout(dagreLayout(nodes, edges, options).nodes, edges, options)
};

export function getLayoutAlgorithm(algorithm: LayoutAlgorithm): LayoutFunction {
    //get layout function from LAYOUTS by name
    return LAYOUTS[algorithm];
}

function dagreLayout(nodes: Node[], edges: Edge[], options: any) {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction, nodesep: 100, edgesep: 80 });
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) => {
        const { width, height, ...rest } = node;
        g.setNode(node.id, { width: width || 0, height: height || 0, ...rest });
    });
    Dagre.layout(g);
    return {
        nodes: nodes.map((node) => {
            const { x, y } = g.node(node.id);
            return { ...node, position: { x, y } };
        }),
        edges,
        options
    };
}

function graphologyNoverlapLayout(nodes: Node[], edges: Edge[], options: any) {
    const graph = new Graph();
    nodes.forEach((node) => graph.addNode(node.id, node.position));
    edges.forEach((edge) => graph.addEdge(edge.source, edge.target));
    const positions = noverlap(graph, {
        maxIterations: 100,
        settings: {
            ratio: 2,
            margin: 10
        }
    });
    noverlap.assign(graph);
    return {
        nodes: nodes.map((node) => {
            const x = graph.getNodeAttribute(node.id, "x");
            const y = graph.getNodeAttribute(node.id, "y");
            return { ...node, position: { x, y } };
        }),
        edges,
        options
    };
}

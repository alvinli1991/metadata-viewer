import { DefaultEdgeOptions, FitViewOptions, MarkerType } from "reactflow";

export const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#FF0072',

    },
};

export const fitViewOptions: FitViewOptions = {
    padding: 0.2,
};
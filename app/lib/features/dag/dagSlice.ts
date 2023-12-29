import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Edge,
  Node,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { DagType, Dag } from "@/app/lib/data/dag/definition";
import axios from "axios";

export const dagSlice = createSlice({
  name: "dag",
  initialState: {
    status: "idle" as "idle" | "loading" | "succeeded" | "failed",
    error: null as string | null | undefined,
    activeDag: {} as Dag | undefined,
    selectedNode: undefined as Node | undefined,
    nodes: [] as Node[],
    edges: [] as Edge[],
    searchNode: "" as string,
  },
  reducers: {
    clearNode: (state) => {
      state.selectedNode = undefined;
    },
    clearDag: (state) => {
      state.activeDag = undefined;
      state.nodes = [];
      state.edges = [];
    },
    chooseNode: (state, action) => {
      state.selectedNode = action.payload;
    },
    setNodes: (state, action) => {
      if (state.activeDag !== undefined) {
        state.nodes = action.payload;
        state.activeDag.nodes = action.payload;
      }
    },
    setEdges: (state, action) => {
      if (state.activeDag !== undefined) {
        state.edges = action.payload;
        state.activeDag.edges = action.payload;
      }
    },
    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    onEdgesChange: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    onConnect: (state, action) => {
      state.edges = addEdge(action.payload, state.edges);
    },
    setSearchNode: (state, action) => {
      state.searchNode = action.payload;
    },
    setDagStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDag.fulfilled, (state, action) => {
        state.activeDag = action.payload;
        state.nodes = action.payload.nodes ?? [];
        state.edges = action.payload.edges ?? [];
        state.status = "succeeded";
      })
      .addCase(fetchDag.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchDag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const fetchDag = createAsyncThunk(
  "dag/fetchDag",
  async ({
    port,
    project,
    fileName,
    filePath,
    dagType,
  }: {
    port: number;
    project: string;
    fileName: string;
    filePath: string;
    dagType: string;
  }) => {
    const url = `http://127.0.0.1:${port}/api.dag`;
    const response = await axios.get(url, {
      params: {
        func: "GET_DAG_META",
        project: project,
        file_name: fileName,
        file_path: filePath,
        dag_type: dagType,
      },
    });
    return response.data;
  }
);

export const jumpToNode = createAsyncThunk(
  "dag/jumpTo",
  async ({
    port,
    project,
    node,
  }: {
    port: number;
    project: string;
    node: Node;
  }) => {
    const url = `http://127.0.0.1:${port}/api.jumpTo`;
    const response = await axios.get(url, {
      params: {
        dag_type: node.data?.dagType ?? DagType.xml,
        id: node.data?.clz ?? "",
        project: project,
      },
    });
    return response.data;
  }
);

export const selectDagStatus = (state: any) => state.dag.status;
export const selectDagError = (state: any) => state.dag.error;
export const selectActiveDag = (state: any) => state.dag.activeDag;
export const selectNodes = (state: any) => state.dag.nodes;
export const selectEdges = (state: any) => state.dag.edges;
export const selectDagNode = (state: any) => state.dag.selectedNode;
export const selectSearchNode = (state: any) => state.dag.searchNode;

export const {
  clearNode,
  clearDag,
  chooseNode,
  setNodes,
  setEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setSearchNode,
  setDagStatus,
} = dagSlice.actions;
export default dagSlice.reducer;

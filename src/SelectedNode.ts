import {createContext} from "react";

export interface SelectedNode {
    selectedNodeId: number | null;
    setSelectedNodeId: (id: number | null) => void;
}

export const SelectedNodeContext = createContext<SelectedNode>({
    selectedNodeId: null,
    setSelectedNodeId: () => {}
})
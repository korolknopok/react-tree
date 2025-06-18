import {create} from 'zustand';
import {treeData, type TreeData} from "./data/treeData.ts";
import {produce} from "immer";

interface NodeState {
    selectedNodeId: number | null;
    setSelectedNodeId: (id: number | null) => void;
    tree: TreeData[],
    counter: number,
    addChildToNode: (parentId: number | null) => void,
    deleteNodeById: (id: number | null) => void,
    editNode: (id: number | null, newName: string) => void,
    reset: () => void,
}

export const useNodeStore = create<NodeState>((set) => ({
    selectedNodeId: null,
    setSelectedNodeId: (id) => set({selectedNodeId: id}),
    tree: treeData,
    counter: 5,
    addChildToNode: (parentId) =>
        set(
            produce((state: NodeState) => {
                const newNode = {id: state.counter, name: `Node ${state.counter}`};
                if (parentId === null) {
                    state.tree.push(newNode);
                } else {
                    const walkAndAdd = (nodes: TreeData[]) => {
                        for (let node of nodes) {
                            if (node.id === parentId) {
                                if (!node.children) node.children = [];
                                node.children.push(newNode);
                                return;
                            }
                            if (node.children) walkAndAdd(node.children);
                        }
                    };
                    walkAndAdd(state.tree);
                }
                state.counter += 1;
            })
        ),
    deleteNodeById: (id: number | null) =>
        set(
            produce((state: NodeState) => {
                if (id === null) return;
                const walkAndRemove = (nodes: TreeData[]) => {
                    for (let i = 0; i < nodes.length; i++) {
                        if (nodes[i].id === id) {
                            nodes.splice(i, 1);
                            return;
                        }
                        if (nodes[i].children) walkAndRemove(nodes[i].children);
                    }
                };
                walkAndRemove(state.tree);
                state.selectedNodeId = null;
            })
        ),
    editNode: (id: number | null, newName: string) =>
        set(
            produce((state: NodeState) => {
                if (id === null) return;
                const walkAndEdit = (nodes: TreeData[]) => {
                    for (let node of nodes) {
                        if (node.id === id) {
                            node.name = newName;
                            return;
                        }
                        if (node.children) walkAndEdit(node.children);
                    }
                };
                walkAndEdit(state.tree);
            })
        ),
    reset: () => set({
        tree: treeData,
        selectedNodeId: null,
        counter: 5,
    }),
}));
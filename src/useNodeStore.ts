import {create} from 'zustand';
import {treeData, type TreeData} from "./data/treeData.ts";

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

export const useNodeStore = create<NodeState>((set, get) => ({
    selectedNodeId: null,
    setSelectedNodeId: (id) => set({selectedNodeId: id}),
    tree: JSON.parse(JSON.stringify(treeData)),
    counter: 5,
    addChildToNode: (parentId) => {
        const newNode = {id: get().counter, name: `Node ${get().counter}`};
        set((state) => {
            const updatedTree = JSON.parse(JSON.stringify(state.tree));
            const walkAndAdd = (nodes: TreeData[]) => {
                if (parentId === null) {
                    nodes.push(newNode);
                    return;
                }
                for (let node of nodes) {
                    if (node.id === parentId) {
                        if (!node.children)
                            node.children = [];
                        node.children.push(newNode);
                        return;
                    }
                    if (node.children) walkAndAdd(node.children);
                }
            };
            walkAndAdd(updatedTree);
            return {tree: updatedTree, counter: state.counter + 1};
        })
    },
    deleteNodeById: (id: number | null) => {
        if (id === null) return;
        set((state) => {
            const updatedTree = JSON.parse(JSON.stringify(state.tree));
            const walkAndRemove = (nodes: TreeData[]) => {
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].id === id) {
                        nodes.splice(i, 1);
                        return;
                    }
                    if (nodes[i].children) walkAndRemove(nodes[i].children);
                }
            };
            walkAndRemove(updatedTree);
            return {tree: updatedTree, selectedNodeId: null};
        })
    },
    editNode: (id: number | null, newName: string) => {
        if (id === null) return;
        set((state) => {
            const updatedTree = JSON.parse(JSON.stringify(state.tree));
            const walkAndEdit = (nodes: TreeData[]) => {
                for (let node of nodes) {
                    if (node.id === id) {
                        node.name = newName;
                        return;
                    }
                    if (node.children) walkAndEdit(node.children);
                }
            };
            walkAndEdit(updatedTree);
            return {tree: updatedTree}
        })
    },
    reset: () => set({
        tree: JSON.parse(JSON.stringify(treeData)),
        selectedNodeId: null,
    }),
}));
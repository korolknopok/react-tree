import {create} from 'zustand';
import {treeData, type TreeData} from "../data/treeData.ts";
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
    editingNodeId: number | null,
    setEditingNodeId: (id: number | null) => void;
}

const findNode = (
    nodes: TreeData[],
    id: number,
): TreeData | null => {
    for (const node of nodes) {
        if (node.id === id) {
            return node;
        }
        if (node.children?.length) {
            const result = findNode(node.children, id);
            if (result) {
                return result
            }
        }
    }
    return null;
};

const findMaxId = (nodes: TreeData[]): number => {
    return nodes.reduce((maxId, node) => {
        const childMaxId = node.children ? findMaxId(node.children) : 0;
        return Math.max(maxId, node.id, childMaxId);
    }, 0);
};

export const useNodeStore = create<NodeState>((set) => {
    const initialCounter = findMaxId(treeData) + 1;

    return {
        selectedNodeId: null,
        setSelectedNodeId: (id) => set({selectedNodeId: id}),
        tree: treeData,
        counter: initialCounter,
        addChildToNode: (parentId) =>
            set(
                produce((state: NodeState) => {
                    const newId = state.counter;
                    const newNode = {
                        id: state.counter,
                        name: '',
                        parentId: parentId === null ? undefined : parentId,
                        children: [],
                    };
                    if (parentId === null) {
                        state.tree.push(newNode);
                    } else {
                        const node = findNode(state.tree, parentId);
                        if (node) {
                            if (!node.children) node.children = [];
                            node.children.push(newNode);
                        }
                    }
                    state.counter += 1;
                    state.editingNodeId = newId;
                })
            ),
        deleteNodeById: (id: number | null) =>
            set(
                produce((state: NodeState) => {
                    if (id === null) return;
                    const node = findNode(state.tree, id);
                    if (!node) return;
                    if (node.parentId) {
                        const parent = findNode(state.tree, node.parentId);
                        if (parent) {
                            parent.children = parent.children.filter(child => child.id !== id);
                        }
                    } else {
                        state.tree = state.tree.filter(n => n.id !== id);
                    }
                    state.selectedNodeId = null;
                })
            ),
        editNode: (id: number | null, newName: string) =>
            set(
                produce((state: NodeState) => {
                    if (id === null) return;
                    const node = findNode(state.tree, id);
                    if (node) {
                        node.name = newName;
                    }
                })
            ),
        reset: () => set({
            tree: treeData,
            selectedNodeId: null,
            counter: initialCounter,
        }),
        editingNodeId: null,
        setEditingNodeId: (id) => set({editingNodeId: id})
    };
});
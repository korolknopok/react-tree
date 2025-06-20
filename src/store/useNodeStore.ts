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

const findNodeAndParent = (
    nodes: TreeData[],
    id: number
): { node: TreeData | null; parent: TreeData | null; parentArray: TreeData[] | null; index: number } => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
            return {node: nodes[i], parent: null, parentArray: nodes, index: i};
        }
        if (nodes[i].children) {
            const result = findNodeAndParent(nodes[i].children, id);
            if (result.node) {
                return {...result, parent: nodes[i]};
            }
        }
    }
    return {node: null, parent: null, parentArray: null, index: -1};
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
        setSelectedNodeId: (id) => set({ selectedNodeId: id }),
        tree: treeData,
        counter: initialCounter,
        addChildToNode: (parentId) =>
            set(
                produce((state: NodeState) => {
                    const newId = state.counter;
                    const newNode = {
                        id: state.counter,
                        name: '',
                        children: [],
                    };
                    if (parentId === null) {
                        state.tree.push(newNode);
                    } else {
                        const { node } = findNodeAndParent(state.tree, parentId);
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
                    const { parentArray, index } = findNodeAndParent(state.tree, id);
                    if (parentArray && index !== -1) {
                        parentArray.splice(index, 1);
                        state.selectedNodeId = null;
                    }
                })
            ),
        editNode: (id: number | null, newName: string) =>
            set(
                produce((state: NodeState) => {
                    if (id === null) return;
                    const { node } = findNodeAndParent(state.tree, id);
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
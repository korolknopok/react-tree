import './App.css';
import {Tree} from "./components/Tree/Tree.tsx";
import {type TreeData, treeData} from "./data/treeData.ts";
import {useState} from "react";
import {useNodeStore} from "./useNodeStore.ts";

export const App = () => {
    const [tree, setTree] = useState<TreeData[]>(JSON.parse(JSON.stringify(treeData)));
    const [counter, setCounter] = useState<number>(5);

    const addChildToNode = (parentId: number | null, newNode: TreeData) => {
        const updatedTree = JSON.parse(JSON.stringify(tree));
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
        setTree(updatedTree);
    }

    const handleAdd = () => {
        const newNode: TreeData = {
            id: counter,
            name: `Node ${counter}`,
        };
        addChildToNode(useNodeStore.getState().selectedNodeId, newNode);
        setCounter(counter + 1);
    }

    return (
        <div className="app">
            <div className="container">
                <h2>Tree</h2>
                <Tree data={tree}/>
                <div className="buttons">
                    <button onClick={handleAdd}> Add</button>
                </div>
            </div>
        </div>
    );
};
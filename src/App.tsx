import './App.css';
import {Tree} from "./components/Tree/Tree.tsx";
import {useNodeStore} from "./useNodeStore.ts";
import {memo, useCallback} from "react";

export const App = memo(() => {
    const {tree, selectedNodeId, addChildToNode, deleteNodeById, editNode, reset} = useNodeStore();


    const handleAdd = useCallback(() => {
        addChildToNode(selectedNodeId);
    }, [selectedNodeId, addChildToNode]);

    const handleRemove = useCallback(() => {
        deleteNodeById(selectedNodeId);
    },[selectedNodeId, deleteNodeById]);

    const handleEdit = useCallback(() => {
        const newName = prompt('Enter new name:')?.trim() || 'Node';
        editNode(selectedNodeId, newName);
    }, [selectedNodeId, editNode]);

    const handleReset = useCallback(() => {
        reset();
    }, [reset]);

    return (
        <div className="app">
            <div className="container">
                <h2>Tree</h2>
                <Tree data={tree}/>
                <div className="buttons">
                    <button onClick={handleAdd}> Add</button>
                    <button onClick={handleRemove} disabled={selectedNodeId === null}> Delete</button>
                    <button onClick={handleEdit} disabled={selectedNodeId === null}> Edit</button>
                    <button onClick={handleReset}> Reset</button>
                </div>
            </div>
        </div>
    );
});
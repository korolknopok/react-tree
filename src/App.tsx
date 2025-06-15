import './App.css';
import {Tree} from "./components/Tree/Tree.tsx";
import {useNodeStore} from "./useNodeStore.ts";

export const App = () => {
    const {tree, selectedNodeId, addChildToNode, deleteNodeById, editNode, reset} = useNodeStore();


    const handleAdd = () => {
        addChildToNode(selectedNodeId);
    }

    const handleRemove = () => {
        deleteNodeById(selectedNodeId);
    }

    const handleEdit = () => {
        const newName = prompt('Enter new name:')?.trim() || 'Node';
        editNode(selectedNodeId, newName);
    }

    const handleReset = () => {
        reset();
    }

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
};
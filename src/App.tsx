import './App.css';
import {Tree} from "./components/Tree/Tree.tsx";
import {treeData} from "./data/treeData.ts";
import {SelectedNodeContext} from "./SelectedNode.ts";
import {useState} from "react";

const App = () => {
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

    return (
        <div className="app">
            <div className="container">
                <h2>Tree</h2>
                <SelectedNodeContext.Provider value={{selectedNodeId, setSelectedNodeId}}>
                    <Tree data={treeData}/>
                </SelectedNodeContext.Provider>
            </div>
        </div>
    );
};

export default App;
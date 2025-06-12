import './App.css';
import {Tree} from "./components/Tree/Tree.tsx";
import {treeData} from "./data/treeData.ts";

const App = () => {
    return (
        <div className="app">
            <div className="container">
                <h2>Tree</h2>
                    <Tree data={treeData}/>
            </div>
        </div>
    );
};

export default App;
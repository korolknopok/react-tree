import type {TreeData} from "../../data/treeData.ts";
import './TreeNode.css';
import {useNodeStore} from "../../useNodeStore.ts";

interface TreeNodeProps {
    id: number;
    name: string;
    children?: TreeData[];
}

export const TreeNode =({id, name, children}: TreeNodeProps) => {
    const  {selectedNodeId, setSelectedNodeId} = useNodeStore();

    const handleNodeClick = () => {
        setSelectedNodeId(selectedNodeId === id ? null : id);
    }

    return (
        <div className="node">
            <label
                className={`node-label ${selectedNodeId === id ? "selected" : ''}`}
                onClick={handleNodeClick}
            >
                {name}
            </label>
            {children && children.length > 0 && (
                <ul className="node-children">
                    {children.map((child) => (
                        <li key={child.id}>
                            <TreeNode
                                id={child.id}
                                name={child.name}
                                children={child.children}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
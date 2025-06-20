import type {TreeData} from "../../data/treeData.ts";
import './TreeNode.css';
import {useNodeStore} from "../../store/useNodeStore.ts";
import {memo} from "react";

interface TreeNodeProps {
    id: number;
    name: string;
    children?: TreeData[];
}

export const TreeNode = memo(({id, name, children}: TreeNodeProps) => {
    const selectedNodeId = useNodeStore(state => state.selectedNodeId)
    const setSelectedNodeId = useNodeStore(state => state.setSelectedNodeId)

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
});
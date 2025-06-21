import type {TreeData} from "../../data/treeData.ts";
import './TreeNode.css';
import {useNodeStore} from "../../store/useNodeStore.ts";
import React, {memo, useEffect, useRef, useState} from "react";

interface TreeNodeProps {
    id: number;
    name: string;
    parentId?: number;
    children: TreeData[];
}

export const TreeNode = memo(({id, name, children}: TreeNodeProps) => {
    const isSelected = useNodeStore(state => state.selectedNodeId === id);
    const setSelectedNodeId = useNodeStore(state => state.setSelectedNodeId);
    const isEditing = useNodeStore(state => state.editingNodeId === id);
    const setEditingNodeId = useNodeStore(state => state.setEditingNodeId);
    const editNode = useNodeStore(state => state.editNode);

    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState(name);
    const [previousName, setPreviousName] = useState(name);

    useEffect(() => {
        if (isEditing) {
            setInputValue(name);
            setPreviousName(name);
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing, name]);

    const handleNodeClick = () => {
        setSelectedNodeId(id);
    }

    const handleDoubleClick = () => {
        setSelectedNodeId(id);
        setEditingNodeId(id);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }

    const finishEditing = () => {
        const newName = inputValue.trim();
        if (newName === '') {
            if (previousName === '') {
                useNodeStore.getState().deleteNodeById(id);
            } else {
                editNode(id, previousName);
            }
        } else {
            editNode(id, newName);
        }
        setEditingNodeId(null);
    }

    const handleInputBlur = () => {
        finishEditing();
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            finishEditing();
        }
    }

    return (
        <div className="node">
            {isEditing ? (
                <input
                    role="textbox"
                    type="text"
                    className={`node-label ${isSelected ? "selected" : ''}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    ref={inputRef}
                />
            ) : (
                <label
                    className={`node-label ${isSelected ? "selected" : ''}`}
                    onClick={handleNodeClick}
                    onDoubleClick={handleDoubleClick}
                >
                    {name}
                </label>
            )}

            {children && children.length > 0 && (
                <p className="node-children">
                    {children.map((child) => (
                        <li key={child.id}>
                            <TreeNode
                                id={child.id}
                                name={child.name}
                                parentId={id}
                                children={child.children}
                            />
                        </li>
                    ))}
                </p>
            )}
        </div>
    )
});
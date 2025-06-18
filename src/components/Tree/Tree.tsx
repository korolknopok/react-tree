import type {TreeData} from "../../data/treeData.ts";
import {TreeNode} from "../TreeNode/TreeNode.tsx";
import {memo} from "react";

interface TreeProps {
    data: TreeData[];
}

export const Tree = memo(({ data } : TreeProps) => {
    return (
        <div className="tree">
            {data.map((node) => (
                <TreeNode
                    key={node.id}
                    id={node.id}
                    name={node.name}
                    children={node.children}
                />
            ))}
        </div>
    );
});
import type {TreeData} from "../../data/treeData.ts";

interface TreeProps {
    data: TreeData[];
}

export const Tree = ({ data } : TreeProps) => {
    return (
        <div className="tree">
            {data.map((node) => (
                <div key={node.id}> {node.name} </div>
            ))}
        </div>
    );
};
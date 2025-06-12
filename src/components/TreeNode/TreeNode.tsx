import type {TreeData} from "../../data/treeData.ts";

interface TreeNodeProps {
    id: number;
    name: string;
    children?: TreeData[];
}

export const TreeNode =({id, name, children}: TreeNodeProps) => {
    return (
        <div className="node">
            <label className="node-label">{name}</label>
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
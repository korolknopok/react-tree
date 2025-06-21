export interface TreeData {
    id: number;
    name: string;
    parentId?: number;
    children: TreeData[];
}

export const treeData: TreeData[] = [
    {
        id: 1,
        name: 'Node 1',
        children: [
            {
                id: 2,
                name: 'Node 2',
                parentId: 1,
                children: [
                    {
                        id: 3,
                        name: 'Node 3',
                        parentId: 2,
                        children: []
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        name: 'Node 4',
        children: []
    },
];
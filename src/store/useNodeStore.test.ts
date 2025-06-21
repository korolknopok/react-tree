import {useNodeStore} from "./useNodeStore.ts";

jest.mock('../data/treeData', () => ({
    treeData: [
        { id: 1, name: 'Корневой узел 1', children: [{ id: 2, name: 'Дочерний узел 1', children: [] }] },
        { id: 3, name: 'Корневой узел 2', children: [{ id: 4, name: 'Дочерний узел 2', children: [] }] },
        { id: 5, name: 'Корневой узел 3', children: [] },
    ],
}));

describe('useNodeStore', () => {
    beforeEach(() => {
        useNodeStore.getState().reset();
    });

    it('Корректная инициализация начального состояния', () => {
        const state = useNodeStore.getState();
        expect(state.selectedNodeId).toBeNull();
        expect(state.counter).toBe(6);
        expect(state.tree).toEqual([
            { id: 1, name: 'Корневой узел 1', children: [{ id: 2, name: 'Дочерний узел 1', children: [] }] },
            { id: 3, name: 'Корневой узел 2', children: [{ id: 4, name: 'Дочерний узел 2', children: [] }] },
            { id: 5, name: 'Корневой узел 3', children: [] },
        ]);
    });

    it('Корректная установка selectedNodeId', () => {
        useNodeStore.getState().setSelectedNodeId(1);
        expect(useNodeStore.getState().selectedNodeId).toBe(1);

        useNodeStore.getState().setSelectedNodeId(null);
        expect(useNodeStore.getState().selectedNodeId).toBeNull();
    });

    it('Добавление нового узла на корневой уровень при parentId = null', () => {
        const initialState = useNodeStore.getState();
        initialState.addChildToNode(null);

        const state = useNodeStore.getState();
        expect(state.tree).toHaveLength(4);
        expect(state.tree[3]).toEqual({ id: 6, name: '', children: [] });
        expect(state.counter).toBe(7);
        expect(state.tree).not.toBe(initialState.tree);
    });

    it('Добавление нового узла как дочерний узел', () => {
        const initialState = useNodeStore.getState();
        initialState.addChildToNode(1);

        const state = useNodeStore.getState();
        const parentNode = state.tree.find((node) => node.id === 1);
        expect(parentNode?.children).toHaveLength(2);
        expect(parentNode?.children?.[1]).toEqual({ id: 6, name: '', children: [] });
        expect(state.counter).toBe(7);
        expect(state.tree).not.toBe(initialState.tree);
    });

    it('Удаление узла и сбрасывание selectedNodeId', () => {
        useNodeStore.getState().setSelectedNodeId(2);
        const initialState = useNodeStore.getState();
        initialState.deleteNodeById(2);

        const state = useNodeStore.getState();
        const parentNode = state.tree.find((node) => node.id === 1);
        expect(parentNode?.children).toHaveLength(0);
        expect(state.selectedNodeId).toBeNull();
        expect(state.tree).not.toBe(initialState.tree);
    });

    it('Не должен удалять при некорректном id', () => {
        const initialState = useNodeStore.getState();
        initialState.deleteNodeById(99);

        const state = useNodeStore.getState();
        expect(state.tree).toEqual(initialState.tree);
    });

    it('Не должен изменять дерево если null', () => {
        const initialState = useNodeStore.getState();
        initialState.deleteNodeById(null);

        const state = useNodeStore.getState();
        expect(state.tree).toEqual(initialState.tree);
    });

    it('Изменение узла', () => {
        const initialState = useNodeStore.getState();
        initialState.editNode(1, 'Обновлённый узел');

        const state = useNodeStore.getState();
        const node = state.tree.find((node) => node.id === 1);
        expect(node?.name).toBe('Обновлённый узел');
        expect(state.tree).not.toBe(initialState.tree);
    });

    it('Не должен изменять узел при некорректном id', () => {
        const initialState = useNodeStore.getState();
        initialState.editNode(99, 'Некорректное значение');

        const state = useNodeStore.getState();
        expect(state.tree).toEqual(initialState.tree);
    });

    it('Сброс стора до начального состояния', () => {
        useNodeStore.getState().setSelectedNodeId(1);
        useNodeStore.getState().addChildToNode(null);
        useNodeStore.getState().deleteNodeById(3);
        useNodeStore.getState().editNode(1, 'Изменено');

        useNodeStore.getState().reset();

        const state = useNodeStore.getState();
        expect(state.selectedNodeId).toBeNull();
        expect(state.counter).toBe(6);
        expect(state.tree).toEqual([
            { id: 1, name: 'Корневой узел 1', children: [{ id: 2, name: 'Дочерний узел 1', children: [] }] },
            { id: 3, name: 'Корневой узел 2', children: [{ id: 4, name: 'Дочерний узел 2', children: [] }] },
            { id: 5, name: 'Корневой узел 3', children: [] },
        ]);
    });
});
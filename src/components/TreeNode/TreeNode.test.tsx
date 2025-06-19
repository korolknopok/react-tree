import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { treeData } from '../../data/treeData';
import { useNodeStore } from '../../useNodeStore';
import { Tree } from '../Tree/Tree';

describe('Tree component', () => {
    beforeEach(() => {
        useNodeStore.setState({ selectedNodeId: null });
    });

    it('Выбор узла по клику', () => {
        render(<Tree data={treeData} />);
        const node1 = screen.getByText('Node 1');
        fireEvent.click(node1);
        expect(node1).toHaveClass('selected');
    });
});
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tree } from './Tree';
import { treeData } from '../../data/treeData';

describe('Tree component', () => {
    it('Визуализация узлов дерева', () => {
        render(<Tree data={treeData} />);
        const node1 = screen.getByText('Node 1');
        const node3 = screen.getByText('Node 3');
        expect(node1).toBeInTheDocument();
        expect(node3).toBeInTheDocument();
    });
});
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNodeStore } from '../../store/useNodeStore';
import { TreeNode } from './TreeNode';

describe('TreeNode component', () => {
    beforeEach(() => {
        useNodeStore.getState().reset();
    });

    it('Отображает узел с правильным именем', () => {
        render(<TreeNode id={1} name="Test Node" children={[]} />);
        expect(screen.getByText('Test Node')).toBeInTheDocument();
        expect(screen.getByText('Test Node')).toHaveClass('node-label');
    });

    it('Выделяет узел при клике', () => {
        render(<TreeNode id={1} name="Test Node" children={[]} />);
        const label = screen.getByText('Test Node');

        fireEvent.click(label);

        expect(label).toHaveClass('selected');
        expect(useNodeStore.getState().selectedNodeId).toBe(1);
    });

    it('Активирует редактирование при двойном клике', () => {
        render(<TreeNode id={1} name="Test Node" children={[]} />);

        fireEvent.doubleClick(screen.getByText('Test Node'));

        expect(useNodeStore.getState().editingNodeId).toBe(1);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('Сохраняет изменения при нажатии Enter', () => {
        const mockEditNode = jest.fn();
        useNodeStore.setState({
            editingNodeId: 1,
            editNode: mockEditNode
        });
        render(<TreeNode id={1} name="Test Node" children={[]} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Name' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(mockEditNode).toHaveBeenCalledWith(1, 'New Name');
        expect(useNodeStore.getState().editingNodeId).toBeNull();
    });

    it('Восстанавливает имя если всё стёрли', () => {
        const originalName = "Test Node";
        useNodeStore.setState({ editingNodeId: 1 });
        render(<TreeNode id={1} name={originalName} children={[]} />);
        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        expect(useNodeStore.getState().editingNodeId).toBeNull();
        expect(screen.getByText(originalName)).toBeInTheDocument();
    });
});
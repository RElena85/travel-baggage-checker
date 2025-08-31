import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemList from '../components/ItemList';
import { Item } from '../types';

describe('ItemList Component', () => {
  const mockOnUpdateItemStatus = jest.fn();

  const mockItems: Item[] = [
    {
      id: '1',
      name: 'Passport',
      isIn: false,
      isBack: false
    },
    {
      id: '2',
      name: 'Camera',
      isIn: true,
      isBack: false
    },
    {
      id: '3',
      name: 'Charger',
      isIn: true,
      isBack: true
    }
  ];

  beforeEach(() => {
    mockOnUpdateItemStatus.mockClear();
  });

  it('should render all items with their names', () => {
    render(
      <ItemList 
        items={mockItems} 
        onUpdateItemStatus={mockOnUpdateItemStatus}
      />
    );

    expect(screen.getByText('Passport')).toBeInTheDocument();
    expect(screen.getByText('Camera')).toBeInTheDocument();
    expect(screen.getByText('Charger')).toBeInTheDocument();
  });

  it('should render dual checkboxes for each item', () => {
    render(
      <ItemList 
        items={mockItems} 
        onUpdateItemStatus={mockOnUpdateItemStatus}
      />
    );

    // Check that each item has both "In" and "Back" checkboxes
    mockItems.forEach(item => {
      expect(screen.getByTestId(`item-${item.id}-in`)).toBeInTheDocument();
      expect(screen.getByTestId(`item-${item.id}-back`)).toBeInTheDocument();
    });
  });

  it('should display correct checkbox states', () => {
    render(
      <ItemList 
        items={mockItems} 
        onUpdateItemStatus={mockOnUpdateItemStatus}
      />
    );

    // Passport: both unchecked
    expect(screen.getByTestId('item-1-in')).not.toBeChecked();
    expect(screen.getByTestId('item-1-back')).not.toBeChecked();

    // Camera: in checked, back unchecked
    expect(screen.getByTestId('item-2-in')).toBeChecked();
    expect(screen.getByTestId('item-2-back')).not.toBeChecked();

    // Charger: both checked
    expect(screen.getByTestId('item-3-in')).toBeChecked();
    expect(screen.getByTestId('item-3-back')).toBeChecked();
  });

  it('should call onUpdateItemStatus when "In" checkbox is clicked', () => {
    render(
      <ItemList 
        items={mockItems} 
        onUpdateItemStatus={mockOnUpdateItemStatus}
      />
    );

    fireEvent.click(screen.getByTestId('item-1-in'));

    expect(mockOnUpdateItemStatus).toHaveBeenCalledWith('1', 'isIn');
  });

  it('should call onUpdateItemStatus when "Back" checkbox is clicked', () => {
    render(
      <ItemList 
        items={mockItems} 
        onUpdateItemStatus={mockOnUpdateItemStatus}
      />
    );

    fireEvent.click(screen.getByTestId('item-1-back'));

    expect(mockOnUpdateItemStatus).toHaveBeenCalledWith('1', 'isBack');
  });

  it('should handle empty items list', () => {
    render(
      <ItemList 
        items={[]} 
        onUpdateItemStatus={mockOnUpdateItemStatus}
      />
    );

    expect(screen.getByText('Items for Your Trip')).toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('should display header labels', () => {
    render(
      <ItemList 
        items={mockItems} 
        onUpdateItemStatus={mockOnUpdateItemStatus}
      />
    );

    expect(screen.getByText('Item Name')).toBeInTheDocument();
    expect(screen.getByText('Packed')).toBeInTheDocument();
    expect(screen.getByText('Returned')).toBeInTheDocument();
  });
});
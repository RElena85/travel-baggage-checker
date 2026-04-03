import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TripProvider } from '../context/TripContext';
import EditableItemList from './EditableItemList';
import { Item } from '../types';
import { localStorageMock } from '../setupTests';


beforeEach(() => {
  localStorageMock.clear();
});

const mockItems: Item[] = [
  { id: 'i1', name: 'Passport', isIn: false, isBack: false, category: 'documentos' },
  { id: 'i2', name: 'Charger', isIn: true, isBack: false, category: 'electronica' },
];

describe('EditableItemList', () => {
  it('renders group-by-select', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <EditableItemList tripId="trip-1" items={mockItems} />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByTestId('group-by-select')).toBeInTheDocument();
  });

  it('renders filter-category-select when grouping by category', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <EditableItemList tripId="trip-1" items={mockItems} />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByTestId('filter-category-select')).toBeInTheDocument();
  });

  it('renders checkboxes for each item', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <EditableItemList tripId="trip-1" items={mockItems} />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByTestId('item-i1-in')).toBeInTheDocument();
    expect(screen.getByTestId('item-i1-back')).toBeInTheDocument();
  });

  it('renders empty state when no items', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <EditableItemList tripId="trip-1" items={[]} />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByText(/No items yet/)).toBeInTheDocument();
  });

  it('new-item-input exists', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <EditableItemList tripId="trip-1" items={mockItems} />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByTestId('new-item-input')).toBeInTheDocument();
  });
});

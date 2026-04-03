import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TripProvider } from '../context/TripContext';
import TripList from './TripList';
import { Trip } from '../types';
import { localStorageMock } from '../setupTests';

beforeEach(() => {
  localStorageMock.clear();
});

const mockTrip: Trip = {
  id: 'trip-1',
  name: 'Test Trip',
  destination: 'Rome',
  items: [
    { id: 'i1', name: 'Passport', isIn: true, isBack: false, category: 'documentos' },
    { id: 'i2', name: 'Shoes', isIn: false, isBack: false, category: 'calzado' },
  ],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

describe('TripList', () => {
  it('renders empty state when no trips', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <TripList trips={[]} />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByText(/No trips yet/)).toBeInTheDocument();
  });

  it('renders trip card with name', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <TripList trips={[mockTrip]} />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByText('Test Trip')).toBeInTheDocument();
  });

  it('renders view-trip testid', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <TripList trips={[mockTrip]} />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByTestId('view-trip-trip-1')).toBeInTheDocument();
  });

  it('shows delete confirmation on delete click', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <TripList trips={[mockTrip]} />
        </MemoryRouter>
      </TripProvider>
    );
    fireEvent.click(screen.getByTestId('delete-trip-trip-1'));
    expect(screen.getByTestId('delete-confirm-trip-1')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-trip-1')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-delete-trip-1')).toBeInTheDocument();
  });

  it('cancels delete confirmation', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <TripList trips={[mockTrip]} />
        </MemoryRouter>
      </TripProvider>
    );
    fireEvent.click(screen.getByTestId('delete-trip-trip-1'));
    fireEvent.click(screen.getByTestId('cancel-delete-trip-1'));
    expect(screen.queryByTestId('delete-confirm-trip-1')).not.toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TripList from '../components/TripList';
import { Trip } from '../types';

// Helper to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('TripList Component', () => {
  const mockOnCopyTrip = jest.fn();
  const mockOnDeleteTrip = jest.fn();

  const mockTrips: Trip[] = [
    {
      id: '1',
      name: 'Summer Vacation',
      items: [
        { id: 'item1', name: 'Sunscreen', isIn: true, isBack: false },
        { id: 'item2', name: 'Swimsuit', isIn: false, isBack: false }
      ],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-02')
    },
    {
      id: '2',
      name: 'Business Trip',
      items: [
        { id: 'item3', name: 'Laptop', isIn: true, isBack: true }
      ],
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2025-01-04')
    }
  ];

  beforeEach(() => {
    mockOnCopyTrip.mockClear();
    mockOnDeleteTrip.mockClear();
  });

  it('should render all trips with their names and item counts', () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    expect(screen.getByText('Summer Vacation')).toBeInTheDocument();
    expect(screen.getByText('Business Trip')).toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getByText('1 items')).toBeInTheDocument();
  });

  it('should render copy and delete buttons for each trip', () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    expect(screen.getByTestId('copy-trip-1')).toBeInTheDocument();
    expect(screen.getByTestId('copy-trip-2')).toBeInTheDocument();
    expect(screen.getByTestId('delete-trip-1')).toBeInTheDocument();
    expect(screen.getByTestId('delete-trip-2')).toBeInTheDocument();
  });

  it('should call onCopyTrip when copy button is clicked', () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    fireEvent.click(screen.getByTestId('copy-trip-1'));

    expect(mockOnCopyTrip).toHaveBeenCalledWith(mockTrips[0]);
  });

  it('should call onDeleteTrip when delete button is clicked', () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    fireEvent.click(screen.getByTestId('delete-trip-1'));

    expect(mockOnDeleteTrip).toHaveBeenCalledWith('1');
  });

  it('should display message when no trips exist', () => {
    renderWithRouter(
      <TripList 
        trips={[]}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    expect(screen.getByText('No trips yet. Create your first trip!')).toBeInTheDocument();
  });

  it('should render trip names as links', () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    const tripLink1 = screen.getByRole('link', { name: 'Summer Vacation' });
    const tripLink2 = screen.getByRole('link', { name: 'Business Trip' });

    expect(tripLink1).toHaveAttribute('href', '/trip/1');
    expect(tripLink2).toHaveAttribute('href', '/trip/2');
  });

  it('should display correct item counts', () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getByText('1 items')).toBeInTheDocument();
  });
});
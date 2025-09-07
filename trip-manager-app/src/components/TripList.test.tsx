import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripList from '../components/TripList';
import { Trip } from '../types';

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn(() => true), // Default to confirming
});

// Helper to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('TripList Component', () => {
  const mockOnCopyTrip = jest.fn();
  const mockOnDeleteTrip = jest.fn();

  const mockTrips: Trip[] = [
    {
      id: '1',
      name: 'Summer Vacation',
      items: [
        { id: 'item1', name: 'Sunscreen', category: 'higiene', isIn: true, isBack: false },
        { id: 'item2', name: 'Swimsuit', category: 'ropa-exterior', isIn: false, isBack: false }
      ],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-02')
    },
    {
      id: '2',
      name: 'Business Trip',
      items: [
        { id: 'item3', name: 'Laptop', category: 'electronica', isIn: true, isBack: true }
      ],
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2025-01-04')
    }
  ];

  beforeEach(() => {
    mockOnCopyTrip.mockClear();
    mockOnDeleteTrip.mockClear();
    (window.confirm as jest.Mock).mockClear();
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

  it('should call onCopyTrip when copy button is clicked', async () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('copy-trip-1'));
    });

    expect(mockOnCopyTrip).toHaveBeenCalledWith('1');
  });

  it('should call onDeleteTrip when delete button is clicked and confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-trip-1'));
    });

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Summer Vacation"?');
    expect(mockOnDeleteTrip).toHaveBeenCalledWith('1');
  });

  it('should not call onDeleteTrip when delete is cancelled', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-trip-1'));
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDeleteTrip).not.toHaveBeenCalled();
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

  it('should render view links for each trip', () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    const viewLinks = screen.getAllByText('📱 View');
    expect(viewLinks).toHaveLength(2);
    
    expect(viewLinks[0].closest('a')).toHaveAttribute('href', '/trip/1');
    expect(viewLinks[1].closest('a')).toHaveAttribute('href', '/trip/2');
  });

  it('should display correct item counts and stats', () => {
    renderWithRouter(
      <TripList 
        trips={mockTrips}
        onCopyTrip={mockOnCopyTrip}
        onDeleteTrip={mockOnDeleteTrip}
      />
    );

    expect(screen.getByText('2 items')).toBeInTheDocument();
    expect(screen.getByText('1 items')).toBeInTheDocument();
    
    const packedValues = screen.getAllByText('1');
    expect(packedValues.length).toBeGreaterThan(0);
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TripForm from '../components/TripForm';
import { Trip } from '../types';

describe('TripForm Component', () => {
  const mockOnSubmit = jest.fn();

  const mockExistingTrip: Trip = {
    id: '1',
    name: 'Existing Trip',
    items: [
      { id: 'item1', name: 'Camera', isIn: true, isBack: false },
      { id: 'item2', name: 'Passport', isIn: false, isBack: false }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render empty form for new trip', () => {
    render(<TripForm onSubmit={mockOnSubmit} />);

    expect(screen.getByTestId('trip-name-input')).toHaveValue('');
    expect(screen.getByTestId('save-trip-button')).toBeInTheDocument();
    expect(screen.getByTestId('add-item-button')).toBeInTheDocument();
  });

  it('should populate form with existing trip data', () => {
    render(<TripForm onSubmit={mockOnSubmit} trip={mockExistingTrip} />);

    expect(screen.getByTestId('trip-name-input')).toHaveValue('Existing Trip');
    expect(screen.getByTestId('item-input-0')).toHaveValue('Camera');
    expect(screen.getByTestId('item-input-1')).toHaveValue('Passport');
  });

  it('should add new item when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<TripForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByTestId('add-item-button'));

    expect(screen.getByTestId('item-input-0')).toBeInTheDocument();
    expect(screen.getByTestId('remove-item-0')).toBeInTheDocument();
  });

  it('should remove item when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<TripForm onSubmit={mockOnSubmit} trip={mockExistingTrip} />);

    await user.click(screen.getByTestId('remove-item-0'));

    expect(screen.queryByTestId('item-input-0')).toHaveValue('Passport');
    expect(screen.queryByTestId('item-input-1')).not.toBeInTheDocument();
  });

  it('should update item name when typing', async () => {
    const user = userEvent.setup();
    render(<TripForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByTestId('add-item-button'));
    await user.type(screen.getByTestId('item-input-0'), 'New Item');

    expect(screen.getByTestId('item-input-0')).toHaveValue('New Item');
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<TripForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('trip-name-input'), 'Test Trip');
    await user.click(screen.getByTestId('add-item-button'));
    await user.type(screen.getByTestId('item-input-0'), 'Test Item');
    await user.click(screen.getByTestId('save-trip-button'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Trip',
        items: expect.arrayContaining([
          expect.objectContaining({
            name: 'Test Item',
            isIn: false,
            isBack: false
          })
        ])
      });
    });
  });

  it('should not submit with empty trip name', async () => {
    const user = userEvent.setup();
    render(<TripForm onSubmit={mockOnSubmit} />);

    await user.click(screen.getByTestId('save-trip-button'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should filter out empty items on submit', async () => {
    const user = userEvent.setup();
    render(<TripForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('trip-name-input'), 'Test Trip');
    await user.click(screen.getByTestId('add-item-button'));
    await user.click(screen.getByTestId('add-item-button'));
    await user.type(screen.getByTestId('item-input-0'), 'Valid Item');
    // Leave second item empty
    await user.click(screen.getByTestId('save-trip-button'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Trip',
        items: expect.arrayContaining([
          expect.objectContaining({
            name: 'Valid Item'
          })
        ])
      });
    });

    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData.items).toHaveLength(1);
  });

  it('should trim whitespace from trip name and item names', async () => {
    const user = userEvent.setup();
    render(<TripForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByTestId('trip-name-input'), '  Trimmed Trip  ');
    await user.click(screen.getByTestId('save-trip-button'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Trimmed Trip',
        items: []
      });
    });
  });
});
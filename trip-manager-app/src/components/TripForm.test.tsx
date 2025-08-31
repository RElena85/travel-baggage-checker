import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TripForm from '../components/TripForm';

describe('TripForm Component', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('should render empty form for new trip', () => {
    render(<TripForm onSave={mockOnSave} />);

    expect(screen.getByTestId('trip-name-input')).toHaveValue('');
    expect(screen.getByTestId('save-trip-button')).toBeInTheDocument();
    expect(screen.getByTestId('add-item-button')).toBeInTheDocument();
  });

  it('should add new item when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<TripForm onSave={mockOnSave} />);

    // Add item text first
    await user.type(screen.getByPlaceholderText('e.g., Passport, Phone charger, Sunscreen...'), 'Test Item');
    await user.click(screen.getByTestId('add-item-button'));

    expect(screen.getByTestId('item-input-0')).toHaveValue('Test Item');
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<TripForm onSave={mockOnSave} />);

    await user.type(screen.getByTestId('trip-name-input'), 'Test Trip');
    await user.type(screen.getByPlaceholderText('e.g., Passport, Phone charger, Sunscreen...'), 'Test Item');
    await user.click(screen.getByTestId('add-item-button'));
    await user.click(screen.getByTestId('save-trip-button'));

    expect(mockOnSave).toHaveBeenCalledWith('Test Trip', [{ name: 'Test Item' }]);
  });

  it('should not submit with empty trip name', async () => {
    const user = userEvent.setup();
    render(<TripForm onSave={mockOnSave} />);

    const saveButton = screen.getByTestId('save-trip-button');
    expect(saveButton).toBeDisabled();
  });

  it('should filter out empty items on submit', async () => {
    const user = userEvent.setup();
    render(<TripForm onSave={mockOnSave} />);

    await user.type(screen.getByTestId('trip-name-input'), 'Test Trip');
    
    // Add first item
    await user.type(screen.getByPlaceholderText('e.g., Passport, Phone charger, Sunscreen...'), 'Valid Item');
    await user.click(screen.getByTestId('add-item-button'));
    
    // Add second empty item
    await user.click(screen.getByTestId('add-item-button'));
    
    await user.click(screen.getByTestId('save-trip-button'));

    expect(mockOnSave).toHaveBeenCalledWith('Test Trip', [{ name: 'Valid Item' }]);
  });

  it('should trim whitespace from trip name', async () => {
    const user = userEvent.setup();
    render(<TripForm onSave={mockOnSave} />);

    await user.type(screen.getByTestId('trip-name-input'), '  Trimmed Trip  ');
    await user.click(screen.getByTestId('save-trip-button'));

    expect(mockOnSave).toHaveBeenCalledWith('Trimmed Trip', []);
  });
});
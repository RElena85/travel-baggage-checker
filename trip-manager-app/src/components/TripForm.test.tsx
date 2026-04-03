import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TripProvider } from '../context/TripContext';
import TripForm from './TripForm';
import { localStorageMock } from '../setupTests';


beforeEach(() => {
  localStorageMock.clear();
});

const renderTripForm = () =>
  render(
    <TripProvider>
      <MemoryRouter>
        <TripForm />
      </MemoryRouter>
    </TripProvider>
  );

describe('TripForm', () => {
  it('renders all required inputs', () => {
    renderTripForm();
    expect(screen.getByTestId('trip-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('trip-destination-input')).toBeInTheDocument();
    expect(screen.getByTestId('trip-departure-input')).toBeInTheDocument();
    expect(screen.getByTestId('new-item-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('add-item-button')).toBeInTheDocument();
  });

  it('save button is disabled when trip name is empty', () => {
    renderTripForm();
    expect(screen.getByTestId('save-trip-button')).toBeDisabled();
  });

  it('save button is enabled when trip name is filled', () => {
    renderTripForm();
    fireEvent.change(screen.getByTestId('trip-name-input'), {
      target: { value: 'My Trip' },
    });
    expect(screen.getByTestId('save-trip-button')).not.toBeDisabled();
  });

  it('adds item on button click', () => {
    renderTripForm();
    fireEvent.change(screen.getByTestId('new-item-name-input'), {
      target: { value: 'Passport' },
    });
    fireEvent.click(screen.getByTestId('add-item-button'));
    expect(screen.getByTestId('item-input-0')).toBeInTheDocument();
  });

  it('adds item on Enter key', () => {
    renderTripForm();
    const input = screen.getByTestId('new-item-name-input');
    fireEvent.change(input, { target: { value: 'Toothbrush' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByTestId('item-input-0')).toBeInTheDocument();
  });

  it('removes item on click', () => {
    renderTripForm();
    fireEvent.change(screen.getByTestId('new-item-name-input'), {
      target: { value: 'Item' },
    });
    fireEvent.click(screen.getByTestId('add-item-button'));
    fireEvent.click(screen.getByTestId('remove-item-0'));
    expect(screen.queryByTestId('item-input-0')).not.toBeInTheDocument();
  });
});


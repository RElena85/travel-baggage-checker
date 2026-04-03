import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TripProvider } from '../context/TripContext';
import TripDetails from './TripDetails';
import { localStorageMock } from '../setupTests';


beforeEach(() => {
  localStorageMock.clear();
});

describe('TripDetails', () => {
  it('shows not found for invalid trip id', () => {
    render(
      <TripProvider>
        <MemoryRouter initialEntries={['/trip/invalid-id']}>
          <Routes>
            <Route path="/trip/:id" element={<TripDetails />} />
          </Routes>
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByText('Trip Not Found')).toBeInTheDocument();
  });
});

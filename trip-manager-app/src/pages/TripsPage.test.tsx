import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TripProvider } from '../context/TripContext';
import TripsPage from './TripsPage';
import { localStorageMock } from '../setupTests';


beforeEach(() => {
  localStorageMock.clear();
});

describe('TripsPage', () => {
  it('renders page title', async () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <TripsPage />
        </MemoryRouter>
      </TripProvider>
    );
    const heading = await screen.findByText('🧳 My Trips');
    expect(heading).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TripProvider } from '../context/TripContext';
import Home from './Home';
import { localStorageMock } from '../setupTests';


beforeEach(() => {
  localStorageMock.clear();
});

describe('Home', () => {
  it('renders hero title', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByText('✈️ TripPacker')).toBeInTheDocument();
  });

  it('renders My Trips and New Trip cards', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByText('My Trips')).toBeInTheDocument();
    expect(screen.getByText('New Trip')).toBeInTheDocument();
  });
});

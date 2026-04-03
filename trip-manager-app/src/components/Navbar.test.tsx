import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TripProvider } from '../context/TripContext';
import Navbar from './Navbar';
import { localStorageMock } from '../setupTests';


beforeEach(() => {
  localStorageMock.clear();
});

describe('Navbar', () => {
  it('renders brand link', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByTestId('navbar-brand')).toBeInTheDocument();
  });

  it('renders nav-trips link', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByTestId('nav-trips')).toBeInTheDocument();
  });

  it('renders new trip CTA', () => {
    render(
      <TripProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </TripProvider>
    );
    expect(screen.getByTestId('nav-create-trip')).toBeInTheDocument();
  });
});

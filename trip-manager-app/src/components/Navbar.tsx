import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';

export default function Navbar() {
  const { trips } = useTripContext();
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" data-testid="navbar-brand">
        ✈️ TripPacker
      </Link>
      <div className="navbar-links">
        <Link
          to="/trips"
          className={`navbar-link${location.pathname === '/trips' ? ' active' : ''}`}
          data-testid="nav-trips"
        >
          My Trips
          {trips.length > 0 && (
            <span className="navbar-badge" data-testid="nav-trips-count">
              {trips.length}
            </span>
          )}
        </Link>
        <Link
          to="/create-trip"
          className="navbar-cta"
          data-testid="nav-create-trip"
        >
          New Trip
        </Link>
      </div>
    </nav>
  );
}

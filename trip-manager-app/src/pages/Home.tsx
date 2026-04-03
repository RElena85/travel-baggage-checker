import React from 'react';
import { Link } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';

export default function Home() {
  const { trips } = useTripContext();

  const totalItems = trips.reduce((acc, t) => acc + t.items.length, 0);
  const packedItems = trips.reduce((acc, t) => acc + t.items.filter(i => i.isIn).length, 0);

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">✈️ TripPacker</h1>
        <p className="home-subtitle">Your personal travel packing companion</p>
      </div>

      <div className="home-menu-grid">
        <Link to="/trips" className="home-menu-card">
          <span className="home-menu-icon">🧳</span>
          <h2 className="home-menu-title">My Trips</h2>
          <p className="home-menu-desc">View and manage all your trips</p>
          {trips.length > 0 && (
            <span className="home-menu-badge">{trips.length} trips</span>
          )}
        </Link>
        <Link to="/create-trip" className="home-menu-card home-menu-card--cta">
          <span className="home-menu-icon">➕</span>
          <h2 className="home-menu-title">New Trip</h2>
          <p className="home-menu-desc">Start planning your next adventure</p>
          <span className="home-menu-cta-text">Start planning →</span>
        </Link>
      </div>

      {trips.length > 0 && (
        <div className="home-stats">
          <div className="stat-card">
            <span className="stat-value">{trips.length}</span>
            <span className="stat-label">Total Trips</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalItems}</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{packedItems}</span>
            <span className="stat-label">Items Packed</span>
          </div>
        </div>
      )}
    </div>
  );
}

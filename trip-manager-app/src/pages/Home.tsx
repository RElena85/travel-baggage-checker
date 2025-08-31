import React from 'react';
import { Link } from 'react-router-dom';
import { useTripContext } from '../contexts/TripContext';
import '../styles/components.css';

const Home: React.FC = () => {
    const { trips } = useTripContext();

    return (
        <div className="app">
            <div className="container">
                <div className="page">
                    <div className="home-header">
                        <h1 className="home-title">✈️ TripPacker</h1>
                        <p className="home-description">
                            Your smart travel companion for stress-free packing and unpacking
                        </p>
                    </div>
                    
                    <div className="page-content">
                        <div className="menu-options">
                            <div className="menu-grid">
                                <Link to="/trips" className="menu-card">
                                    <div className="menu-card-icon">🧳</div>
                                    <h3 className="menu-card-title">My Trips</h3>
                                    <p className="menu-card-description">
                                        View and manage all your trips
                                    </p>
                                    <div className="menu-card-badge">
                                        {trips.length} trip{trips.length !== 1 ? 's' : ''}
                                    </div>
                                </Link>

                                <Link to="/create-trip" className="menu-card">
                                    <div className="menu-card-icon">➕</div>
                                    <h3 className="menu-card-title">New Trip</h3>
                                    <p className="menu-card-description">
                                        Create a new travel adventure
                                    </p>
                                    <div className="menu-card-action">
                                        Start planning →
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {trips.length > 0 && (
                            <div className="quick-stats">
                                <h3>Quick Stats</h3>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <span className="stat-number">{trips.length}</span>
                                        <span className="stat-label">Total Trips</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-number">
                                            {trips.reduce((sum, trip) => sum + trip.items.length, 0)}
                                        </span>
                                        <span className="stat-label">Total Items</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-number">
                                            {trips.reduce((sum, trip) => 
                                                sum + trip.items.filter(item => item.isIn).length, 0
                                            )}
                                        </span>
                                        <span className="stat-label">Items Packed</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
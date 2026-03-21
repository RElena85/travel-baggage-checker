import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTripContext } from '../contexts/TripContext';

const Navbar: React.FC = () => {
    const { trips } = useTripContext();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand" data-testid="navbar-brand">
                    ✈️ TripPacker
                </Link>
                <div className="navbar-links">
                    <Link
                        to="/trips"
                        className={`navbar-link${isActive('/trips') ? ' navbar-link--active' : ''}`}
                        data-testid="nav-trips"
                    >
                        🧳 My Trips
                        {trips.length > 0 && (
                            <span className="navbar-badge" data-testid="nav-trips-count">
                                {trips.length}
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/create-trip"
                        className={`navbar-link navbar-link--cta${isActive('/create-trip') ? ' navbar-link--active' : ''}`}
                        data-testid="nav-create-trip"
                    >
                        ➕ New Trip
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

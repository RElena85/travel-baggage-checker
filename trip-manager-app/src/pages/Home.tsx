import React from 'react';
import { Link } from 'react-router-dom';
import TripList from '../components/TripList';
import useTripData from '../hooks/useTripData';
import '../styles/components.css';

const Home: React.FC = () => {
    const { trips, loading, copyTrip, deleteTrip } = useTripData();

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
                    
                    <div className="home-actions">
                        <Link to="/create-trip" className="create-trip-button">
                            Create New Trip
                        </Link>
                    </div>

                    <div className="page-content">
                        {loading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                                <p>Loading your trips...</p>
                            </div>
                        ) : trips.length === 0 ? (
                            <div className="empty-trips">
                                <div className="empty-icon">🧳</div>
                                <h3 className="empty-title">No trips yet!</h3>
                                <p className="empty-description">
                                    Start by creating your first trip. Add items to your packing list 
                                    and track what you've packed and what you need to bring back.
                                </p>
                                <Link to="/create-trip" className="btn btn-primary btn-lg mt-6">
                                    🚀 Create Your First Trip
                                </Link>
                            </div>
                        ) : (
                            <TripList 
                                trips={trips}
                                onCopyTrip={copyTrip}
                                onDeleteTrip={deleteTrip}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
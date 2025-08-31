import React from 'react';
import { Link } from 'react-router-dom';
import TripList from '../components/TripList';
import { useTripContext } from '../contexts/TripContext';
import '../styles/components.css';

const TripsPage: React.FC = () => {
    const { trips, loading, copyTrip, deleteTrip } = useTripContext();

    return (
        <div className="app">
            <div className="container">
                <div className="page">
                    <div className="page-header">
                        <h1 className="page-title">🧳 My Trips</h1>
                        <p className="page-subtitle">
                            Manage and view all your travel adventures
                        </p>
                    </div>
                    
                    <div className="page-content">
                        <div className="flex justify-between items-center mb-6">
                            <Link to="/" className="btn btn-secondary">
                                ← Back to Home
                            </Link>
                            <Link to="/create-trip" className="btn btn-primary">
                                ➕ Add New Trip
                            </Link>
                        </div>

                        {loading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                                <p>Loading your trips...</p>
                            </div>
                        ) : trips.length === 0 ? (
                            <div className="empty-trips">
                                <div className="empty-icon">🧳</div>
                                <h3 className="empty-title">No trips found</h3>
                                <p className="empty-description">
                                    You haven't created any trips yet. Start planning your next adventure!
                                </p>
                                <Link to="/create-trip" className="btn btn-primary btn-lg mt-6">
                                    🚀 Create Your First Trip
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <p className="text-gray-600">
                                        You have {trips.length} trip{trips.length !== 1 ? 's' : ''} planned
                                    </p>
                                </div>
                                <TripList 
                                    trips={trips}
                                    onCopyTrip={copyTrip}
                                    onDeleteTrip={deleteTrip}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripsPage;
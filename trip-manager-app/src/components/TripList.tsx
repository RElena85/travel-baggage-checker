import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../types';

interface TripListProps {
    trips: Trip[];
    onCopyTrip: (tripId: string) => void;
    onDeleteTrip: (tripId: string) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onCopyTrip, onDeleteTrip }) => {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDepartureDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateStats = (trip: Trip) => {
        const totalItems = trip.items.length;
        const packedItems = trip.items.filter(item => item.isIn).length;
        const returnedItems = trip.items.filter(item => item.isBack).length;
        const packedPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
        
        return { totalItems, packedItems, returnedItems, packedPercentage };
    };

    const handleDeleteClick = (tripId: string) => {
        setConfirmDeleteId(tripId);
    };

    const handleConfirmDelete = (tripId: string) => {
        onDeleteTrip(tripId);
        setConfirmDeleteId(null);
    };

    const handleCancelDelete = () => {
        setConfirmDeleteId(null);
    };

    return (
        <div className="trip-list">
            <h2>Your Travel Adventures</h2>
            <div className="trips-grid">
                {trips.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">✈️</div>
                        <p>No trips yet. Create your first trip!</p>
                        <Link to="/create-trip" className="btn btn-primary">
                            ➕ Create Trip
                        </Link>
                    </div>
                ) : (
                    trips.map(trip => {
                        const stats = calculateStats(trip);
                        const isConfirmingDelete = confirmDeleteId === trip.id;
                        
                        return (
                            <div key={trip.id} className="trip-card">
                                <div className="trip-card-header">
                                    <div className="trip-name">{trip.name}</div>
                                    {trip.destination && (
                                        <div className="trip-destination">
                                            📍 {trip.destination}
                                        </div>
                                    )}
                                    <div className="trip-meta">
                                        <span>Created {formatDate(trip.createdAt)}</span>
                                        {trip.departureDate && (
                                            <span className="trip-departure-badge">
                                                ✈️ {formatDepartureDate(trip.departureDate)}
                                            </span>
                                        )}
                                        <span>{stats.totalItems} items</span>
                                    </div>
                                </div>
                                
                                <div className="trip-stats">
                                    <div className="stat-item">
                                        <span className="stat-value packed-value">{stats.packedItems}</span>
                                        <div className="stat-label">Packed</div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-value returned-value">{stats.returnedItems}</span>
                                        <div className="stat-label">Returned</div>
                                    </div>
                                </div>

                                <div className="trip-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ '--bar-fill': `${stats.packedPercentage}%` } as React.CSSProperties}
                                        ></div>
                                    </div>
                                    <div className="progress-text">
                                        {stats.packedPercentage}% packed • {stats.returnedItems}/{stats.totalItems} returned
                                    </div>
                                </div>

                                <div className="trip-actions">
                                    {isConfirmingDelete ? (
                                        <div className="delete-confirm" data-testid={`delete-confirm-${trip.id}`}>
                                            <span className="delete-confirm-text">Delete "{trip.name}"?</span>
                                            <button
                                                onClick={() => handleConfirmDelete(trip.id)}
                                                className="trip-action-btn delete-btn"
                                                data-testid={`confirm-delete-${trip.id}`}
                                            >
                                                ✓ Yes
                                            </button>
                                            <button
                                                onClick={handleCancelDelete}
                                                className="trip-action-btn trip-action-btn--cancel"
                                                data-testid={`cancel-delete-${trip.id}`}
                                            >
                                                ✕ No
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Link 
                                                to={`/trip/${trip.id}`} 
                                                className="trip-action-btn view-btn"
                                            >
                                                📱 View
                                            </Link>
                                            <button 
                                                onClick={() => onCopyTrip(trip.id)}
                                                className="trip-action-btn copy-btn"
                                                data-testid={`copy-trip-${trip.id}`}
                                            >
                                                📋 Copy
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(trip.id)}
                                                className="trip-action-btn delete-btn"
                                                data-testid={`delete-trip-${trip.id}`}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TripList;
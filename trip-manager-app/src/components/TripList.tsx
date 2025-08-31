import React from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../types';

interface TripListProps {
    trips: Trip[];
    onCopyTrip: (tripId: string) => void;
    onDeleteTrip: (tripId: string) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onCopyTrip, onDeleteTrip }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
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

    return (
        <div className="trip-list">
            <h2>Your Travel Adventures</h2>
            <div className="trips-grid">
                {trips.map(trip => {
                    const stats = calculateStats(trip);
                    
                    return (
                        <div key={trip.id} className="trip-card">
                            <div className="trip-card-header">
                                <div className="trip-name">{trip.name}</div>
                                <div className="trip-meta">
                                    <span>Created {formatDate(trip.createdAt)}</span>
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
                                        style={{ width: `${stats.packedPercentage}%` }}
                                    ></div>
                                </div>
                                <div className="progress-text">
                                    {stats.packedPercentage}% packed • {stats.returnedItems}/{stats.totalItems} returned
                                </div>
                            </div>

                            <div className="trip-actions">
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
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete "${trip.name}"?`)) {
                                            onDeleteTrip(trip.id);
                                        }
                                    }}
                                    className="trip-action-btn delete-btn"
                                    data-testid={`delete-trip-${trip.id}`}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TripList;
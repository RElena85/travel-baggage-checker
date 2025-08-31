import React from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../types';

interface TripListProps {
    trips: Trip[];
    onCopyTrip: (trip: Trip) => void;
    onDeleteTrip: (tripId: string) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, onCopyTrip, onDeleteTrip }) => {
    return (
        <div className="trip-list">
            <h2>Your Trips</h2>
            {trips.length === 0 ? (
                <p>No trips yet. Create your first trip!</p>
            ) : (
                <ul>
                    {trips.map((trip: Trip) => (
                        <li key={trip.id} className="trip-item">
                            <div className="trip-info">
                                <Link to={`/trip/${trip.id}`} className="trip-name">
                                    {trip.name}
                                </Link>
                                <span className="trip-items-count">
                                    {trip.items.length} items
                                </span>
                            </div>
                            <div className="trip-actions">
                                <button 
                                    onClick={() => onCopyTrip(trip)}
                                    className="copy-button"
                                    data-testid={`copy-trip-${trip.id}`}
                                >
                                    Copy
                                </button>
                                <button 
                                    onClick={() => onDeleteTrip(trip.id)}
                                    className="delete-button"
                                    data-testid={`delete-trip-${trip.id}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TripList;
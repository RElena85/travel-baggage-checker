import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { calculateProgress, formatDate } from '../utils/helpers';
import { Trip } from '../types';

interface TripListProps {
  trips?: Trip[];
}

export function TripList({ trips: propTrips }: TripListProps = {}) {
  const { trips: contextTrips, deleteTrip, copyTrip } = useTripContext();
  const trips = propTrips ?? contextTrips;
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (trips.length === 0) {
    return (
      <div data-testid="trip-list" className="trip-list-empty">
        <p className="empty-icon">🧳</p>
        <p>No trips yet. Start planning your first adventure!</p>
      </div>
    );
  }

  return (
    <div data-testid="trip-list" className="trip-list">
      {trips.map((trip) => {
        const { packed, total, percentage } = calculateProgress(trip.items);
        return (
          <div key={trip.id} data-testid={`trip-card-${trip.id}`} className="trip-card">
            <div className="trip-card-header">
              <h3 className="trip-card-name">{trip.name}</h3>
              {trip.destination && (
                <span className="trip-card-destination">📍 {trip.destination}</span>
              )}
              {trip.departureDate && (
                <span className="trip-card-date">📅 {formatDate(trip.departureDate)}</span>
              )}
            </div>
            <div className="trip-card-stats">
              <span>{total} items</span>
              <span>{packed} packed</span>
            </div>
            <div className="progress-bar-container" data-testid="progress-bar">
              <div
                className="progress-bar-fill"
                data-testid="progress-fill"
                style={{ '--bar-fill': `${percentage}%` } as React.CSSProperties}
              />
            </div>
            <div className="trip-card-actions">
              <Link
                to={`/trip/${trip.id}`}
                className="btn btn-primary"
                data-testid={`view-trip-${trip.id}`}
              >
                View Trip
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => copyTrip(trip.id)}
                data-testid={`copy-trip-${trip.id}`}
              >
                Copy
              </button>
              {confirmDelete === trip.id ? (
                <span className="delete-confirm" data-testid={`delete-confirm-${trip.id}`}>
                  <span>Delete {trip.name}?</span>
                  <button
                    className="btn btn-danger"
                    onClick={() => { deleteTrip(trip.id); setConfirmDelete(null); }}
                    data-testid={`confirm-delete-${trip.id}`}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setConfirmDelete(null)}
                    data-testid={`cancel-delete-${trip.id}`}
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => setConfirmDelete(trip.id)}
                  data-testid={`delete-trip-${trip.id}`}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TripList;
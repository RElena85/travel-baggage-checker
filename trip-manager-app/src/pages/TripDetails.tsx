import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import EditableItemList from '../components/EditableItemList';

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const { getTrip, updateTripName, markAllPacked, unpackAll } = useTripContext();

  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');

  const trip = id ? getTrip(id) : undefined;

  if (!trip) {
    return (
      <div className="not-found-page">
        <h1>Trip Not Found</h1>
        <p>The trip you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const totalItems = trip.items.length;
  const packedCount = trip.items.filter(i => i.isIn).length;
  const returnedCount = trip.items.filter(i => i.isBack).length;
  const packedPct = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;
  const returnedPct = totalItems > 0 ? Math.round((returnedCount / totalItems) * 100) : 0;

  const allPacked = totalItems > 0 && packedCount === totalItems;
  const nonePackedOrReturned = packedCount === 0 && returnedCount === 0;

  function startEditName() {
    setDraftName(trip!.name);
    setEditingName(true);
  }

  function saveName() {
    if (!draftName.trim()) return;
    updateTripName(trip!.id, draftName.trim());
    setEditingName(false);
  }

  function cancelEditName() {
    setEditingName(false);
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveName();
    if (e.key === 'Escape') cancelEditName();
  }

  return (
    <div className="trip-details-page">
      <div className="trip-details-header">
        <Link to="/trips" className="back-link">
          ← My Trips
        </Link>
        <div className="trip-name-row">
          {editingName ? (
            <>
              <input
                type="text"
                className="form-input trip-name-input"
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                onKeyDown={handleNameKeyDown}
                autoFocus
              />
              <button
                className="btn-primary"
                onClick={saveName}
                data-testid="save-trip-name-btn"
              >
                Save
              </button>
              <button
                className="btn-secondary"
                onClick={cancelEditName}
                data-testid="cancel-trip-name-btn"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h1 className="trip-details-title">{trip.name}</h1>
              <button
                className="btn-icon"
                onClick={startEditName}
                data-testid="edit-trip-name-btn"
              >
                ✏️
              </button>
            </>
          )}
        </div>
        {trip.destination && (
          <p className="trip-details-destination">📍 {trip.destination}</p>
        )}
        {trip.departureDate && (
          <p className="trip-details-date">
            ✈️ Departure: {new Date(trip.departureDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="trip-stats-row">
        <div className="stat-card">
          <span className="stat-value">{totalItems}</span>
          <span className="stat-label">Total Items</span>
        </div>
        <div className="stat-card" data-testid="stat-card-packed">
          <span className="stat-value" data-testid="stat-packed">
            {packedCount} ({packedPct}%)
          </span>
          <span className="stat-label">Packed</span>
        </div>
        <div className="stat-card" data-testid="stat-card-returned">
          <span className="stat-value" data-testid="stat-returned">
            {returnedCount} ({returnedPct}%)
          </span>
          <span className="stat-label">Returned</span>
        </div>
      </div>

      {totalItems > 0 && (
        <div className="quick-actions">
          <button
            className="btn-primary"
            onClick={() => markAllPacked(trip.id)}
            disabled={allPacked}
            data-testid="mark-all-packed"
          >
            Mark All Packed
          </button>
          <button
            className="btn-secondary"
            onClick={() => unpackAll(trip.id)}
            disabled={nonePackedOrReturned}
            data-testid="unpack-all"
          >
            Reset All
          </button>
        </div>
      )}

      <EditableItemList tripId={trip.id} items={trip.items} />

      {totalItems > 0 && (
        <div className="trip-progress-section" data-testid="stat-card-progress">
          <h2 className="section-title">Trip Progress</h2>
          <div className="progress-bar-row">
            <span className="progress-label">Packing</span>
            <div className="trip-progress-bar-track">
              <div
                className="trip-progress-bar-fill"
                style={{ '--bar-fill': `${packedPct}%` } as React.CSSProperties}
              />
            </div>
            <span className="progress-count">Packed: {packedCount}/{totalItems}</span>
          </div>
          <div className="progress-bar-row">
            <span className="progress-label">Return</span>
            <div className="trip-progress-bar-track">
              <div
                className="trip-progress-bar-fill trip-progress-bar-fill--returned"
                style={{ '--bar-fill': `${returnedPct}%` } as React.CSSProperties}
              />
            </div>
            <span className="progress-count">
              Returned: {returnedCount}/{totalItems} ({returnedPct}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

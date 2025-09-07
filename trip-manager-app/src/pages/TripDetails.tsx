import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import EditableItemList from '../components/EditableItemList';
import { useTripContext } from '../contexts/TripContext';
import { Item, ItemCategory } from '../types';

const TripDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { 
        trips, 
        updateItemStatus, 
        updateTripName, 
        updateItemName, 
        updateItemTag, 
        updateItemCategory,
        removeItemFromTrip, 
        addItemToTrip 
    } = useTripContext();
    const trip = trips.find(t => t.id === id);
    
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');

    if (!trip) {
        return (
            <div className="app">
                <div className="container">
                    <div className="page">
                        <div className="page-header">
                            <h1 className="page-title">🔍 Trip Not Found</h1>
                            <p className="page-subtitle">The trip you're looking for doesn't exist</p>
                        </div>
                        <div className="page-content text-center">
                            <div className="empty-state">
                                <div className="empty-state-icon">❓</div>
                                <h3>Oops! Trip not found</h3>
                                <p>This trip might have been deleted or the link is incorrect.</p>
                                <Link to="/" className="btn btn-primary btn-lg mt-6">
                                    🏠 Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalItems = trip.items.length;
    const packedItems = trip.items.filter((item: Item) => item.isIn).length;
    const returnedItems = trip.items.filter((item: Item) => item.isBack).length;
    const packedPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
    const returnedPercentage = totalItems > 0 ? Math.round((returnedItems / totalItems) * 100) : 0;

    const startEditingName = () => {
        setIsEditingName(true);
        setEditedName(trip.name);
    };

    const saveTripName = () => {
        if (editedName.trim() && editedName.trim() !== trip.name) {
            updateTripName(trip.id, editedName.trim());
        }
        setIsEditingName(false);
        setEditedName('');
    };

    const cancelEditingName = () => {
        setIsEditingName(false);
        setEditedName('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveTripName();
        } else if (e.key === 'Escape') {
            cancelEditingName();
        }
    };

    return (
        <div className="app">
            <div className="container">
                <div className="page trip-details">
                    <div className="trip-details-header">
                        <div className="trip-title-section">
                            {isEditingName ? (
                                <div className="trip-name-edit">
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        className="trip-name-input"
                                        autoFocus
                                    />
                                    <div className="trip-name-actions">
                                        <button onClick={saveTripName} className="btn btn-primary btn-sm">
                                            ✓ Save
                                        </button>
                                        <button onClick={cancelEditingName} className="btn btn-secondary btn-sm">
                                            ✕ Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="trip-name-display">
                                    <div className="trip-details-title">{trip.name}</div>
                                    <button 
                                        onClick={startEditingName} 
                                        className="btn-icon edit-name-btn"
                                        title="Edit trip name"
                                    >
                                        ✏️
                                    </button>
                                </div>
                            )}
                        </div>
                        <Link to="/" className="back-button">
                            ← Back to Trips
                        </Link>
                    </div>

                    <div className="trip-overview">
                        <div className="overview-card">
                            <div className="overview-value total-value">{totalItems}</div>
                            <div className="overview-label">Total Items</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-value packed-value">{packedItems}</div>
                            <div className="overview-label">Packed ({packedPercentage}%)</div>
                        </div>
                        <div className="overview-card">
                            <div className="overview-value returned-value">{returnedItems}</div>
                            <div className="overview-label">Returned ({returnedPercentage}%)</div>
                        </div>
                    </div>

                    <div className="page-content">
                        <EditableItemList
                            items={trip.items}
                            tripId={trip.id}
                            onUpdateItemStatus={(itemId, field) => updateItemStatus(trip.id, itemId, field)}
                            onUpdateItemName={(itemId, newName) => updateItemName(trip.id, itemId, newName)}
                            onUpdateItemTag={(itemId, tag) => updateItemTag(trip.id, itemId, tag)}
                            onUpdateItemCategory={(itemId, category) => updateItemCategory(trip.id, itemId, category)}
                            onRemoveItem={(itemId) => removeItemFromTrip(trip.id, itemId)}
                            onAddItem={(itemName, category) => addItemToTrip(trip.id, itemName, category)}
                        />
                        
                        {totalItems > 0 && (
                            <div className="mt-8">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">📊 Trip Progress</h3>
                                    </div>
                                    <div className="card-content">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-600 mb-2">Packing Progress</div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill" 
                                                        style={{ width: `${packedPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    Packed: {packedItems}/{totalItems}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600 mb-2">Return Progress</div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill" 
                                                        style={{ 
                                                            width: `${returnedPercentage}%`,
                                                            background: 'var(--accent-color)'
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    Returned: {returnedItems}/{totalItems} ({returnedPercentage}%)
                                                </div>
                                            </div>
                                        </div>
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

export default TripDetails;
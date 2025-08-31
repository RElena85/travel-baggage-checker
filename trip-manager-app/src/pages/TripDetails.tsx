import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ItemList from '../components/ItemList';
import useTripData from '../hooks/useTripData';

const TripDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { trips, updateItemStatus } = useTripData();
    const trip = trips.find(t => t.id === id);

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
    const packedItems = trip.items.filter(item => item.isIn).length;
    const returnedItems = trip.items.filter(item => item.isBack).length;
    const packedPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
    const returnedPercentage = totalItems > 0 ? Math.round((returnedItems / totalItems) * 100) : 0;

    return (
        <div className="app">
            <div className="container">
                <div className="page trip-details">
                    <div className="trip-details-header">
                        <div className="trip-details-title">{trip.name}</div>
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
                        <ItemList
                            items={trip.items}
                            onUpdateItemStatus={(itemId, field) => updateItemStatus(trip.id, itemId, field)}
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
                                                    {packedItems} of {totalItems} items packed
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
                                                    {returnedItems} of {totalItems} items back
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
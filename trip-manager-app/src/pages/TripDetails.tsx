import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useTripData from '../hooks/useTripData';
import ItemList from '../components/ItemList';

const TripDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { getTrip, updateItemStatus, addItemToTrip } = useTripData();
    const [newItemName, setNewItemName] = React.useState('');
    
    const trip = id ? getTrip(id) : undefined;

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim() && id) {
            addItemToTrip(id, newItemName.trim());
            setNewItemName('');
        }
    };

    if (!trip) {
        return (
            <div className="trip-details">
                <h1>Trip not found</h1>
                <Link to="/">Back to Home</Link>
            </div>
        );
    }

    const packedItems = trip.items.filter(item => item.isIn);
    const returnedItems = trip.items.filter(item => item.isBack);
    const progressPercentage = trip.items.length > 0 ? 
        Math.round((returnedItems.length / trip.items.length) * 100) : 0;

    return (
        <div className="trip-details">
            <header className="trip-header">
                <Link to="/" className="back-link">← Back to Trips</Link>
                <h1>{trip.name}</h1>
                <div className="trip-stats">
                    <span>Packed: {packedItems.length}/{trip.items.length}</span>
                    <span>Returned: {returnedItems.length}/{trip.items.length} ({progressPercentage}%)</span>
                </div>
            </header>
            
            <form onSubmit={handleAddItem} className="add-item-form">
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Add new item"
                    data-testid="new-item-input"
                />
                <button type="submit" data-testid="add-new-item-button">
                    Add Item
                </button>
            </form>

            <ItemList 
                items={trip.items} 
                onUpdateItemStatus={(itemId, field) => updateItemStatus(trip.id, itemId, field)}
            />
        </div>
    );
};

export default TripDetails;
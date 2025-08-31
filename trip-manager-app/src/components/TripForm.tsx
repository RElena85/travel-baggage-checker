import React, { useState } from 'react';
import { Trip, Item } from '../types';

interface TripFormProps {
    onSubmit: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => void;
    trip?: Trip;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, trip }) => {
    const [tripName, setTripName] = useState(trip ? trip.name : '');
    const [items, setItems] = useState<Item[]>(trip ? trip.items : []);

    const handleItemNameChange = (index: number, name: string) => {
        const newItems = [...items];
        newItems[index].name = name;
        setItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tripName.trim()) {
            onSubmit({ 
                name: tripName.trim(), 
                items: items.filter(item => item.name.trim())
            });
        }
    };

    const addItem = () => {
        const newItem: Item = {
            id: `temp-${Date.now()}-${Math.random()}`,
            name: '',
            isIn: false,
            isBack: false
        };
        setItems([...items, newItem]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="trip-form">
            <div className="form-group">
                <label>
                    Trip Name:
                    <input
                        type="text"
                        value={tripName}
                        onChange={(e) => setTripName(e.target.value)}
                        required
                        placeholder="Enter trip name"
                        data-testid="trip-name-input"
                    />
                </label>
            </div>
            <div className="items-section">
                <h3>Items</h3>
                {items.map((item, index) => (
                    <div key={item.id} className="item-input">
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemNameChange(index, e.target.value)}
                            placeholder="Item name"
                            data-testid={`item-input-${index}`}
                        />
                        <button 
                            type="button" 
                            onClick={() => removeItem(index)}
                            className="remove-item-button"
                            data-testid={`remove-item-${index}`}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button 
                    type="button" 
                    onClick={addItem}
                    className="add-item-button"
                    data-testid="add-item-button"
                >
                    Add Item
                </button>
            </div>
            <button 
                type="submit" 
                className="save-trip-button"
                data-testid="save-trip-button"
            >
                Save Trip
            </button>
        </form>
    );
};

export default TripForm;
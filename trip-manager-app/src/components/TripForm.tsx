import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ItemCategory, ITEM_CATEGORIES } from '../types';

interface TripFormProps {
    onSave: (tripName: string, items: { name: string; category: ItemCategory }[]) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSave }) => {
    const [tripName, setTripName] = useState('');
    const [items, setItems] = useState<{ name: string; category: ItemCategory }[]>([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('otros');

    const handleItemNameChange = (index: number, name: string) => {
        const newItems = [...items];
        newItems[index].name = name;
        setItems(newItems);
    };

    const handleItemCategoryChange = (index: number, category: ItemCategory) => {
        const newItems = [...items];
        newItems[index].category = category;
        setItems(newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tripName.trim()) {
            const validItems = items.filter(item => item.name.trim() !== '');
            onSave(tripName.trim(), validItems);
        }
    };

    const addItem = () => {
        if (newItemName.trim()) {
            setItems([...items, { name: newItemName.trim(), category: newItemCategory }]);
            setNewItemName('');
        }
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
        }
    };

    return (
        <div className="trip-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="trip-name">
                        🎯 Trip Name
                    </label>
                    <input
                        id="trip-name"
                        type="text"
                        className="form-input"
                        value={tripName}
                        onChange={(e) => setTripName(e.target.value)}
                        required
                        placeholder="e.g., Weekend in Paris, Business Trip to Tokyo..."
                        data-testid="trip-name-input"
                    />
                </div>

                <div className="items-section">
                    <h3 className="items-section-title">Add Items to Pack</h3>
                    
                    <div className="item-input-group">
                        <div className="item-input-wrapper">
                            <input
                                type="text"
                                className="form-input"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="e.g., Passport, Phone charger, Sunscreen..."
                            />
                            <select
                                className="form-select"
                                value={newItemCategory}
                                onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                                data-testid="category-select"
                            >
                                {Object.entries(ITEM_CATEGORIES).map(([key, category]) => (
                                    <option key={key} value={key}>
                                        {category.icon} {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={addItem}
                            className="add-item-btn"
                            data-testid="add-item-button"
                            title="Add item"
                        >
                            ➕
                        </button>
                    </div>

                    {items.length > 0 && (
                        <div className="current-items">
                            <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--spacing-md)', color: 'var(--gray-700)' }}>
                                📋 Your Packing List ({items.length} items)
                            </h4>
                            {/* Group items by category */}
                            {Object.entries(ITEM_CATEGORIES).map(([categoryKey, categoryInfo]) => {
                                const categoryItems = items.filter(item => item.category === categoryKey);
                                if (categoryItems.length === 0) return null;
                                
                                return (
                                    <div key={categoryKey} className="category-group">
                                        <div className="category-header" style={{ backgroundColor: categoryInfo.color }}>
                                            <span className="category-icon">{categoryInfo.icon}</span>
                                            <span className="category-label">{categoryInfo.label}</span>
                                            <span className="category-count">({categoryItems.length})</span>
                                        </div>
                                        <div className="category-items">
                                            {categoryItems.map((item, itemIndex) => {
                                                const globalIndex = items.findIndex(i => i === item);
                                                return (
                                                    <div key={globalIndex} className="current-item">
                                                        <input
                                                            type="text"
                                                            value={item.name}
                                                            onChange={(e) => handleItemNameChange(globalIndex, e.target.value)}
                                                            data-testid={`item-input-${globalIndex}`}
                                                        />
                                                        <select
                                                            className="form-select-small"
                                                            value={item.category}
                                                            onChange={(e) => handleItemCategoryChange(globalIndex, e.target.value as ItemCategory)}
                                                        >
                                                            {Object.entries(ITEM_CATEGORIES).map(([key, cat]) => (
                                                                <option key={key} value={key}>
                                                                    {cat.icon} {cat.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(globalIndex)}
                                                            className="remove-item-btn"
                                                            title="Remove item"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {items.length === 0 && (
                        <div className="empty-items">
                            <div className="empty-items-icon">📝</div>
                            <p>Start adding items to your packing list!</p>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)', marginTop: 'var(--spacing-sm)' }}>
                                Tip: Press Enter after typing an item name to quickly add it
                            </p>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <Link to="/" className="btn btn-secondary">
                        ← Cancel
                    </Link>
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={!tripName.trim()}
                        data-testid="save-trip-button"
                    >
                        🚀 Create Trip
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TripForm;
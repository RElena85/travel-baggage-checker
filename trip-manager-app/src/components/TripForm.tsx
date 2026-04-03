import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { ItemCategory } from '../types';
import { ITEM_CATEGORIES } from '../utils/helpers';

interface FormItem {
  name: string;
  category: ItemCategory;
}

export default function TripForm() {
  const { addTrip } = useTripContext();
  const navigate = useNavigate();

  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [items, setItems] = useState<FormItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('otros');

  function addItem() {
    if (!newItemName.trim()) return;
    setItems(prev => [...prev, { name: newItemName.trim(), category: newItemCategory }]);
    setNewItemName('');
    setNewItemCategory('otros');
  }

  function handleItemKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  function updateItemName(index: number, name: string) {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, name } : item)));
  }

  function updateItemCategory(index: number, category: ItemCategory) {
    setItems(prev => prev.map((item, i) => (i === index ? { ...item, category } : item)));
  }

  function handleSave() {
    if (!tripName.trim()) return;
    addTrip(tripName, items, destination || undefined, departureDate || undefined);
    navigate('/trips');
  }

  // Group items by category for display
  const groupedItems: Record<string, { items: FormItem[]; indices: number[] }> = {};
  items.forEach((item, index) => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = { items: [], indices: [] };
    }
    groupedItems[item.category].items.push(item);
    groupedItems[item.category].indices.push(index);
  });

  const categoryOrder = Object.keys(ITEM_CATEGORIES) as ItemCategory[];

  return (
    <div className="trip-form-container">
      <div className="trip-form-card">
        <h1 className="trip-form-title">Plan Your Trip</h1>

        <div className="form-group">
          <label className="form-label">Trip Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Summer in Barcelona"
            value={tripName}
            onChange={e => setTripName(e.target.value)}
            data-testid="trip-name-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Destination</label>
          <input
            type="text"
            className="form-input"
            placeholder="City, Country"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            data-testid="trip-destination-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Departure Date</label>
          <input
            type="date"
            className="form-input"
            value={departureDate}
            onChange={e => setDepartureDate(e.target.value)}
            data-testid="trip-departure-input"
          />
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Packing List</h2>
          <div className="add-item-row">
            <input
              type="text"
              className="form-input"
              placeholder="Item name"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              onKeyDown={handleItemKeyDown}
              data-testid="new-item-name-input"
            />
            <select
              className="form-select"
              value={newItemCategory}
              onChange={e => setNewItemCategory(e.target.value as ItemCategory)}
              data-testid="category-select"
            >
              {categoryOrder.map(cat => (
                <option key={cat} value={cat}>
                  {ITEM_CATEGORIES[cat].icon} {ITEM_CATEGORIES[cat].label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn-secondary"
              onClick={addItem}
              data-testid="add-item-button"
            >
              Add
            </button>
          </div>

          {items.length === 0 && (
            <p className="empty-hint">No items yet — add your first packing item above.</p>
          )}

          {categoryOrder
            .filter(cat => groupedItems[cat])
            .map(cat => (
              <div key={cat} className="item-group">
                <div className="item-group-header">
                  <span>{ITEM_CATEGORIES[cat].icon}</span>
                  <span>{ITEM_CATEGORIES[cat].label}</span>
                  <span className="item-group-count">
                    {groupedItems[cat].items.length}
                  </span>
                </div>
                {groupedItems[cat].indices.map((originalIndex) => (
                  <div key={originalIndex} className="form-item-row">
                    <input
                      type="text"
                      className="form-input form-item-input"
                      value={items[originalIndex].name}
                      onChange={e => updateItemName(originalIndex, e.target.value)}
                      data-testid={`item-input-${originalIndex}`}
                    />
                    <select
                      className="form-select form-item-select"
                      value={items[originalIndex].category}
                      onChange={e =>
                        updateItemCategory(originalIndex, e.target.value as ItemCategory)
                      }
                    >
                      {categoryOrder.map(c => (
                        <option key={c} value={c}>
                          {ITEM_CATEGORIES[c].icon} {ITEM_CATEGORIES[c].label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeItem(originalIndex)}
                      data-testid={`remove-item-${originalIndex}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>

        <div className="form-actions">
          <Link to="/" className="btn-text">
            Cancel
          </Link>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSave}
            disabled={!tripName.trim()}
            data-testid="save-trip-button"
          >
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Item } from '../types';
import '../styles/components.css';

interface ItemListProps {
  items: Item[];
  onUpdateItemStatus: (itemId: string, field: 'isIn' | 'isBack') => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onUpdateItemStatus }) => {
  if (items.length === 0) {
    return (
      <div className="item-list">
        <div className="empty-items">
          <div className="empty-items-icon">📦</div>
          <h3>No items yet</h3>
          <p>Add some items to your packing list to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="item-list">
      <div className="item-list-header">
        <h3 className="item-list-title">Packing Checklist</h3>
        <div className="item-header-grid">
          <span>Item Name</span>
          <span>Packed ✅</span>
          <span>Returned 🎯</span>
        </div>
      </div>
      
      <div className="item-list-content">
        {items.map(item => (
          <div key={item.id} className="item">
            <span className="item-name">{item.name}</span>
            
            <div className="checkbox-wrapper">
              <label className="checkbox-label packed-checkbox">
                <input
                  type="checkbox"
                  checked={item.isIn}
                  onChange={() => onUpdateItemStatus(item.id, 'isIn')}
                  data-testid={`item-${item.id}-in`}
                />
                <span>Packed</span>
              </label>
            </div>
            
            <div className="checkbox-wrapper">
              <label className="checkbox-label returned-checkbox">
                <input
                  type="checkbox"
                  checked={item.isBack}
                  onChange={() => onUpdateItemStatus(item.id, 'isBack')}
                  data-testid={`item-${item.id}-back`}
                />
                <span>Back</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
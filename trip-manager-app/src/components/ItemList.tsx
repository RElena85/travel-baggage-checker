import React from 'react';
import { Item } from '../types';
import './components.css';

interface ItemListProps {
  items: Item[];
  onUpdateItemStatus: (itemId: string, field: 'isIn' | 'isBack') => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onUpdateItemStatus }) => {
  return (
    <div className="item-list">
      <h2>Items for Your Trip</h2>
      <div className="item-list-header">
        <span>Item Name</span>
        <span>Packed</span>
        <span>Returned</span>
      </div>
      <ul>
        {items.map(item => (
          <li key={item.id} className="item">
            <span className="item-name">{item.name}</span>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={item.isIn}
                onChange={() => onUpdateItemStatus(item.id, 'isIn')}
                data-testid={`item-${item.id}-in`}
              />
              <span>In</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={item.isBack}
                onChange={() => onUpdateItemStatus(item.id, 'isBack')}
                data-testid={`item-${item.id}-back`}
              />
              <span>Back</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
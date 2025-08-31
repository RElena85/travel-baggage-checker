import React, { useState } from 'react';

interface ItemFormProps {
  onSubmit: (item: { name: string; quantity: number }) => void;
  existingItem?: { name: string; quantity: number };
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, existingItem }) => {
  const [name, setName] = useState(existingItem ? existingItem.name : '');
  const [quantity, setQuantity] = useState(existingItem ? existingItem.quantity : 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, quantity });
    setName('');
    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <div>
        <label htmlFor="item-name">Item Name:</label>
        <input
          type="text"
          id="item-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="item-quantity">Quantity:</label>
        <input
          type="number"
          id="item-quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          required
        />
      </div>
      <button type="submit">{existingItem ? 'Update Item' : 'Add Item'}</button>
    </form>
  );
};

export default ItemForm;
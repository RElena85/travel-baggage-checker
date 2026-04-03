import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useTripContext } from '../context/TripContext';
import { Item, ItemCategory } from '../types';
import { ITEM_CATEGORIES } from '../utils/helpers';

interface EditableItemListProps {
  tripId: string;
  items: Item[];
}

type GroupBy = 'category' | 'tag' | 'none';

export default function EditableItemList({ tripId, items }: EditableItemListProps) {
  const {
    updateItemStatus,
    addItemToTrip,
    removeItemFromTrip,
    updateItemName,
    updateItemTag,
    updateItemCategory,
  } = useTripContext();

  const [groupBy, setGroupBy] = useState<GroupBy>('category');
  const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('otros');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ItemCategory>('otros');
  const [editTag, setEditTag] = useState('');

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItemId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingItemId]);

  const categoryOrder = Object.keys(ITEM_CATEGORIES) as ItemCategory[];
  const existingTags = Array.from(new Set(items.map(i => i.tag).filter(Boolean))) as string[];

  function handleAddItem() {
    if (!newItemName.trim()) return;
    addItemToTrip(tripId, newItemName.trim(), newItemCategory);
    setNewItemName('');
    setNewItemCategory('otros');
  }

  function handleAddKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  }

  function startEdit(item: Item) {
    setEditingItemId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditTag(item.tag || '');
  }

  function saveEdit() {
    if (!editName.trim() || !editingItemId) return;
    updateItemName(tripId, editingItemId, editName.trim());
    updateItemCategory(tripId, editingItemId, editCategory);
    updateItemTag(tripId, editingItemId, editTag);
    setEditingItemId(null);
  }

  function cancelEdit() {
    setEditingItemId(null);
  }

  function handleEditKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  // Filter
  const filteredItems =
    groupBy === 'category' && filterCategory !== 'all'
      ? items.filter(i => i.category === filterCategory)
      : items;

  // Group
  function buildGroups(): Array<{ key: string; label: string; items: Item[] }> {
    if (groupBy === 'none') {
      return [{ key: 'all', label: 'All Items', items: filteredItems }];
    }
    if (groupBy === 'category') {
      return categoryOrder
        .map(cat => ({
          key: cat,
          label: `${ITEM_CATEGORIES[cat].icon} ${ITEM_CATEGORIES[cat].label}`,
          items: filteredItems.filter(i => i.category === cat),
        }))
        .filter(g => g.items.length > 0);
    }
    // group by tag
    const tagged: Record<string, Item[]> = {};
    const untagged: Item[] = [];
    filteredItems.forEach(item => {
      if (item.tag) {
        if (!tagged[item.tag]) tagged[item.tag] = [];
        tagged[item.tag].push(item);
      } else {
        untagged.push(item);
      }
    });
    const groups = Object.entries(tagged).map(([tag, its]) => ({
      key: tag,
      label: `🏷️ ${tag}`,
      items: its,
    }));
    if (untagged.length > 0) {
      groups.push({ key: 'untagged', label: 'Untagged', items: untagged });
    }
    return groups;
  }

  const groups = buildGroups();

  return (
    <div className="editable-item-list">
      <div className="item-list-controls">
        <div className="control-group">
          <label className="form-label">Group by</label>
          <select
            className="form-select"
            value={groupBy}
            onChange={e => setGroupBy(e.target.value as GroupBy)}
            data-testid="group-by-select"
          >
            <option value="category">Category</option>
            <option value="tag">Tag</option>
            <option value="none">None</option>
          </select>
        </div>
        {groupBy === 'category' && (
          <div className="control-group">
            <label className="form-label">Filter Category</label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value as ItemCategory | 'all')}
              data-testid="filter-category-select"
            >
              <option value="all">All Categories</option>
              {categoryOrder.map(cat => (
                <option key={cat} value={cat}>
                  {ITEM_CATEGORIES[cat].icon} {ITEM_CATEGORIES[cat].label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="add-item-row">
        <input
          type="text"
          className="form-input"
          placeholder="Add item..."
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
          onKeyDown={handleAddKeyDown}
          data-testid="new-item-input"
        />
        <select
          className="form-select"
          value={newItemCategory}
          onChange={e => setNewItemCategory(e.target.value as ItemCategory)}
        >
          {categoryOrder.map(cat => (
            <option key={cat} value={cat}>
              {ITEM_CATEGORIES[cat].icon} {ITEM_CATEGORIES[cat].label}
            </option>
          ))}
        </select>
        <button type="button" className="btn-secondary" onClick={handleAddItem}>
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="empty-state-text">📦 No items yet — Add your first item</p>
      ) : (
        groups.map(group => (
          <div key={group.key} className="item-group">
            <div className="item-group-header">
              <span>{group.label}</span>
              <span className="item-group-count">{group.items.length}</span>
            </div>
            {group.items.map(item => (
              <div
                key={item.id}
                className={`item-row${item.isIn ? ' packed' : ''}`}
              >
                {editingItemId === item.id ? (
                  <div className="item-edit-row">
                    <input
                      ref={editInputRef}
                      type="text"
                      className="form-input"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                    />
                    <select
                      className="form-select"
                      value={editCategory}
                      onChange={e => setEditCategory(e.target.value as ItemCategory)}
                    >
                      {categoryOrder.map(cat => (
                        <option key={cat} value={cat}>
                          {ITEM_CATEGORIES[cat].icon} {ITEM_CATEGORIES[cat].label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Tag (optional)"
                      value={editTag}
                      onChange={e => setEditTag(e.target.value)}
                      list="existing-tags"
                    />
                    <datalist id="existing-tags">
                      {existingTags.map(tag => (
                        <option key={tag} value={tag} />
                      ))}
                    </datalist>
                    <button className="btn-primary" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="btn-secondary" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={item.isIn}
                      onChange={() => updateItemStatus(tripId, item.id, 'isIn')}
                      data-testid={`item-${item.id}-in`}
                      title="Packed"
                    />
                    <input
                      type="checkbox"
                      checked={item.isBack}
                      onChange={() => updateItemStatus(tripId, item.id, 'isBack')}
                      data-testid={`item-${item.id}-back`}
                      title="Returned"
                    />
                    <span className="item-name">{item.name}</span>
                    <span
                      className="category-badge"
                      style={{ backgroundColor: ITEM_CATEGORIES[item.category].color } as React.CSSProperties}
                    >
                      {ITEM_CATEGORIES[item.category].icon}{' '}
                      {ITEM_CATEGORIES[item.category].label}
                    </span>
                    {item.tag && <span className="tag-badge">{item.tag}</span>}
                    <button
                      className="btn-icon"
                      onClick={() => startEdit(item)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-icon-remove"
                      onClick={() => removeItemFromTrip(tripId, item.id)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

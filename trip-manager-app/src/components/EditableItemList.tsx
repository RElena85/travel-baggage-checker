import React, { useState } from 'react';
import { Item, ItemCategory, ITEM_CATEGORIES } from '../types';

interface EditableItemListProps {
    items: Item[];
    tripId: string;
    onUpdateItemStatus: (itemId: string, field: 'isIn' | 'isBack') => void;
    onUpdateItemName: (itemId: string, newName: string) => void;
    onUpdateItemTag: (itemId: string, tag: string) => void;
    onUpdateItemCategory: (itemId: string, category: ItemCategory) => void;
    onRemoveItem: (itemId: string) => void;
    onAddItem: (itemName: string, category: ItemCategory) => void;
}

const EditableItemList: React.FC<EditableItemListProps> = ({
    items,
    tripId,
    onUpdateItemStatus,
    onUpdateItemName,
    onUpdateItemTag,
    onUpdateItemCategory,
    onRemoveItem,
    onAddItem
}) => {
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingTag, setEditingTag] = useState('');
    const [editingCategory, setEditingCategory] = useState<ItemCategory>('otros');
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('otros');
    const [groupBy, setGroupBy] = useState<'category' | 'tag' | 'none'>('category');
    const [filterCategory, setFilterCategory] = useState<ItemCategory | 'all'>('all');

    // Get unique tags (keeping backward compatibility)
    const uniqueTags = Array.from(new Set(items.map(item => item.tag).filter(Boolean)));

    // Group items by category or tag
    const groupedItems = React.useMemo(() => {
        if (groupBy === 'none') {
            return { 'All Items': items };
        }

        if (groupBy === 'category') {
            const groups: { [key: string]: Item[] } = {};
            
            Object.entries(ITEM_CATEGORIES).forEach(([categoryKey, categoryInfo]) => {
                const categoryItems = items.filter(item => 
                    item.category === categoryKey && 
                    (filterCategory === 'all' || filterCategory === categoryKey)
                );
                if (categoryItems.length > 0) {
                    groups[categoryKey] = categoryItems;
                }
            });

            return groups;
        }

        // Tag grouping (legacy support)
        const groups: { [key: string]: Item[] } = {};
        const untaggedItems = items.filter(item => !item.tag);
        
        if (untaggedItems.length > 0) {
            groups['Untagged'] = untaggedItems;
        }

        uniqueTags.forEach(tag => {
            const tagItems = items.filter(item => item.tag === tag);
            if (tagItems.length > 0) {
                groups[tag!] = tagItems;
            }
        });

        return groups;
    }, [items, groupBy, filterCategory, uniqueTags]);

    const startEditing = (item: Item) => {
        setEditingItem(item.id);
        setEditingName(item.name);
        setEditingTag(item.tag || '');
        setEditingCategory(item.category);
    };

    const saveEdit = () => {
        if (editingItem && editingName.trim()) {
            onUpdateItemName(editingItem, editingName.trim());
            onUpdateItemTag(editingItem, editingTag.trim());
            onUpdateItemCategory(editingItem, editingCategory);
            setEditingItem(null);
            setEditingName('');
            setEditingTag('');
            setEditingCategory('otros');
        }
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditingName('');
        setEditingTag('');
        setEditingCategory('otros');
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim()) {
            onAddItem(newItemName.trim(), newItemCategory);
            setNewItemName('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveEdit();
        } else if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    return (
        <div className="editable-item-list">
            {/* Controls */}
            <div className="item-controls mb-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Group by:</label>
                        <select 
                            value={groupBy} 
                            onChange={(e) => setGroupBy(e.target.value as 'category' | 'tag' | 'none')}
                            className="form-select"
                        >
                            <option value="category">Category</option>
                            <option value="tag">Tag</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    {groupBy === 'category' && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Filter Category:</label>
                            <select 
                                value={filterCategory} 
                                onChange={(e) => setFilterCategory(e.target.value as ItemCategory | 'all')}
                                className="form-select"
                            >
                                <option value="all">All Categories</option>
                                {Object.entries(ITEM_CATEGORIES).map(([key, category]) => (
                                    <option key={key} value={key}>
                                        {category.icon} {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Add new item form */}
            <form onSubmit={handleAddItem} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Add new item..."
                        className="form-input flex-1"
                    />
                    <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                        className="form-select"
                    >
                        {Object.entries(ITEM_CATEGORIES).map(([key, category]) => (
                            <option key={key} value={key}>
                                {category.icon} {category.label}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="btn btn-primary">
                        ➕ Add
                    </button>
                </div>
            </form>

            {/* Items grouped display */}
            {Object.entries(groupedItems).map(([groupName, groupItems]) => {
                const categoryInfo = ITEM_CATEGORIES[groupName as ItemCategory];
                
                return (
                    <div key={groupName} className="item-group mb-6">
                        {groupBy !== 'none' && (
                            <div 
                                className="category-header mb-3"
                                style={{ 
                                    backgroundColor: categoryInfo?.color || '#f5f5f5',
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    borderRadius: 'var(--border-radius)',
                                    border: '1px solid var(--gray-200)'
                                }}
                            >
                                <h3 className="group-title">
                                    {categoryInfo ? (
                                        <>
                                            <span className="category-icon">{categoryInfo.icon}</span>
                                            <span className="category-label">{categoryInfo.label}</span>
                                        </>
                                    ) : groupName === 'Untagged' ? (
                                        '📦 Untagged Items'
                                    ) : (
                                        `🏷️ ${groupName}`
                                    )}
                                    <span className="group-count">({groupItems.length})</span>
                                </h3>
                            </div>
                        )}

                        <div className="items-grid">
                            {groupItems.map((item) => (
                                <div key={item.id} className="item-card">
                                    <div className="item-checkboxes">
                                        <label className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                checked={item.isIn}
                                                onChange={() => onUpdateItemStatus(item.id, 'isIn')}
                                                data-testid={`item-${item.id}-in`}
                                            />
                                            <span className="checkmark in-checkmark"></span>
                                            <span className="checkbox-label">Packed</span>
                                        </label>

                                        <label className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                checked={item.isBack}
                                                onChange={() => onUpdateItemStatus(item.id, 'isBack')}
                                                data-testid={`item-${item.id}-back`}
                                            />
                                            <span className="checkmark back-checkmark"></span>
                                            <span className="checkbox-label">Returned</span>
                                        </label>
                                    </div>

                                    <div className="item-content">
                                        {editingItem === item.id ? (
                                            <div className="item-edit-form">
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={handleKeyPress}
                                                    className="form-input mb-2"
                                                    placeholder="Item name"
                                                    autoFocus
                                                />
                                                <select
                                                    value={editingCategory}
                                                    onChange={(e) => setEditingCategory(e.target.value as ItemCategory)}
                                                    className="form-select mb-2"
                                                >
                                                    {Object.entries(ITEM_CATEGORIES).map(([key, cat]) => (
                                                        <option key={key} value={key}>
                                                            {cat.icon} {cat.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={editingTag}
                                                    onChange={(e) => setEditingTag(e.target.value)}
                                                    onKeyDown={handleKeyPress}
                                                    className="form-input mb-2"
                                                    placeholder="Tag (optional)"
                                                    list="existing-tags"
                                                />
                                                <datalist id="existing-tags">
                                                    {uniqueTags.map(tag => (
                                                        <option key={tag} value={tag} />
                                                    ))}
                                                </datalist>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={saveEdit}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        ✓ Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEdit}
                                                        className="btn btn-secondary btn-sm"
                                                    >
                                                        ✕ Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="item-display">
                                                <div className="item-name">{item.name}</div>
                                                <div className="item-meta">
                                                    {ITEM_CATEGORIES[item.category] && (
                                                        <span className="item-category">
                                                            {ITEM_CATEGORIES[item.category].icon} {ITEM_CATEGORIES[item.category].label}
                                                        </span>
                                                    )}
                                                    {item.tag && (
                                                        <span className="item-tag">🏷️ {item.tag}</span>
                                                    )}
                                                </div>
                                                <div className="item-actions">
                                                    <button
                                                        onClick={() => startEditing(item)}
                                                        className="btn-icon"
                                                        title="Edit item"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => onRemoveItem(item.id)}
                                                        className="btn-icon btn-danger"
                                                        title="Remove item"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {items.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <h3>No items yet</h3>
                    <p>Add your first item to get started!</p>
                </div>
            )}
        </div>
    );
};

export default EditableItemList;
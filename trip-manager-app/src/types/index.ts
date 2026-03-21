// Predefined categories for organizing items
export type ItemCategory = 
    | 'higiene'
    | 'ropa-interior'
    | 'ropa-exterior'
    | 'calzado'
    | 'electronica'
    | 'documentos'
    | 'medicamentos'
    | 'accesorios'
    | 'entretenimiento'
    | 'otros';

export const ITEM_CATEGORIES: Record<ItemCategory, { label: string; icon: string; color: string }> = {
    'higiene': { label: 'Higiene Personal', icon: '🧴', color: '#e3f2fd' },
    'ropa-interior': { label: 'Ropa Interior', icon: '👙', color: '#fce4ec' },
    'ropa-exterior': { label: 'Ropa Exterior', icon: '👕', color: '#f3e5f5' },
    'calzado': { label: 'Calzado', icon: '👟', color: '#fff3e0' },
    'electronica': { label: 'Electrónicos', icon: '📱', color: '#e8f5e8' },
    'documentos': { label: 'Documentos', icon: '📄', color: '#fff8e1' },
    'medicamentos': { label: 'Medicamentos', icon: '💊', color: '#ffebee' },
    'accesorios': { label: 'Accesorios', icon: '🎒', color: '#f1f8e9' },
    'entretenimiento': { label: 'Entretenimiento', icon: '🎧', color: '#e0f2f1' },
    'otros': { label: 'Otros', icon: '📦', color: '#f5f5f5' }
};

export interface Item {
    id: string;
    name: string;
    isIn: boolean;  // First checkbox - item is packed/in
    isBack: boolean; // Second checkbox - item is back from trip
    category: ItemCategory; // Required category for grouping items
    tag?: string; // Optional tag for grouping items
}

export interface Trip {
    id: string;
    name: string;
    destination?: string;
    departureDate?: string; // ISO date string YYYY-MM-DD
    items: Item[];
    createdAt: Date;
    updatedAt: Date;
}
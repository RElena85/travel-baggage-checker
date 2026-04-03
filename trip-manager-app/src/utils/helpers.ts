import { Trip, ItemCategory } from '../types';

export const ITEM_CATEGORIES: Record<ItemCategory, { label: string; icon: string; color: string }> = {
  higiene: { label: 'Higiene Personal', icon: '🧴', color: '#e3f2fd' },
  'ropa-interior': { label: 'Ropa Interior', icon: '👙', color: '#fce4ec' },
  'ropa-exterior': { label: 'Ropa Exterior', icon: '👕', color: '#f3e5f5' },
  calzado: { label: 'Calzado', icon: '👟', color: '#fff3e0' },
  electronica: { label: 'Electrónicos', icon: '📱', color: '#e8f5e8' },
  documentos: { label: 'Documentos', icon: '📄', color: '#fff8e1' },
  medicamentos: { label: 'Medicamentos', icon: '💊', color: '#ffebee' },
  accesorios: { label: 'Accesorios', icon: '🎒', color: '#f1f8e9' },
  entretenimiento: { label: 'Entretenimiento', icon: '🎧', color: '#e0f2f1' },
  otros: { label: 'Otros', icon: '📦', color: '#f5f5f5' },
};

export function migrateTripsToCategories(trips: any[]): Trip[] {
  return trips.map((trip: any) => ({
    ...trip,
    createdAt: trip.createdAt ? new Date(trip.createdAt) : new Date(),
    updatedAt: trip.updatedAt ? new Date(trip.updatedAt) : new Date(),
    items: (trip.items || []).map((item: any) => ({
      id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: item.name || '',
      isIn: item.isIn ?? item.packed ?? false,
      isBack: item.isBack ?? false,
      category: (item.category as ItemCategory) || 'otros',
      ...(item.tag ? { tag: item.tag } : {}),
    })),
  }));
}

export function generateItemId(index: number): string {
  return `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`;
}

export function calculateProgress(items: Trip['items']): { packed: number; total: number; percentage: number } {
  const total = items.length;
  const packed = items.filter(item => item.isIn).length;
  const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);
  return { packed, total, percentage };
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

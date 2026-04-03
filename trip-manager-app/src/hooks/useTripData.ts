import { useState, useEffect } from 'react';
import { Trip, Item, ItemCategory } from '../types';
import { migrateTripsToCategories } from '../utils/helpers';

const STORAGE_KEY = 'trippacker_trips';

export function useTripData() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTrips(migrateTripsToCategories(parsed));
      }
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    }
  }, [trips, loading]);

  function addTrip(
    name: string,
    items: Array<{ name: string; category?: ItemCategory }>,
    destination?: string,
    departureDate?: string
  ) {
    const now = new Date();
    const id = Date.now().toString();
    const newTrip: Trip = {
      id,
      name: name.trim(),
      destination,
      departureDate,
      items: items
        .filter(item => item.name.trim())
        .map((item, index) => ({
          id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
          name: item.name.trim(),
          isIn: false,
          isBack: false,
          category: item.category || 'otros',
        })),
      createdAt: now,
      updatedAt: now,
    };
    setTrips(prev => [...prev, newTrip]);
  }

  function copyTrip(tripId: string) {
    setTrips(prev => {
      const trip = prev.find(t => t.id === tripId);
      if (!trip) return prev;
      const now = new Date();
      const copied: Trip = {
        ...trip,
        id: Date.now().toString(),
        name: `${trip.name} (Copy)`,
        items: trip.items.map(item => ({
          ...item,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          isIn: false,
          isBack: false,
        })),
        createdAt: now,
        updatedAt: now,
      };
      return [...prev, copied];
    });
  }

  function deleteTrip(tripId: string) {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  }

  function updateItemStatus(tripId: string, itemId: string, field: 'isIn' | 'isBack') {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              updatedAt: new Date(),
              items: trip.items.map(item =>
                item.id === itemId ? { ...item, [field]: !item[field] } : item
              ),
            }
          : trip
      )
    );
  }

  function addItemToTrip(tripId: string, itemName: string, category?: ItemCategory) {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== tripId) return trip;
        const newItem: Item = {
          id: `${Date.now()}-0-${Math.random().toString(36).slice(2, 7)}`,
          name: itemName.trim(),
          isIn: false,
          isBack: false,
          category: category || 'otros',
        };
        return { ...trip, updatedAt: new Date(), items: [...trip.items, newItem] };
      })
    );
  }

  function removeItemFromTrip(tripId: string, itemId: string) {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? { ...trip, updatedAt: new Date(), items: trip.items.filter(i => i.id !== itemId) }
          : trip
      )
    );
  }

  function updateTripName(tripId: string, newName: string) {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId ? { ...trip, name: newName.trim(), updatedAt: new Date() } : trip
      )
    );
  }

  function updateItemName(tripId: string, itemId: string, newName: string) {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              updatedAt: new Date(),
              items: trip.items.map(item =>
                item.id === itemId ? { ...item, name: newName.trim() } : item
              ),
            }
          : trip
      )
    );
  }

  function updateItemTag(tripId: string, itemId: string, tag: string) {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              updatedAt: new Date(),
              items: trip.items.map(item =>
                item.id === itemId ? { ...item, tag } : item
              ),
            }
          : trip
      )
    );
  }

  function updateItemCategory(tripId: string, itemId: string, category: ItemCategory) {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              updatedAt: new Date(),
              items: trip.items.map(item =>
                item.id === itemId ? { ...item, category } : item
              ),
            }
          : trip
      )
    );
  }

  function markAllPacked(tripId: string) {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              updatedAt: new Date(),
              items: trip.items.map(item => ({ ...item, isIn: true })),
            }
          : trip
      )
    );
  }

  function unpackAll(tripId: string) {
    setTrips(prev =>
      prev.map(trip =>
        trip.id === tripId
          ? {
              ...trip,
              updatedAt: new Date(),
              items: trip.items.map(item => ({ ...item, isIn: false, isBack: false })),
            }
          : trip
      )
    );
  }

  function clearAllTrips() {
    setTrips([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  function getTrip(tripId: string): Trip | undefined {
    return trips.find(t => t.id === tripId);
  }

  function exportTrips(): string {
    return JSON.stringify(trips, null, 2);
  }

  function importTrips(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) return false;
      const migrated = migrateTripsToCategories(parsed);
      setTrips(migrated);
      return true;
    } catch {
      return false;
    }
  }

  return {
    trips,
    loading,
    addTrip,
    copyTrip,
    deleteTrip,
    updateItemStatus,
    addItemToTrip,
    removeItemFromTrip,
    updateTripName,
    updateItemName,
    updateItemTag,
    updateItemCategory,
    markAllPacked,
    unpackAll,
    clearAllTrips,
    getTrip,
    exportTrips,
    importTrips,
  };
}

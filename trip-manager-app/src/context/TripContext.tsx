import React, { createContext, useContext } from 'react';
import { Trip, ItemCategory } from '../types';
import { useTripData } from '../hooks/useTripData';

interface TripContextValue {
  trips: Trip[];
  loading: boolean;
  addTrip: (
    name: string,
    items: Array<{ name: string; category?: ItemCategory }>,
    destination?: string,
    departureDate?: string
  ) => void;
  copyTrip: (tripId: string) => void;
  deleteTrip: (tripId: string) => void;
  updateItemStatus: (tripId: string, itemId: string, field: 'isIn' | 'isBack') => void;
  addItemToTrip: (tripId: string, itemName: string, category?: ItemCategory) => void;
  removeItemFromTrip: (tripId: string, itemId: string) => void;
  updateTripName: (tripId: string, newName: string) => void;
  updateItemName: (tripId: string, itemId: string, newName: string) => void;
  updateItemTag: (tripId: string, itemId: string, tag: string) => void;
  updateItemCategory: (tripId: string, itemId: string, category: ItemCategory) => void;
  markAllPacked: (tripId: string) => void;
  unpackAll: (tripId: string) => void;
  clearAllTrips: () => void;
  getTrip: (tripId: string) => Trip | undefined;
  exportTrips: () => string;
  importTrips: (json: string) => boolean;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const data = useTripData();

  return (
    <TripContext.Provider value={data}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used inside TripProvider');
  return ctx;
}

import React, { createContext, useContext, ReactNode } from 'react';
import { Trip, ItemCategory } from '../types';
import useTripData from '../hooks/useTripData';

interface TripContextType {
  trips: Trip[];
  loading: boolean;
  addTrip: (tripName: string, items: { name: string; category: ItemCategory }[]) => void;
  copyTrip: (tripId: string) => void;
  updateItemStatus: (tripId: string, itemId: string, field: 'isIn' | 'isBack') => void;
  addItemToTrip: (tripId: string, itemName: string, category?: ItemCategory) => void;
  deleteTrip: (tripId: string) => void;
  getTrip: (tripId: string) => Trip | undefined;
  clearAllTrips: () => void;
  exportTrips: () => string;
  importTrips: (tripsJson: string) => boolean;
  updateTripName: (tripId: string, newName: string) => void;
  updateItemName: (tripId: string, itemId: string, newName: string) => void;
  updateItemTag: (tripId: string, itemId: string, tag: string) => void;
  updateItemCategory: (tripId: string, itemId: string, category: ItemCategory) => void;
  removeItemFromTrip: (tripId: string, itemId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const tripData = useTripData();

  return (
    <TripContext.Provider value={tripData}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export default TripContext;
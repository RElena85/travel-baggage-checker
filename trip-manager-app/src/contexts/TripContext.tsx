import React, { createContext, useContext, ReactNode } from 'react';
import useTripData from '../hooks/useTripData';

interface TripContextType {
  trips: any[];
  loading: boolean;
  addTrip: (tripName: string, items: { name: string }[]) => void;
  copyTrip: (tripId: string) => void;
  updateItemStatus: (tripId: string, itemId: string, field: 'isIn' | 'isBack') => void;
  addItemToTrip: (tripId: string, itemName: string) => void;
  deleteTrip: (tripId: string) => void;
  getTrip: (tripId: string) => any;
  clearAllTrips: () => void;
  exportTrips: () => string;
  importTrips: (tripsJson: string) => boolean;
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
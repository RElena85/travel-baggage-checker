import { Trip, Item } from '../types';

export const formatTripName = (name: string): string => {
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
};

export const validateItemName = (name: string): boolean => {
    return name.length > 0 && name.length <= 50;
};

export const copyTripData = (trip: Trip): Trip => {
    return {
        ...trip,
        id: new Date().getTime().toString(), // Generate a new ID based on the current timestamp
        items: trip.items.map((item: Item) => ({ ...item, isIn: false, isBack: false })) // Reset item checked status
    };
};
import { useState, useEffect } from 'react';
import { Trip, Item } from '../types';

const useTripData = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // Load trips from localStorage on component mount
        const savedTrips = localStorage.getItem('trips');
        if (savedTrips) {
            setTrips(JSON.parse(savedTrips));
        }
        setLoading(false);
    }, []);

    // Save trips to localStorage whenever trips change
    useEffect(() => {
        localStorage.setItem('trips', JSON.stringify(trips));
    }, [trips]);

    const addTrip = (newTrip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
        const trip: Trip = {
            ...newTrip,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        setTrips([...trips, trip]);
    };

    const copyTrip = (tripToCopy: Trip) => {
        const copiedTrip: Trip = {
            ...tripToCopy,
            id: Date.now().toString(),
            name: `${tripToCopy.name} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: tripToCopy.items.map(item => ({
                ...item,
                id: `${Date.now()}-${Math.random()}`,
                isIn: false,
                isBack: false
            }))
        };
        setTrips([...trips, copiedTrip]);
    };

    const updateItemStatus = (tripId: string, itemId: string, field: 'isIn' | 'isBack') => {
        setTrips(trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    updatedAt: new Date(),
                    items: trip.items.map(item => 
                        item.id === itemId ? { ...item, [field]: !item[field] } : item
                    )
                };
            }
            return trip;
        }));
    };

    const addItemToTrip = (tripId: string, itemName: string) => {
        const newItem: Item = {
            id: `${Date.now()}-${Math.random()}`,
            name: itemName,
            isIn: false,
            isBack: false
        };

        setTrips(trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    updatedAt: new Date(),
                    items: [...trip.items, newItem]
                };
            }
            return trip;
        }));
    };

    const deleteTrip = (tripId: string) => {
        setTrips(trips.filter(trip => trip.id !== tripId));
    };

    const getTrip = (tripId: string) => {
        return trips.find(trip => trip.id === tripId);
    };

    return {
        trips,
        loading,
        addTrip,
        copyTrip,
        updateItemStatus,
        addItemToTrip,
        deleteTrip,
        getTrip
    };
};

export default useTripData;
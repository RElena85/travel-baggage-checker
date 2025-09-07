import { useState, useEffect } from 'react';
import { Trip, Item, ItemCategory } from '../types';

const STORAGE_KEY = 'trippacker_trips';

// Migration function to ensure all items have categories
const migrateTripsToCategories = (trips: any[]): Trip[] => {
    return trips.map(trip => ({
        ...trip,
        items: trip.items.map((item: any) => ({
            ...item,
            category: item.category || 'otros' as ItemCategory // Default to 'otros' if no category
        }))
    }));
};

const useTripData = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Load trips from localStorage on component mount
    useEffect(() => {
        try {
            const savedTrips = localStorage.getItem(STORAGE_KEY);
            if (savedTrips) {
                const parsedTrips = JSON.parse(savedTrips);
                // Ensure dates are properly converted back to Date objects
                const tripsWithDates = parsedTrips.map((trip: any) => ({
                    ...trip,
                    createdAt: new Date(trip.createdAt),
                    updatedAt: new Date(trip.updatedAt)
                }));
                
                // Migrate trips to ensure all items have categories
                const migratedTrips = migrateTripsToCategories(tripsWithDates);
                setTrips(migratedTrips);
            }
        } catch (error) {
            console.error('Error loading trips from localStorage:', error);
            // If there's an error, start with empty trips
            setTrips([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Save trips to localStorage whenever trips change
    useEffect(() => {
        if (!loading) { // Only save after initial load is complete
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
                console.log(`Saved ${trips.length} trips to localStorage`);
            } catch (error) {
                console.error('Error saving trips to localStorage:', error);
            }
        }
    }, [trips, loading]);

    const addTrip = (tripName: string, items: { name: string; category: ItemCategory }[]) => {
        const trip: Trip = {
            id: Date.now().toString(),
            name: tripName,
            items: items.map((item, index) => ({
                id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
                name: item.name,
                category: item.category,
                isIn: false,
                isBack: false
            })),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        setTrips(prevTrips => {
            const newTrips = [...prevTrips, trip];
            console.log(`Added new trip "${tripName}" with ${items.length} items`);
            return newTrips;
        });
    };

    const copyTrip = (tripId: string) => {
        const originalTrip = trips.find(trip => trip.id === tripId);
        if (!originalTrip) return;
        
        const copiedTrip: Trip = {
            ...originalTrip,
            id: Date.now().toString(),
            name: `${originalTrip.name} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
            items: originalTrip.items.map(item => ({
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

    const addItemToTrip = (tripId: string, itemName: string, category: ItemCategory = 'otros') => {
        const newItem: Item = {
            id: `${Date.now()}-${Math.random()}`,
            name: itemName,
            category: category,
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

    const clearAllTrips = () => {
        setTrips([]);
        localStorage.removeItem(STORAGE_KEY);
        console.log('All trips cleared from localStorage');
    };

    const exportTrips = () => {
        return JSON.stringify(trips, null, 2);
    };

    const importTrips = (tripsJson: string) => {
        try {
            const importedTrips = JSON.parse(tripsJson);
            const tripsWithDates = importedTrips.map((trip: any) => ({
                ...trip,
                createdAt: new Date(trip.createdAt),
                updatedAt: new Date(trip.updatedAt)
            }));
            setTrips(tripsWithDates);
            console.log(`Imported ${tripsWithDates.length} trips`);
            return true;
        } catch (error) {
            console.error('Error importing trips:', error);
            return false;
        }
    };

    const updateTripName = (tripId: string, newName: string) => {
        setTrips(trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    name: newName,
                    updatedAt: new Date()
                };
            }
            return trip;
        }));
    };

    const updateItemName = (tripId: string, itemId: string, newName: string) => {
        setTrips(trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    updatedAt: new Date(),
                    items: trip.items.map(item => 
                        item.id === itemId ? { ...item, name: newName } : item
                    )
                };
            }
            return trip;
        }));
    };

    const updateItemTag = (tripId: string, itemId: string, tag: string) => {
        setTrips(trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    updatedAt: new Date(),
                    items: trip.items.map(item => 
                        item.id === itemId ? { ...item, tag: tag || undefined } : item
                    )
                };
            }
            return trip;
        }));
    };

    const updateItemCategory = (tripId: string, itemId: string, category: ItemCategory) => {
        setTrips(trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    updatedAt: new Date(),
                    items: trip.items.map(item => 
                        item.id === itemId ? { ...item, category } : item
                    )
                };
            }
            return trip;
        }));
    };

    const removeItemFromTrip = (tripId: string, itemId: string) => {
        setTrips(trips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    updatedAt: new Date(),
                    items: trip.items.filter(item => item.id !== itemId)
                };
            }
            return trip;
        }));
    };

    return {
        trips,
        loading,
        addTrip,
        copyTrip,
        updateItemStatus,
        addItemToTrip,
        deleteTrip,
        getTrip,
        clearAllTrips,
        exportTrips,
        importTrips,
        updateTripName,
        updateItemName,
        updateItemTag,
        updateItemCategory,
        removeItemFromTrip
    };
};

export default useTripData;
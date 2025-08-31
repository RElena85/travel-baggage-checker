export const formatTripName = (name: string): string => {
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
};

export const validateItemName = (name: string): boolean => {
    return name.length > 0 && name.length <= 50;
};

export const copyTrip = (trip: any): any => {
    return {
        ...trip,
        id: new Date().getTime(), // Generate a new ID based on the current timestamp
        items: trip.items.map(item => ({ ...item, checked: false })) // Reset item checked status
    };
};
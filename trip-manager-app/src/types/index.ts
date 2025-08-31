export interface Item {
    id: string;
    name: string;
    isIn: boolean;  // First checkbox - item is packed/in
    isBack: boolean; // Second checkbox - item is back from trip
}

export interface Trip {
    id: string;
    name: string;
    items: Item[];
    createdAt: Date;
    updatedAt: Date;
}
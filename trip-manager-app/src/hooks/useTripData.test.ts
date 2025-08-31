import { renderHook, act } from '@testing-library/react';
import useTripData from '../hooks/useTripData';
import { Trip, Item } from '../types';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('useTripData Hook', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear.mockClear();
  });

  it('should initialize with empty trips array', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useTripData());
    
    expect(result.current.trips).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should load trips from localStorage on initialization', () => {
    const savedTrips: Trip[] = [
      {
        id: '1',
        name: 'Test Trip',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedTrips));

    const { result } = renderHook(() => useTripData());

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].name).toBe('Test Trip');
  });

  it('should add a new trip', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.addTrip({
        name: 'New Trip',
        items: []
      });
    });

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].name).toBe('New Trip');
    expect(result.current.trips[0].id).toBeDefined();
    expect(result.current.trips[0].createdAt).toBeInstanceOf(Date);
  });

  it('should copy a trip with reset checkboxes', () => {
    const originalTrip: Trip = {
      id: '1',
      name: 'Original Trip',
      items: [
        { id: 'item1', name: 'Item 1', isIn: true, isBack: true },
        { id: 'item2', name: 'Item 2', isIn: false, isBack: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([originalTrip]));
    
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.copyTrip(originalTrip);
    });

    expect(result.current.trips).toHaveLength(2);
    const copiedTrip = result.current.trips[1];
    expect(copiedTrip.name).toBe('Original Trip (Copy)');
    expect(copiedTrip.items).toHaveLength(2);
    expect(copiedTrip.items[0].isIn).toBe(false);
    expect(copiedTrip.items[0].isBack).toBe(false);
    expect(copiedTrip.items[1].isIn).toBe(false);
    expect(copiedTrip.items[1].isBack).toBe(false);
  });

  it('should update item status (isIn)', () => {
    const trip: Trip = {
      id: '1',
      name: 'Test Trip',
      items: [
        { id: 'item1', name: 'Item 1', isIn: false, isBack: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([trip]));
    
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.updateItemStatus('1', 'item1', 'isIn');
    });

    expect(result.current.trips[0].items[0].isIn).toBe(true);
    expect(result.current.trips[0].items[0].isBack).toBe(false);
  });

  it('should update item status (isBack)', () => {
    const trip: Trip = {
      id: '1',
      name: 'Test Trip',
      items: [
        { id: 'item1', name: 'Item 1', isIn: false, isBack: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([trip]));
    
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.updateItemStatus('1', 'item1', 'isBack');
    });

    expect(result.current.trips[0].items[0].isBack).toBe(true);
    expect(result.current.trips[0].items[0].isIn).toBe(false);
  });

  it('should add item to trip', () => {
    const trip: Trip = {
      id: '1',
      name: 'Test Trip',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([trip]));
    
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.addItemToTrip('1', 'New Item');
    });

    expect(result.current.trips[0].items).toHaveLength(1);
    expect(result.current.trips[0].items[0].name).toBe('New Item');
    expect(result.current.trips[0].items[0].isIn).toBe(false);
    expect(result.current.trips[0].items[0].isBack).toBe(false);
  });

  it('should delete a trip', () => {
    const trips: Trip[] = [
      {
        id: '1',
        name: 'Trip 1',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Trip 2',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(trips));
    
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.deleteTrip('1');
    });

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].id).toBe('2');
  });

  it('should get a specific trip by id', () => {
    const trip: Trip = {
      id: '1',
      name: 'Test Trip',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([trip]));
    
    const { result } = renderHook(() => useTripData());

    const foundTrip = result.current.getTrip('1');
    expect(foundTrip).toBeDefined();
    expect(foundTrip?.name).toBe('Test Trip');

    const notFoundTrip = result.current.getTrip('999');
    expect(notFoundTrip).toBeUndefined();
  });

  it('should persist trips to localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.addTrip({
        name: 'Persistent Trip',
        items: []
      });
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'trips',
      expect.stringContaining('Persistent Trip')
    );
  });
});
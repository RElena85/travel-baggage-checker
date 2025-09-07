import { renderHook, act } from '@testing-library/react';
import useTripData from './useTripData';

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
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with empty trips when no localStorage data', () => {
    const { result } = renderHook(() => useTripData());

    expect(result.current.trips).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should load trips from localStorage on initialization', () => {
    const existingTrips = [
      {
        id: '1',
        name: 'Test Trip',
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingTrips));

    const { result } = renderHook(() => useTripData());

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].name).toBe('Test Trip');
  });

  it('should add a new trip', () => {
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.addTrip('New Trip', [{ name: 'Test Item', category: 'otros' }]);
    });

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].name).toBe('New Trip');
    expect(result.current.trips[0].items).toHaveLength(1);
    expect(result.current.trips[0].items[0].name).toBe('Test Item');
    expect(result.current.trips[0].items[0].category).toBe('otros');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'trippacker_trips',
      expect.stringContaining('New Trip')
    );
  });

  it('should copy a trip with reset item statuses', () => {
    const { result } = renderHook(() => useTripData());
    
    // First add a trip
    act(() => {
      result.current.addTrip('Original Trip', [{ name: 'Camera', category: 'electronica' }]);
    });

    const originalTripId = result.current.trips[0].id;

    act(() => {
      result.current.copyTrip(originalTripId);
    });

    expect(result.current.trips).toHaveLength(2);
    expect(result.current.trips[1].name).toBe('Original Trip (Copy)');
    expect(result.current.trips[1].items[0].isIn).toBe(false);
    expect(result.current.trips[1].items[0].isBack).toBe(false);
  });

  it('should update item status', () => {
    const { result } = renderHook(() => useTripData());
    
    // Add a trip with an item
    act(() => {
      result.current.addTrip('Test Trip', [{ name: 'Camera', category: 'electronica' }]);
    });

    const tripId = result.current.trips[0].id;
    const itemId = result.current.trips[0].items[0].id;

    act(() => {
      result.current.updateItemStatus(tripId, itemId, 'isIn');
    });

    expect(result.current.trips[0].items[0].isIn).toBe(true);
    expect(result.current.trips[0].items[0].isBack).toBe(false);
  });

  it('should delete a trip', () => {
    const { result } = renderHook(() => useTripData());
    
    // Add a trip
    act(() => {
      result.current.addTrip('Trip to Delete', []);
    });

    const tripId = result.current.trips[0].id;

    act(() => {
      result.current.deleteTrip(tripId);
    });

    expect(result.current.trips).toHaveLength(0);
  });

  it('should get a specific trip by id', () => {
    const { result } = renderHook(() => useTripData());
    
    // Add a trip
    act(() => {
      result.current.addTrip('Findable Trip', []);
    });

    const tripId = result.current.trips[0].id;
    const foundTrip = result.current.getTrip(tripId);

    expect(foundTrip).toBeDefined();
    expect(foundTrip?.name).toBe('Findable Trip');
  });

  it('should persist trips to localStorage', () => {
    const { result } = renderHook(() => useTripData());

    act(() => {
      result.current.addTrip('Persistent Trip', []);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'trippacker_trips',
      expect.stringContaining('Persistent Trip')
    );
  });
});
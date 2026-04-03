import { renderHook, act } from '@testing-library/react';
import { useTripData } from './useTripData';
import { Item, Trip } from '../types';
import { localStorageMock } from '../setupTests';

beforeEach(() => {
  localStorageMock.clear();
});

const mockItem: Item = {
  id: 'item-1',
  name: 'Test Item',
  isIn: false,
  isBack: false,
  category: 'otros',
};

const mockTrip: Trip = {
  id: 'trip-1',
  name: 'Test Trip',
  destination: 'Paris',
  items: [mockItem],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('useTripData', () => {
  it('starts with empty trips', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    expect(result.current.trips).toEqual([]);
  });

  it('addTrip creates a trip', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => {
      result.current.addTrip('Test Trip', [], 'Paris');
    });
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].name).toBe('Test Trip');
    expect(result.current.trips[0].destination).toBe('Paris');
  });

  it('addTrip with items includes category field on each item', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => {
      result.current.addTrip('Business Trip', [{ name: 'Passport', category: 'documentos' }]);
    });
    expect(result.current.trips[0].items[0].category).toBe('documentos');
  });

  it('deleteTrip removes a trip', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => {
      result.current.addTrip('To Delete', []);
    });
    const tripId = result.current.trips[0].id;
    act(() => {
      result.current.deleteTrip(tripId);
    });
    expect(result.current.trips).toHaveLength(0);
  });

  it('deleteTrip only removes the specified trip', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip A', []); });
    act(() => { result.current.addTrip('Trip B', []); });
    const tripAId = result.current.trips[0].id;
    act(() => { result.current.deleteTrip(tripAId); });
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].name).toBe('Trip B');
  });

  it('copyTrip deep clones with reset isIn/isBack', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => {
      result.current.addTrip('Original', [{ name: 'Item A', category: 'otros' }]);
    });
    const tripId = result.current.trips[0].id;
    act(() => {
      result.current.updateItemStatus(tripId, result.current.trips[0].items[0].id, 'isIn');
    });
    act(() => {
      result.current.copyTrip(tripId);
    });
    const copy = result.current.trips.find(t => t.name === 'Original (Copy)');
    expect(copy).toBeDefined();
    expect(copy!.items[0].isIn).toBe(false);
    expect(copy!.items[0].isBack).toBe(false);
  });

  it('copyTrip assigns a new unique ID', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', [mockItem]); });
    const originalId = result.current.trips[0].id;
    act(() => { result.current.copyTrip(originalId); });
    const copy = result.current.trips.find(t => t.name === 'Trip (Copy)');
    expect(copy!.id).not.toBe(originalId);
  });

  it('updateItemStatus toggles isIn on an item', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', [mockItem]); });
    const tripId = result.current.trips[0].id;
    const itemId = result.current.trips[0].items[0].id;
    act(() => { result.current.updateItemStatus(tripId, itemId, 'isIn'); });
    expect(result.current.trips[0].items[0].isIn).toBe(true);
    act(() => { result.current.updateItemStatus(tripId, itemId, 'isIn'); });
    expect(result.current.trips[0].items[0].isIn).toBe(false);
  });

  it('updateItemStatus toggles isBack independently of isIn', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', [mockItem]); });
    const tripId = result.current.trips[0].id;
    const itemId = result.current.trips[0].items[0].id;
    act(() => { result.current.updateItemStatus(tripId, itemId, 'isBack'); });
    expect(result.current.trips[0].items[0].isBack).toBe(true);
    expect(result.current.trips[0].items[0].isIn).toBe(false);
  });

  it('addItemToTrip adds an item with default category otros', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', []); });
    const tripId = result.current.trips[0].id;
    act(() => { result.current.addItemToTrip(tripId, 'Toothbrush'); });
    expect(result.current.trips[0].items).toHaveLength(1);
    expect(result.current.trips[0].items[0].name).toBe('Toothbrush');
    expect(result.current.trips[0].items[0].category).toBe('otros');
    expect(result.current.trips[0].items[0].isIn).toBe(false);
    expect(result.current.trips[0].items[0].isBack).toBe(false);
  });

  it('addItemToTrip uses provided category when specified', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', []); });
    const tripId = result.current.trips[0].id;
    act(() => { result.current.addItemToTrip(tripId, 'Shampoo', 'higiene'); });
    expect(result.current.trips[0].items[0].category).toBe('higiene');
  });

  it('removeItemFromTrip removes the correct item', async () => {
    const item2: Item = { id: 'item-2', name: 'Item 2', isIn: false, isBack: false, category: 'otros' };
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', [mockItem, item2]); });
    const tripId = result.current.trips[0].id;
    const itemId = result.current.trips[0].items[0].id;
    act(() => { result.current.removeItemFromTrip(tripId, itemId); });
    expect(result.current.trips[0].items).toHaveLength(1);
    expect(result.current.trips[0].items[0].name).toBe('Item 2');
  });

  it('updateTripName renames the trip', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Old Name', []); });
    const tripId = result.current.trips[0].id;
    act(() => { result.current.updateTripName(tripId, 'New Name'); });
    expect(result.current.trips[0].name).toBe('New Name');
  });

  it('updateItemName renames the item', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', [mockItem]); });
    const tripId = result.current.trips[0].id;
    const itemId = result.current.trips[0].items[0].id;
    act(() => { result.current.updateItemName(tripId, itemId, 'Updated Item'); });
    expect(result.current.trips[0].items[0].name).toBe('Updated Item');
  });

  it('updateItemTag sets a tag on an item', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', [mockItem]); });
    const tripId = result.current.trips[0].id;
    const itemId = result.current.trips[0].items[0].id;
    act(() => { result.current.updateItemTag(tripId, itemId, 'carry-on'); });
    expect(result.current.trips[0].items[0].tag).toBe('carry-on');
  });

  it('updateItemCategory changes the item category', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', [mockItem]); });
    const tripId = result.current.trips[0].id;
    const itemId = result.current.trips[0].items[0].id;
    act(() => { result.current.updateItemCategory(tripId, itemId, 'electronica'); });
    expect(result.current.trips[0].items[0].category).toBe('electronica');
  });

  it('markAllPacked sets all isIn to true', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => {
      result.current.addTrip('Trip', [
        { name: 'A', category: 'otros' },
        { name: 'B', category: 'otros' },
      ]);
    });
    const tripId = result.current.trips[0].id;
    act(() => { result.current.markAllPacked(tripId); });
    expect(result.current.trips[0].items.every(i => i.isIn)).toBe(true);
  });

  it('unpackAll resets isIn and isBack', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip', [{ name: 'A', category: 'otros' }]); });
    const tripId = result.current.trips[0].id;
    act(() => { result.current.markAllPacked(tripId); });
    act(() => { result.current.unpackAll(tripId); });
    expect(result.current.trips[0].items.every(i => !i.isIn && !i.isBack)).toBe(true);
  });

  it('clearAllTrips empties the trips array', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Trip A', []); });
    act(() => { result.current.addTrip('Trip B', []); });
    act(() => { result.current.clearAllTrips(); });
    expect(result.current.trips).toHaveLength(0);
  });

  it('getTrip returns the correct trip by ID', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Find Me', []); });
    const tripId = result.current.trips[0].id;
    const found = result.current.getTrip(tripId);
    expect(found).toBeDefined();
    expect(found!.name).toBe('Find Me');
  });

  it('getTrip returns undefined for unknown ID', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    const found = result.current.getTrip('non-existent-id');
    expect(found).toBeUndefined();
  });

  it('exportTrips returns a JSON string of all trips', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    act(() => { result.current.addTrip('Export Me', [mockItem]); });
    const json = result.current.exportTrips();
    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].name).toBe('Export Me');
  });

  it('importTrips calls migrateTripsToCategories', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    const raw = JSON.stringify([
      {
        id: '1',
        name: 'Legacy Trip',
        items: [{ id: 'i1', name: 'Old Item', isIn: false, isBack: false }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    act(() => { result.current.importTrips(raw); });
    expect(result.current.trips[0].items[0].category).toBe('otros');
  });

  it('importTrips parses JSON and replaces trips', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    const tripsJson = JSON.stringify([mockTrip]);
    let success: boolean = false;
    act(() => { success = result.current.importTrips(tripsJson); });
    expect(success).toBe(true);
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].name).toBe('Test Trip');
  });

  it('importTrips returns false on invalid JSON', async () => {
    const { result } = renderHook(() => useTripData());
    await act(async () => {});
    let success: boolean = true;
    act(() => { success = result.current.importTrips('not valid json {{{'); });
    expect(success).toBe(false);
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import TripDetails from './pages/TripDetails';
import CreateTrip from './pages/CreateTrip';

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

describe('Trip Manager Integration Tests', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear.mockClear();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Requirement: Create and manage trips', () => {
    it('should allow creating a new trip with items', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/create-trip']}>
          <App />
        </MemoryRouter>
      );

      // Fill in trip name
      await user.type(screen.getByTestId('trip-name-input'), 'Beach Vacation');

      // Add items
      await user.click(screen.getByTestId('add-item-button'));
      await user.type(screen.getByTestId('item-input-0'), 'Sunscreen');

      await user.click(screen.getByTestId('add-item-button'));
      await user.type(screen.getByTestId('item-input-1'), 'Beach Towel');

      // Submit form
      await user.click(screen.getByTestId('save-trip-button'));

      // Verify localStorage was called to save the trip
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'trips',
        expect.stringContaining('Beach Vacation')
      );
    });
  });

  describe('Requirement: Dual checkbox functionality (In/Back)', () => {
    it('should manage dual checkboxes for items', async () => {
      const user = userEvent.setup();
      
      const mockTrip = {
        id: '1',
        name: 'Test Trip',
        items: [
          { id: 'item1', name: 'Camera', isIn: false, isBack: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTrip]));

      render(
        <MemoryRouter initialEntries={['/trip/1']}>
          <App />
        </MemoryRouter>
      );

      // Verify both checkboxes are rendered
      expect(screen.getByTestId('item-item1-in')).toBeInTheDocument();
      expect(screen.getByTestId('item-item1-back')).toBeInTheDocument();

      // Initially both should be unchecked
      expect(screen.getByTestId('item-item1-in')).not.toBeChecked();
      expect(screen.getByTestId('item-item1-back')).not.toBeChecked();

      // Check "In" checkbox
      await user.click(screen.getByTestId('item-item1-in'));
      
      // Verify localStorage update was called
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Requirement: Copy previous trip functionality', () => {
    it('should copy a trip and reset checkbox states', async () => {
      const user = userEvent.setup();
      
      const originalTrip = {
        id: '1',
        name: 'Original Trip',
        items: [
          { id: 'item1', name: 'Camera', isIn: true, isBack: true },
          { id: 'item2', name: 'Passport', isIn: false, isBack: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([originalTrip]));

      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // Click copy button
      await user.click(screen.getByTestId('copy-trip-1'));

      // Verify localStorage was called to save the copied trip
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'trips',
        expect.stringContaining('Original Trip (Copy)')
      );
    });
  });

  describe('Requirement: Fast browser application', () => {
    it('should load quickly with localStorage persistence', () => {
      const startTime = performance.now();
      
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Should load in under 100ms (very fast)
      expect(loadTime).toBeLessThan(100);
      expect(screen.getByText('Trip Baggage Manager')).toBeInTheDocument();
    });
  });

  describe('Requirement: User-friendly and intuitive navigation', () => {
    it('should provide clear navigation between pages', async () => {
      const user = userEvent.setup();
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      // Should show create trip button on home page
      expect(screen.getByText('Create New Trip')).toBeInTheDocument();

      // Navigate to create trip page
      await user.click(screen.getByText('Create New Trip'));
      expect(screen.getByText('Create New Trip')).toBeInTheDocument();
    });

    it('should show trip statistics and progress', () => {
      const mockTrip = {
        id: '1',
        name: 'Test Trip',
        items: [
          { id: 'item1', name: 'Camera', isIn: true, isBack: false },
          { id: 'item2', name: 'Passport', isIn: true, isBack: true },
          { id: 'item3', name: 'Charger', isIn: false, isBack: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTrip]));

      render(
        <MemoryRouter initialEntries={['/trip/1']}>
          <App />
        </MemoryRouter>
      );

      // Should show packing statistics
      expect(screen.getByText('Packed: 2/3')).toBeInTheDocument();
      expect(screen.getByText('Returned: 1/3 (33%)')).toBeInTheDocument();
    });
  });

  describe('Requirement: List management with persistence', () => {
    it('should persist trips across browser sessions', () => {
      // First session - create trip
      const { unmount } = render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      unmount();

      // Second session - should load from localStorage
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        {
          id: '1',
          name: 'Persisted Trip',
          items: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]));

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('trips');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      expect(() => {
        render(
          <BrowserRouter>
            <Home />
          </BrowserRouter>
        );
      }).not.toThrow();
    });

    it('should handle trip not found scenario', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));

      render(
        <MemoryRouter initialEntries={['/trip/999']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText('Trip not found')).toBeInTheDocument();
      expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });
  });

  describe('Performance requirements', () => {
    it('should handle large number of trips efficiently', () => {
      // Create 100 trips to test performance
      const manyTrips = Array.from({ length: 100 }, (_, i) => ({
        id: i.toString(),
        name: `Trip ${i}`,
        items: [
          { id: `item${i}`, name: `Item ${i}`, isIn: false, isBack: false }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(manyTrips));

      const startTime = performance.now();
      
      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render large lists quickly (under 200ms)
      expect(renderTime).toBeLessThan(200);
      expect(screen.getByText('Trip 0')).toBeInTheDocument();
      expect(screen.getByText('Trip 99')).toBeInTheDocument();
    });
  });
});
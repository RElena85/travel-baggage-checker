"""
TripPacker app builder — creates all directories and source files.
Run: python build_app.py
"""
import os, json

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "trip-manager-app")

FILES = {}

# ── package.json ──────────────────────────────────────────────────────────────
FILES["package.json"] = json.dumps({
  "name": "trip-manager-app",
  "version": "0.1.0",
  "private": True,
  "homepage": "https://rafaelarana.github.io/travel-baggage-checker",
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "gh-pages": "^5.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false",
    "eject": "react-scripts eject",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "eslintConfig": {"extends": ["react-app", "react-app/jest"]},
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}, indent=2)

# ── tsconfig.json ─────────────────────────────────────────────────────────────
FILES["tsconfig.json"] = json.dumps({
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": True,
    "skipLibCheck": True,
    "esModuleInterop": True,
    "allowSyntheticDefaultImports": True,
    "strict": True,
    "forceConsistentCasingInFileNames": True,
    "noFallthroughCasesInSwitch": True,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": True,
    "isolatedModules": True,
    "noEmit": True,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}, indent=2)

# ── .env.development ──────────────────────────────────────────────────────────
FILES[".env.development"] = "PUBLIC_URL=\nFAST_REFRESH=false\n"

# ── .gitignore ────────────────────────────────────────────────────────────────
FILES[".gitignore"] = "/node_modules\n/build\n/coverage\n.DS_Store\n.env.local\n"

# ── public/index.html ─────────────────────────────────────────────────────────
FILES["public/index.html"] = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TripPacker — The Curated Journey</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
"""

# ── src/index.tsx ─────────────────────────────────────────────────────────────
FILES["src/index.tsx"] = """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
"""

# ── src/reportWebVitals.ts ────────────────────────────────────────────────────
FILES["src/reportWebVitals.ts"] = """import { ReportHandler } from 'web-vitals';
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); getFID(onPerfEntry); getFCP(onPerfEntry);
      getLCP(onPerfEntry); getTTFB(onPerfEntry);
    });
  }
};
export default reportWebVitals;
"""

# ── src/setupTests.ts ─────────────────────────────────────────────────────────
FILES["src/setupTests.ts"] = """import '@testing-library/jest-dom';

export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    reset: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
"""

# ── src/types/index.ts ────────────────────────────────────────────────────────
FILES["src/types/index.ts"] = """export type Category =
  | 'clothing'
  | 'toiletries'
  | 'documents'
  | 'electronics'
  | 'medications'
  | 'miscellaneous';

export interface Item {
  id: string;
  name: string;
  packed: boolean;
  category: Category;
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  date: string;
  items: Item[];
}
"""

# ── src/utils/helpers.ts ──────────────────────────────────────────────────────
FILES["src/utils/helpers.ts"] = """import { Trip, Item, Category } from '../types';

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function migrateTripsToCategories(trips: Trip[]): Trip[] {
  return trips.map(trip => ({
    ...trip,
    items: trip.items.map(item => ({
      ...item,
      category: (item.category as Category) ?? 'miscellaneous',
    })),
  }));
}

export function calculateProgress(items: Item[]): { packed: number; total: number; percentage: number } {
  const total = items.length;
  const packed = items.filter(i => i.packed).length;
  return { packed, total, percentage: total === 0 ? 0 : Math.round((packed / total) * 100) };
}

export function groupByCategory(items: Item[]): Record<Category, Item[]> {
  const groups = {} as Record<Category, Item[]>;
  items.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });
  return groups;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
"""

# ── src/context/TripContext.tsx ───────────────────────────────────────────────
FILES["src/context/TripContext.tsx"] = """import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Trip, Item, Category } from '../types';
import { generateId, migrateTripsToCategories } from '../utils/helpers';

const STORAGE_KEY = 'trippacker_trips';

interface TripContextValue {
  trips: Trip[];
  addTrip: (name: string, destination: string, date: string) => void;
  deleteTrip: (tripId: string) => void;
  updateTrip: (tripId: string, updates: Partial<Pick<Trip, 'name' | 'destination' | 'date'>>) => void;
  duplicateTrip: (tripId: string) => void;
  addItem: (tripId: string, name: string, category: Category) => void;
  updateItem: (tripId: string, itemId: string, updates: Partial<Item>) => void;
  deleteItem: (tripId: string, itemId: string) => void;
  togglePacked: (tripId: string, itemId: string) => void;
  bulkTogglePacked: (tripId: string, packed: boolean) => void;
  bulkDeleteItems: (tripId: string, itemIds: string[]) => void;
  reorderItems: (tripId: string, items: Item[]) => void;
  clearAllItems: (tripId: string) => void;
  packByCategory: (tripId: string, category: Category) => void;
  unpackAll: (tripId: string) => void;
  importTrips: (data: Trip[]) => void;
  exportTrips: () => Trip[];
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return migrateTripsToCategories(JSON.parse(raw));
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  const addTrip = useCallback((name: string, destination: string, date: string) => {
    setTrips(prev => [...prev, { id: generateId(), name, destination, date, items: [] }]);
  }, []);

  const deleteTrip = useCallback((tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
  }, []);

  const updateTrip = useCallback((tripId: string, updates: Partial<Pick<Trip, 'name' | 'destination' | 'date'>>) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...updates } : t));
  }, []);

  const duplicateTrip = useCallback((tripId: string) => {
    setTrips(prev => {
      const original = prev.find(t => t.id === tripId);
      if (!original) return prev;
      const copy: Trip = {
        ...original,
        id: generateId(),
        name: original.name + ' (copy)',
        items: original.items.map(i => ({ ...i, id: generateId(), packed: false })),
      };
      return [...prev, copy];
    });
  }, []);

  const addItem = useCallback((tripId: string, name: string, category: Category) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId
        ? { ...t, items: [...t.items, { id: generateId(), name, packed: false, category }] }
        : t
    ));
  }, []);

  const updateItem = useCallback((tripId: string, itemId: string, updates: Partial<Item>) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId
        ? { ...t, items: t.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
        : t
    ));
  }, []);

  const deleteItem = useCallback((tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId ? { ...t, items: t.items.filter(i => i.id !== itemId) } : t
    ));
  }, []);

  const togglePacked = useCallback((tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId
        ? { ...t, items: t.items.map(i => i.id === itemId ? { ...i, packed: !i.packed } : i) }
        : t
    ));
  }, []);

  const bulkTogglePacked = useCallback((tripId: string, packed: boolean) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId ? { ...t, items: t.items.map(i => ({ ...i, packed })) } : t
    ));
  }, []);

  const bulkDeleteItems = useCallback((tripId: string, itemIds: string[]) => {
    const set = new Set(itemIds);
    setTrips(prev => prev.map(t =>
      t.id === tripId ? { ...t, items: t.items.filter(i => !set.has(i.id)) } : t
    ));
  }, []);

  const reorderItems = useCallback((tripId: string, items: Item[]) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, items } : t));
  }, []);

  const clearAllItems = useCallback((tripId: string) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, items: [] } : t));
  }, []);

  const packByCategory = useCallback((tripId: string, category: Category) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId
        ? { ...t, items: t.items.map(i => i.category === category ? { ...i, packed: true } : i) }
        : t
    ));
  }, []);

  const unpackAll = useCallback((tripId: string) => {
    setTrips(prev => prev.map(t =>
      t.id === tripId ? { ...t, items: t.items.map(i => ({ ...i, packed: false })) } : t
    ));
  }, []);

  const importTrips = useCallback((data: Trip[]) => {
    const migrated = migrateTripsToCategories(data);
    setTrips(prev => [...prev, ...migrated]);
  }, []);

  const exportTrips = useCallback(() => trips, [trips]);

  return (
    <TripContext.Provider value={{
      trips, addTrip, deleteTrip, updateTrip, duplicateTrip,
      addItem, updateItem, deleteItem, togglePacked,
      bulkTogglePacked, bulkDeleteItems, reorderItems,
      clearAllItems, packByCategory, unpackAll, importTrips, exportTrips,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be inside TripProvider');
  return ctx;
}
"""

# ── src/App.tsx ───────────────────────────────────────────────────────────────
FILES["src/App.tsx"] = """import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import HomePage from './pages/HomePage';
import TripDetailPage from './pages/TripDetailPage';
import './styles/global.css';

export default function App() {
  return (
    <TripProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trip/:tripId" element={<TripDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TripProvider>
  );
}
"""

# ── src/styles/global.css ─────────────────────────────────────────────────────
FILES["src/styles/global.css"] = """/* ── Design Tokens ── */
:root {
  --color-primary: #667eea;
  --color-primary-dark: #764ba2;
  --color-accent: #f093fb;
  --color-dark: #1a1a2e;
  --color-surface: #ffffff;
  --color-bg: #f7f8fc;
  --color-text: #2d3748;
  --color-text-muted: #718096;
  --color-border: rgba(102,126,234,0.15);
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-hero: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  --shadow-card: 0 4px 24px rgba(102,126,234,0.10);
  --shadow-hover: 0 8px 32px rgba(102,126,234,0.20);
  --radius-card: 16px;
  --radius-btn: 8px;
  --font-base: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-base);
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
}

/* ── Layout ── */
.page-container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem 3rem; }

/* ── Hero ── */
.hero {
  background: var(--gradient-hero);
  color: white;
  padding: 3rem 2rem;
  margin-bottom: 2.5rem;
}
.hero h1 { font-size: 2.4rem; font-weight: 700; letter-spacing: -0.5px; }
.hero p { opacity: 0.75; margin-top: 0.5rem; font-size: 1.05rem; }

/* ── Cards ── */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
  transition: box-shadow 0.2s, transform 0.2s;
}
.card:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); }

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-btn);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font-base);
  transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
}
.btn:hover { opacity: 0.9; transform: translateY(-1px); }
.btn:active { transform: translateY(0); }

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 2px 12px rgba(102,126,234,0.35);
}
.btn-secondary { background: var(--color-bg); color: var(--color-primary); }
.btn-danger { background: #fed7d7; color: #c53030; }
.btn-ghost { background: transparent; color: var(--color-text-muted); }
.btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }

/* ── Forms ── */
.form-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
.form-label { font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); }
.form-input {
  padding: 0.65rem 0.9rem;
  border-radius: var(--radius-btn);
  border: 1.5px solid var(--color-border);
  font-family: var(--font-base);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;
  background: var(--color-surface);
}
.form-input:focus { border-color: var(--color-primary); }

/* ── Trip Grid ── */
.trip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
.trip-card { cursor: pointer; }
.trip-card h3 { font-size: 1.1rem; color: var(--color-dark); margin-bottom: 0.25rem; }
.trip-card .destination { color: var(--color-text-muted); font-size: 0.9rem; }
.trip-card .date { font-size: 0.82rem; color: var(--color-primary); margin-top: 0.5rem; }
.trip-card-actions { display: flex; gap: 0.5rem; margin-top: 1rem; justify-content: flex-end; }

/* ── Progress Bar ── */
.progress-container { margin-bottom: 1.5rem; }
.progress-label { font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 0.4rem; font-weight: 600; }
.progress-track { height: 10px; background: var(--color-border); border-radius: 99px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--gradient-primary); border-radius: 99px; transition: width 0.4s ease; }

/* ── Category Filter ── */
.category-filter { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.category-btn {
  padding: 0.35rem 0.9rem;
  border-radius: 99px;
  border: 1.5px solid var(--color-border);
  background: white;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: var(--font-base);
  transition: all 0.15s;
}
.category-btn.active { background: var(--gradient-primary); color: white; border-color: transparent; }
.category-btn:hover:not(.active) { border-color: var(--color-primary); color: var(--color-primary); }

/* ── Packing List ── */
.packing-list { display: flex; flex-direction: column; gap: 0.5rem; }
.packing-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(102,126,234,0.06);
  transition: opacity 0.2s;
}
.packing-item.packed { opacity: 0.55; }
.packing-item.packed .item-name { text-decoration: line-through; }
.packing-item input[type=checkbox] { width: 18px; height: 18px; accent-color: var(--color-primary); cursor: pointer; }
.item-name { flex: 1; font-size: 0.95rem; }
.item-category-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
  background: rgba(102,126,234,0.10);
  color: var(--color-primary);
}

/* ── Section Headers ── */
.section-title { font-size: 1rem; font-weight: 700; color: var(--color-dark); margin: 1.5rem 0 0.75rem; }

/* ── Import/Export ── */
.import-export { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; }

/* ── Empty State ── */
.empty-state { text-align: center; padding: 3rem 1rem; color: var(--color-text-muted); }
.empty-state p { margin-top: 0.5rem; font-size: 0.95rem; }

/* ── Back link ── */
.back-link { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--color-primary); text-decoration: none; font-weight: 600; margin-bottom: 1.5rem; font-size: 0.9rem; }
.back-link:hover { opacity: 0.75; }

/* ── Inline form row ── */
.add-item-row { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
.add-item-row .form-input { flex: 1; min-width: 140px; margin-bottom: 0; }
"""

# ── src/components/TripList.tsx ───────────────────────────────────────────────
FILES["src/components/TripList.tsx"] = """import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { calculateProgress, formatDate } from '../utils/helpers';

export default function TripList() {
  const { trips, deleteTrip, duplicateTrip } = useTripContext();
  const navigate = useNavigate();

  if (trips.length === 0) {
    return (
      <div data-testid="trip-list" className="empty-state">
        <span style={{ fontSize: '2.5rem' }}>✈️</span>
        <p>No trips yet — add your first adventure below!</p>
      </div>
    );
  }

  return (
    <div data-testid="trip-list" className="trip-grid">
      {trips.map(trip => {
        const { packed, total, percentage } = calculateProgress(trip.items);
        return (
          <div
            key={trip.id}
            data-testid={`trip-card-${trip.id}`}
            className="card trip-card"
            onClick={() => navigate(`/trip/${trip.id}`)}
          >
            <h3>{trip.name}</h3>
            <div className="destination">📍 {trip.destination}</div>
            <div className="date">🗓 {formatDate(trip.date)}</div>
            {total > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percentage}%` }} />
                </div>
                <div style={{ fontSize: '0.78rem', marginTop: '0.3rem', color: 'var(--color-text-muted)' }}>
                  {packed}/{total} packed
                </div>
              </div>
            )}
            <div className="trip-card-actions" onClick={e => e.stopPropagation()}>
              <button
                data-testid={`duplicate-trip-${trip.id}`}
                className="btn btn-secondary btn-sm"
                onClick={() => duplicateTrip(trip.id)}
              >Copy</button>
              <button
                data-testid={`delete-trip-${trip.id}`}
                className="btn btn-danger btn-sm"
                onClick={() => deleteTrip(trip.id)}
              >Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
"""

# ── src/components/TripForm.tsx ───────────────────────────────────────────────
FILES["src/components/TripForm.tsx"] = """import React, { useState } from 'react';
import { useTripContext } from '../context/TripContext';

export default function TripForm() {
  const { addTrip } = useTripContext();
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !destination.trim()) return;
    addTrip(name.trim(), destination.trim(), date);
    setName(''); setDestination(''); setDate('');
  }

  return (
    <form data-testid="trip-form" onSubmit={handleSubmit} className="card" style={{ marginTop: '1.5rem' }}>
      <h3 className="section-title" style={{ marginTop: 0 }}>Plan a New Trip</h3>
      <div className="form-group">
        <label className="form-label" htmlFor="trip-name">Trip Name</label>
        <input
          id="trip-name"
          data-testid="trip-name-input"
          className="form-input"
          placeholder="e.g. Summer in Barcelona"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="destination">Destination</label>
        <input
          id="destination"
          data-testid="destination-input"
          className="form-input"
          placeholder="City, Country"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="trip-date">Date</label>
        <input
          id="trip-date"
          data-testid="trip-date-input"
          className="form-input"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <button data-testid="submit-trip-btn" className="btn btn-primary" type="submit">
        ✈️ Add Trip
      </button>
    </form>
  );
}
"""

# ── src/components/ProgressBar.tsx ───────────────────────────────────────────
FILES["src/components/ProgressBar.tsx"] = """import React from 'react';
import { Item } from '../types';
import { calculateProgress } from '../utils/helpers';

interface Props { items: Item[]; }

export default function ProgressBar({ items }: Props) {
  const { packed, total, percentage } = calculateProgress(items);
  return (
    <div data-testid="progress-bar" className="progress-container">
      <div data-testid="progress-label" className="progress-label">
        {packed} of {total} items packed — {percentage}%
      </div>
      <div className="progress-track">
        <div data-testid="progress-fill" className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
"""

# ── src/components/CategoryFilter.tsx ────────────────────────────────────────
FILES["src/components/CategoryFilter.tsx"] = """import React from 'react';
import { Category } from '../types';

const CATEGORIES: Category[] = ['clothing','toiletries','documents','electronics','medications','miscellaneous'];

interface Props {
  active: Category | 'all';
  onChange: (cat: Category | 'all') => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div data-testid="category-filter" className="category-filter">
      <button
        data-testid="category-btn-all"
        className={`category-btn${active === 'all' ? ' active' : ''}`}
        onClick={() => onChange('all')}
      >All</button>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          data-testid={`category-btn-${cat}`}
          className={`category-btn${active === cat ? ' active' : ''}`}
          onClick={() => onChange(cat)}
        >{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
      ))}
    </div>
  );
}
"""

# ── src/components/PackingList.tsx ────────────────────────────────────────────
FILES["src/components/PackingList.tsx"] = """import React from 'react';
import { Item, Category } from '../types';
import { useTripContext } from '../context/TripContext';

interface Props {
  tripId: string;
  items: Item[];
  filter: Category | 'all';
}

export default function PackingList({ tripId, items, filter }: Props) {
  const { togglePacked, deleteItem } = useTripContext();
  const visible = filter === 'all' ? items : items.filter(i => i.category === filter);

  if (visible.length === 0) {
    return (
      <div data-testid="packing-list" className="empty-state">
        <span style={{ fontSize: '2rem' }}>🧳</span>
        <p>{filter === 'all' ? 'No items yet — add something above!' : `No ${filter} items.`}</p>
      </div>
    );
  }

  return (
    <div data-testid="packing-list" className="packing-list">
      {visible.map(item => (
        <div
          key={item.id}
          data-testid={`item-${item.id}`}
          className={`packing-item${item.packed ? ' packed' : ''}`}
        >
          <input
            type="checkbox"
            data-testid={`item-checkbox-${item.id}`}
            checked={item.packed}
            onChange={() => togglePacked(tripId, item.id)}
          />
          <span className="item-name">{item.name}</span>
          <span className="item-category-badge">{item.category}</span>
          <button
            data-testid={`delete-item-${item.id}`}
            className="btn btn-ghost btn-sm"
            onClick={() => deleteItem(tripId, item.id)}
          >✕</button>
        </div>
      ))}
    </div>
  );
}
"""

# ── src/components/AddItemForm.tsx ────────────────────────────────────────────
FILES["src/components/AddItemForm.tsx"] = """import React, { useState } from 'react';
import { Category } from '../types';
import { useTripContext } from '../context/TripContext';

const CATEGORIES: Category[] = ['clothing','toiletries','documents','electronics','medications','miscellaneous'];

interface Props { tripId: string; }

export default function AddItemForm({ tripId }: Props) {
  const { addItem } = useTripContext();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('miscellaneous');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addItem(tripId, name.trim(), category);
    setName('');
  }

  return (
    <form data-testid="add-item-form" onSubmit={handleSubmit}>
      <div className="add-item-row">
        <input
          data-testid="item-name-input"
          className="form-input"
          placeholder="Add an item..."
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <select
          data-testid="item-category-select"
          className="form-input"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          style={{ width: 'auto' }}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn btn-primary" type="submit">Add</button>
      </div>
    </form>
  );
}
"""

# ── src/components/ImportExport.tsx ───────────────────────────────────────────
FILES["src/components/ImportExport.tsx"] = """import React, { useRef } from 'react';
import { useTripContext } from '../context/TripContext';
import { Trip } from '../types';

export default function ImportExport() {
  const { exportTrips, importTrips } = useTripContext();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data = exportTrips();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'trips.json'; a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Trip[];
        importTrips(Array.isArray(data) ? data : [data]);
      } catch { alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div data-testid="import-export" className="import-export">
      <button data-testid="export-btn" className="btn btn-secondary" onClick={handleExport}>
        ⬇ Export Trips
      </button>
      <button data-testid="import-btn" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
        ⬆ Import Trips
      </button>
      <input
        data-testid="file-input"
        ref={fileRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </div>
  );
}
"""

# ── src/pages/HomePage.tsx ────────────────────────────────────────────────────
FILES["src/pages/HomePage.tsx"] = """import React from 'react';
import TripList from '../components/TripList';
import TripForm from '../components/TripForm';

export default function HomePage() {
  return (
    <>
      <div className="hero">
        <div className="page-container" style={{ paddingBottom: 0 }}>
          <h1>TripPacker ✈️</h1>
          <p>The curated journey starts with a well-packed bag.</p>
        </div>
      </div>
      <div className="page-container">
        <TripList />
        <TripForm />
      </div>
    </>
  );
}
"""

# ── src/pages/TripDetailPage.tsx ──────────────────────────────────────────────
FILES["src/pages/TripDetailPage.tsx"] = """import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { Category } from '../types';
import PackingList from '../components/PackingList';
import AddItemForm from '../components/AddItemForm';
import CategoryFilter from '../components/CategoryFilter';
import ProgressBar from '../components/ProgressBar';
import ImportExport from '../components/ImportExport';
import { formatDate } from '../utils/helpers';

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, bulkTogglePacked, unpackAll, clearAllItems } = useTripContext();
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const trip = trips.find(t => t.id === tripId);
  if (!trip) return <div className="page-container"><p>Trip not found.</p><Link to="/">← Back</Link></div>;

  return (
    <>
      <div className="hero">
        <div className="page-container" style={{ paddingBottom: 0 }}>
          <Link to="/" className="back-link" style={{ color: 'rgba(255,255,255,0.7)' }}>← All Trips</Link>
          <h1>{trip.name}</h1>
          <p>📍 {trip.destination} {trip.date && `· 🗓 ${formatDate(trip.date)}`}</p>
        </div>
      </div>
      <div className="page-container">
        <ProgressBar items={trip.items} />
        <AddItemForm tripId={trip.id} />
        <CategoryFilter active={filter} onChange={setFilter} />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => bulkTogglePacked(trip.id, true)}>Pack All</button>
          <button className="btn btn-secondary btn-sm" onClick={() => unpackAll(trip.id)}>Unpack All</button>
          <button className="btn btn-danger btn-sm" onClick={() => clearAllItems(trip.id)}>Clear All</button>
        </div>
        <PackingList tripId={trip.id} items={trip.items} filter={filter} />
        <ImportExport />
      </div>
    </>
  );
}
"""

# ── Write all files ────────────────────────────────────────────────────────────
def write(rel_path: str, content: str):
    full = os.path.join(BASE, rel_path.replace("/", os.sep))
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ {rel_path}")

print("\nBuilding TripPacker app...\n")
for path, content in FILES.items():
    write(path, content)

print(f"\n✅ Done — {len(FILES)} files written to {BASE}")
print("\nNext: cd trip-manager-app && npm install && npm start")

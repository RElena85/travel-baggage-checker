import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import TripList from '../components/TripList';

type SortOption = 'newest' | 'oldest' | 'name' | 'packed';

export default function TripsPage() {
  const { trips, loading, exportTrips, importTrips } = useTripContext();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading your trips...</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="trips-page">
        <div className="page-header">
          <h1>🧳 My Trips</h1>
          <p className="page-subtitle">Plan, pack, and track every journey</p>
        </div>
        <div className="empty-state">
          <span className="empty-state-icon">🗺️</span>
          <p className="empty-state-text">No trips yet. Start planning!</p>
          <Link to="/create-trip" className="btn-primary">
            Create Your First Trip
          </Link>
        </div>
      </div>
    );
  }

  const filtered = trips.filter(t => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.destination || '').toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'packed') {
      const aPct = a.items.length > 0 ? a.items.filter(i => i.isIn).length / a.items.length : 0;
      const bPct = b.items.length > 0 ? b.items.filter(i => i.isIn).length / b.items.length : 0;
      return bPct - aPct;
    }
    return 0;
  });

  function handleExport() {
    const json = exportTrips();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `trippacker-backup-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const success = importTrips(text);
      if (success) {
        setImportSuccess('Trips imported successfully!');
        setImportError('');
        setTimeout(() => setImportSuccess(''), 3000);
      } else {
        setImportError('Failed to import: invalid file format.');
        setImportSuccess('');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="trips-page">
      <div className="page-header">
        <h1>🧳 My Trips</h1>
        <p className="page-subtitle">Plan, pack, and track every journey</p>
      </div>

      {importError && (
        <div className="alert alert-error" data-testid="import-error">
          {importError}
        </div>
      )}
      {importSuccess && (
        <div className="alert alert-success" data-testid="import-success">
          {importSuccess}
        </div>
      )}

      <div className="trips-toolbar">
        <input
          type="text"
          className="form-input trips-search"
          placeholder="Search trips..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          data-testid="trips-search"
        />
        <select
          className="form-select"
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          data-testid="trips-sort"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
          <option value="packed">Most packed</option>
        </select>
        <button className="btn-secondary" onClick={handleExport} data-testid="export-trips">
          Export
        </button>
        <button className="btn-secondary" onClick={handleImportClick} data-testid="import-trips">
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          data-testid="import-file-input"
        />
      </div>

      <div className="trips-count">
        {search ? (
          <>
            {sorted.length} of {trips.length} trips matching "{search}"
            {sorted.length === 0 && (
              <button
                className="btn-text"
                onClick={() => setSearch('')}
                data-testid="clear-search-btn"
              >
                Clear Search
              </button>
            )}
          </>
        ) : (
          `${trips.length} trips`
        )}
      </div>

      {sorted.length === 0 && search && (
        <div className="empty-state">
          <p className="empty-state-text">No trips match "{search}"</p>
          <button
            className="btn-secondary"
            onClick={() => setSearch('')}
            data-testid="clear-search-btn"
          >
            Clear Search
          </button>
        </div>
      )}

      <TripList trips={sorted} />
    </div>
  );
}

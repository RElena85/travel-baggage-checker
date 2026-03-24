import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import TripList from '../components/TripList';
import { useTripContext } from '../contexts/TripContext';
import '../styles/components.css';

type SortOption = 'date-newest' | 'date-oldest' | 'name-asc' | 'completion-desc';

const TripsPage: React.FC = () => {
    const { trips, loading, copyTrip, deleteTrip, exportTrips, importTrips } = useTripContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('date-newest');
    const [importError, setImportError] = useState('');
    const [importSuccess, setImportSuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredAndSortedTrips = useMemo(() => {
        let result = trips.filter(trip =>
            trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (trip.destination && trip.destination.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case 'date-newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'date-oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'completion-desc': {
                    const pctA = a.items.length > 0 ? a.items.filter(i => i.isIn).length / a.items.length : 0;
                    const pctB = b.items.length > 0 ? b.items.filter(i => i.isIn).length / b.items.length : 0;
                    return pctB - pctA;
                }
                default:
                    return 0;
            }
        });

        return result;
    }, [trips, searchQuery, sortBy]);

    const handleExport = () => {
        const json = exportTrips();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trippacker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const json = event.target?.result as string;
            const success = importTrips(json);
            if (success) {
                setImportSuccess('Trips imported successfully!');
                setImportError('');
                setTimeout(() => setImportSuccess(''), 3000);
            } else {
                setImportError('Invalid file. Please select a valid TripPacker backup.');
                setImportSuccess('');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div className="app">
            <div className="container">
                <div className="page">
                    <div className="page-header">
                        <h1 className="page-title">🧳 My Trips</h1>
                        <p className="page-subtitle">
                            Manage and view all your travel adventures
                        </p>
                    </div>
                    
                    <div className="page-content">
                        {loading ? (
                            <div className="loading">
                                <div className="spinner"></div>
                                <p>Loading your trips...</p>
                            </div>
                        ) : trips.length === 0 ? (
                            <div className="empty-trips">
                                <div className="empty-icon">🧳</div>
                                <h3 className="empty-title">No trips found</h3>
                                <p className="empty-description">
                                    You haven't created any trips yet. Start planning your next adventure!
                                </p>
                                <Link to="/create-trip" className="btn btn-primary btn-lg mt-6">
                                    🚀 Create Your First Trip
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="trips-toolbar">
                                    <input
                                        type="text"
                                        className="form-input trips-search"
                                        placeholder="🔍 Search by trip name or destination..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        data-testid="trips-search"
                                    />
                                    <select
                                        className="form-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        data-testid="trips-sort"
                                    >
                                        <option value="date-newest">Newest first</option>
                                        <option value="date-oldest">Oldest first</option>
                                        <option value="name-asc">Name A–Z</option>
                                        <option value="completion-desc">Most packed</option>
                                    </select>
                                </div>

                                <div className="trips-meta-row">
                                    <p className="text-gray-600">
                                        {filteredAndSortedTrips.length} of {trips.length} trip{trips.length !== 1 ? 's' : ''}
                                        {searchQuery && ` matching "${searchQuery}"`}
                                    </p>
                                    <div className="trips-data-actions">
                                        <button
                                            onClick={handleExport}
                                            className="btn btn-secondary btn-sm"
                                            data-testid="export-trips"
                                        >
                                            ⬇️ Export
                                        </button>
                                        <button
                                            onClick={handleImportClick}
                                            className="btn btn-secondary btn-sm"
                                            data-testid="import-trips"
                                        >
                                            ⬆️ Import
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
                                </div>

                                {importError && (
                                    <div className="alert alert-error" data-testid="import-error">{importError}</div>
                                )}
                                {importSuccess && (
                                    <div className="alert alert-success" data-testid="import-success">{importSuccess}</div>
                                )}

                                {filteredAndSortedTrips.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">🔍</div>
                                        <p>No trips match your search.</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                ) : (
                                    <TripList 
                                        trips={filteredAndSortedTrips}
                                        onCopyTrip={copyTrip}
                                        onDeleteTrip={deleteTrip}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripsPage;
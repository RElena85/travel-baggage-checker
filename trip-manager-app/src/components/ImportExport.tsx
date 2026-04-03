import React, { useRef } from 'react';
import { useTripContext } from '../context/TripContext';

interface Props {
  tripId?: string;
}

export function ImportExport({ tripId }: Props) {
  const { exportTrips, importTrips } = useTripContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportTrips();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `trippacker-backup-${date}.json`;
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
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      importTrips(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div data-testid="import-export" className="import-export">
      <button
        data-testid="export-btn"
        className="btn btn-secondary"
        onClick={handleExport}
      >
        Export JSON
      </button>
      <button
        data-testid="import-btn"
        className="btn btn-secondary"
        onClick={handleImportClick}
      >
        Import JSON
      </button>
      <input
        data-testid="file-input"
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}

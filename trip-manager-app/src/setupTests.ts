import '@testing-library/jest-dom';

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

export const localStorageMock = mockLocalStorage;

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

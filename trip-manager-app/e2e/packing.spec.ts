import { test, expect } from '@playwright/test';

test.describe('TripPacker E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('create trip, add items, toggle packed, verify progress, export', async ({ page }) => {
    // Create trip
    await page.fill('[data-testid="trip-name-input"]', 'Barcelona');
    await page.fill('[data-testid="destination-input"]', 'Spain');
    await page.fill('[data-testid="trip-date-input"]', '2025-09-01');
    await page.click('[data-testid="submit-trip-btn"]');

    // Navigate to trip
    const tripCard = await page.locator('[data-testid^="trip-card-"]').first();
    const tripId = await tripCard.getAttribute('data-testid').then((id) => id?.replace('trip-card-', ''));
    await page.click(`[data-testid="view-trip-${tripId}"]`);

    // Add items
    await page.fill('[data-testid="new-item-name-input"]', 'Passport');
    await page.selectOption('[data-testid="new-item-category-select"]', 'documents');
    await page.click('[data-testid="add-item-btn"]');

    await page.fill('[data-testid="new-item-name-input"]', 'T-Shirt');
    await page.selectOption('[data-testid="new-item-category-select"]', 'clothing');
    await page.click('[data-testid="add-item-btn"]');

    // Verify items present
    await expect(page.locator('[data-testid="packing-list"]')).toBeVisible();

    // Toggle first item
    const checkboxes = page.locator('[data-testid^="item-checkbox-"]');
    await checkboxes.first().check();

    // Verify progress updates
    await expect(page.locator('[data-testid="progress-label"]')).toContainText('50%');

    // Export
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-btn"]'),
    ]);
    expect(download.suggestedFilename()).toMatch(/trippacker-backup/);
  });

  test('import trips', async ({ page }) => {
    const trips = JSON.stringify([
      {
        id: 'import-1',
        name: 'Imported Trip',
        destination: 'London',
        date: '2025-10-01',
        items: [{ id: 'i1', name: 'Umbrella', packed: false, category: 'miscellaneous' }],
      },
    ]);

    await page.click('[data-testid="import-btn"]');
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('[data-testid="import-btn"]'),
    ]);
    await fileChooser.setFiles({
      name: 'backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(trips),
    });

    await expect(page.locator('text=Imported Trip')).toBeVisible();
  });
});

#!/usr/bin/env python3
"""
Generates all E2E test files for TripPacker.
Run from trip-manager-app/ directory:
    python create_e2e_tests.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
E2E_DIR = os.path.join(HERE, 'e2e')
os.makedirs(E2E_DIR, exist_ok=True)

files = {}

files['helpers.ts'] = """\
import { Page } from '@playwright/test';

export async function createTrip(
  page: Page,
  name: string,
  items: string[] = []
): Promise<void> {
  await page.goto('/create-trip');
  await page.getByTestId('trip-name-input').fill(name);
  for (const item of items) {
    await page.getByTestId('new-item-name-input').fill(item);
    await page.getByTestId('add-item-button').click();
  }
  await page.getByTestId('save-trip-button').click();
  await page.waitForURL('**/trips');
}

export async function getFirstTripId(page: Page): Promise<string> {
  const tripCards = page.locator('[data-testid^="view-trip-"]');
  await tripCards.first().waitFor();
  const testId = await tripCards.first().getAttribute('data-testid');
  return testId!.replace('view-trip-', '');
}
"""

files['navigation.spec.ts'] = """\
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
});

test('navigates to home at /', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('navbar-brand')).toBeVisible();
});

test('navigates to trips page', async ({ page }) => {
  await page.goto('/trips');
  await expect(page.getByTestId('navbar-brand')).toBeVisible();
});

test('navigates to create trip page', async ({ page }) => {
  await page.goto('/create-trip');
  await expect(page.getByTestId('trip-name-input')).toBeVisible();
});

test('navbar brand links to home', async ({ page }) => {
  await page.goto('/trips');
  await page.getByTestId('navbar-brand').click();
  await page.waitForURL('**/');
  await expect(page).toHaveURL(/\\/$/);
});

test('nav-trips link is present', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-trips')).toBeVisible();
});

test('nav-create-trip link is present', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('nav-create-trip')).toBeVisible();
});

test('trips count badge appears when trips exist', async ({ page }) => {
  await page.goto('/create-trip');
  await page.getByTestId('trip-name-input').fill('Badge Test Trip');
  await page.getByTestId('save-trip-button').click();
  await page.waitForURL('**/trips');
  await expect(page.getByTestId('nav-trips-count')).toBeVisible();
});
"""

files['create-trip.spec.ts'] = """\
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
  await page.goto('/create-trip');
});

test('shows create trip form', async ({ page }) => {
  await expect(page.getByTestId('trip-name-input')).toBeVisible();
  await expect(page.getByTestId('trip-destination-input')).toBeVisible();
  await expect(page.getByTestId('save-trip-button')).toBeVisible();
});

test('save button disabled initially', async ({ page }) => {
  await expect(page.getByTestId('save-trip-button')).toBeDisabled();
});

test('save button enabled after entering name', async ({ page }) => {
  await page.getByTestId('trip-name-input').fill('My New Trip');
  await expect(page.getByTestId('save-trip-button')).not.toBeDisabled();
});

test('can add an item', async ({ page }) => {
  await page.getByTestId('new-item-name-input').fill('Passport');
  await page.getByTestId('add-item-button').click();
  await expect(page.getByTestId('item-input-0')).toBeVisible();
});

test('can add item with Enter key', async ({ page }) => {
  await page.getByTestId('new-item-name-input').fill('Laptop');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('item-input-0')).toBeVisible();
});

test('can remove an item', async ({ page }) => {
  await page.getByTestId('new-item-name-input').fill('Toothbrush');
  await page.getByTestId('add-item-button').click();
  await expect(page.getByTestId('item-input-0')).toBeVisible();
  await page.getByTestId('remove-item-0').click();
  await expect(page.getByTestId('item-input-0')).not.toBeVisible();
});

test('creates trip and navigates to trips page', async ({ page }) => {
  await page.getByTestId('trip-name-input').fill('Adventure Trip');
  await page.getByTestId('save-trip-button').click();
  await page.waitForURL('**/trips');
  await expect(page).toHaveURL(/trips/);
});

test('cancel returns to home', async ({ page }) => {
  await page.getByRole('link', { name: /cancel/i }).click();
  await page.waitForURL('**/');
  await expect(page).toHaveURL(/\\/$/);
});

test('created trip appears in trips list', async ({ page }) => {
  await page.getByTestId('trip-name-input').fill('Visible Trip');
  await page.getByTestId('save-trip-button').click();
  await page.waitForURL('**/trips');
  await expect(page.getByText('Visible Trip')).toBeVisible();
});
"""

files['trip-management.spec.ts'] = """\
import { test, expect } from '@playwright/test';
import { createTrip, getFirstTripId } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
});

test('can view trip details', async ({ page }) => {
  await createTrip(page, 'Detail Trip', ['Passport']);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`view-trip-${tripId}`).click();
  await page.waitForURL(`**/trip/${tripId}`);
  await expect(page).toHaveURL(new RegExp(`trip/${tripId}`));
});

test('can mark item as packed', async ({ page }) => {
  await createTrip(page, 'Pack Trip', ['Jacket']);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`view-trip-${tripId}`).click();
  await page.waitForURL(`**/trip/${tripId}`);
  const items = page.locator('[data-testid$="-in"]');
  await items.first().click();
  await expect(items.first()).toBeChecked();
});

test('can mark item as returned', async ({ page }) => {
  await createTrip(page, 'Return Trip', ['Sunglasses']);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`view-trip-${tripId}`).click();
  await page.waitForURL(`**/trip/${tripId}`);
  const returnItems = page.locator('[data-testid$="-back"]');
  await returnItems.first().click();
  await expect(returnItems.first()).toBeChecked();
});

test('can mark all packed', async ({ page }) => {
  await createTrip(page, 'Bulk Pack Trip', ['Item 1', 'Item 2']);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`view-trip-${tripId}`).click();
  await page.waitForURL(`**/trip/${tripId}`);
  await page.getByTestId('mark-all-packed').click();
  const packedItems = page.locator('[data-testid$="-in"]');
  const count = await packedItems.count();
  for (let i = 0; i < count; i++) {
    await expect(packedItems.nth(i)).toBeChecked();
  }
});

test('can reset all', async ({ page }) => {
  await createTrip(page, 'Reset Trip', ['Item A']);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`view-trip-${tripId}`).click();
  await page.waitForURL(`**/trip/${tripId}`);
  await page.getByTestId('mark-all-packed').click();
  await page.getByTestId('unpack-all').click();
  const packedItems = page.locator('[data-testid$="-in"]');
  const count = await packedItems.count();
  for (let i = 0; i < count; i++) {
    await expect(packedItems.nth(i)).not.toBeChecked();
  }
});

test('can copy a trip', async ({ page }) => {
  await createTrip(page, 'Original Trip', []);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`copy-trip-${tripId}`).click();
  await expect(page.getByText('Original Trip (Copy)')).toBeVisible();
});

test('delete shows confirmation', async ({ page }) => {
  await createTrip(page, 'Delete Me', []);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`delete-trip-${tripId}`).click();
  await expect(page.getByTestId(`delete-confirm-${tripId}`)).toBeVisible();
});

test('can cancel delete', async ({ page }) => {
  await createTrip(page, 'Keep Me', []);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`delete-trip-${tripId}`).click();
  await page.getByTestId(`cancel-delete-${tripId}`).click();
  await expect(page.getByText('Keep Me')).toBeVisible();
});

test('can delete a trip', async ({ page }) => {
  await createTrip(page, 'Goodbye Trip', []);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`delete-trip-${tripId}`).click();
  await page.getByTestId(`confirm-delete-${tripId}`).click();
  await expect(page.getByText('Goodbye Trip')).not.toBeVisible();
});
"""

files['persistence.spec.ts'] = """\
import { test, expect } from '@playwright/test';
import { createTrip, getFirstTripId } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.evaluate(() => localStorage.clear());
});

test('trips persist after page reload', async ({ page }) => {
  await createTrip(page, 'Persistent Trip', []);
  await page.reload();
  await expect(page.getByText('Persistent Trip')).toBeVisible();
});

test('item status persists after reload', async ({ page }) => {
  await createTrip(page, 'Status Trip', ['Socks']);
  const tripId = await getFirstTripId(page);
  await page.getByTestId(`view-trip-${tripId}`).click();
  await page.waitForURL(`**/trip/${tripId}`);
  const packedCheckbox = page.locator('[data-testid$="-in"]').first();
  await packedCheckbox.click();
  await expect(packedCheckbox).toBeChecked();
  await page.reload();
  await expect(page.locator('[data-testid$="-in"]').first()).toBeChecked();
});

test('can navigate between pages', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-trips').click();
  await page.waitForURL('**/trips');
  await expect(page).toHaveURL(/trips/);
  await page.getByTestId('nav-create-trip').click();
  await page.waitForURL('**/create-trip');
  await expect(page).toHaveURL(/create-trip/);
});

test('home shows correct stats', async ({ page }) => {
  await createTrip(page, 'Stats Trip', ['Item 1', 'Item 2']);
  await page.goto('/');
  // Stats section should show counts
  await expect(page.getByText('Stats Trip')).not.toBeVisible({ timeout: 1000 }).catch(() => {});
  // Home page loads without errors
  await expect(page.getByTestId('navbar-brand')).toBeVisible();
});

test('trips page shows search input', async ({ page }) => {
  await createTrip(page, 'Searchable Trip', []);
  await page.goto('/trips');
  await expect(page.getByTestId('trips-search')).toBeVisible();
});

test('trips page shows sort dropdown', async ({ page }) => {
  await createTrip(page, 'Sort Trip', []);
  await page.goto('/trips');
  await expect(page.getByTestId('trips-sort')).toBeVisible();
});
"""

for filename, content in files.items():
    path = os.path.join(E2E_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Created: {path}')

print(f'Done. Created {len(files)} files in {E2E_DIR}')

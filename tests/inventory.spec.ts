import { test, expect, Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

const getNames = (page: Page) =>
    page.locator('[data-test="inventory-item-name"]').allTextContents();

const getPrices = async (page: Page) => {
    const texts = await page.locator('[data-test="inventory-item-price"]').allTextContents();
    return texts.map((t: string) => parseFloat(t.replace('$', '')));
}

test.describe('Inventory', () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({page}) => {
        inventoryPage = new InventoryPage(page);
        await page.goto('/inventory.html');
    });

    test('INV-001: Inventory page shows all products', async () => {
        await expect(inventoryPage.title).toHaveText('Products');
        await expect(inventoryPage.items).toHaveCount(6);

        const count = await inventoryPage.items.count();
        for (let i = 0; i < count; i++) {
            const item = inventoryPage.items.nth(i);
            await expect(item.locator('img')).toBeVisible();
            await expect(item.locator('[data-test="inventory-item-name"]')).toBeVisible();
            await expect(item.locator('[data-test="inventory-item-desc"]')).toBeVisible();
            await expect(item.locator('[data-test="inventory-item-price"]')).toBeVisible();
            await expect(item.getByRole('button', { name: 'Add to Cart'})).toBeVisible();
        }
    });

    test('INV-002: Sort proucts by Name (A to Z)', async({ page }) => {
        await inventoryPage.sortBy('az');
        
        const names = await getNames(page);
        const expected = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(expected);
    });

    test('INV-003: Sort products by Name (Z to A)', async ({ page }) => {
        await inventoryPage.sortBy('za');

        const names = await getNames(page);
        const expected = [...names].sort((a, b) => b.localeCompare(a));
        expect(names).toEqual(expected);
    });

    test('INV-004: Sort products by price (low to high)', async ({ page }) => {
        await inventoryPage.sortBy('lohi');

        const prices = await getPrices(page);
        const expected = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(expected);
        expect(prices[0]).toBe(7.99);
        expect(prices[prices.length - 1]).toBe(49.99);
    });

    test('INV-005: Sort products by price (high to low)', async ({ page}) => {
        await inventoryPage.sortBy('hilo');

        const prices = await getPrices(page);
        const expected = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(expected);
        expect(prices[0]).toBe(49.99);
        expect(prices[prices.length - 1]).toBe(7.99);
    });

    test('INV-006: Open product details page', async({ page }) => {
        const productName = 'Sauce Labs Backpack';
        const card = inventoryPage.items.filter({ hasText: productName });
        const description = await card.locator('[data-test="inventory-item-desc"]').textContent();
        const price = await card.locator('[data-test="inventory-item-price"]').textContent();

        await card.locator('[data-test="inventory-item-name"]').click();

        await expect(page).toHaveURL(/inventory-item\.html/);
        await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(productName);
        await expect(page.locator('[data-test="inventory-item-desc"]')).toHaveText(description!);
        await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText(price!);
    });

    test('INV-007: Back to products from details page', async ({ page }) => {
        await inventoryPage.items.filter({ hasText: 'Sauce Labs Backpack' })
        .locator('[data-test="inventory-item-name"]').click();
        await expect(page).toHaveURL(/inventory-item\.html/);
        await page.locator('[data-test="back-to-products"]').click();
        await expect(page).toHaveURL(/inventory\.html/);
        await expect(inventoryPage.items).toHaveCount(6);
    })
})
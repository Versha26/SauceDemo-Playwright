import { Page, Locator } from '@playwright/test'

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly items: Locator;
    readonly cartBadge: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.items = page.locator('[data-test="inventory-item"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }
    async addToCart(product: string) {
        await this.page.locator(`[data-test="add-to-cart-${product}"]`).click();
    }

    async sortBy(option: string) {
        await this.sortDropdown.selectOption(option);
    }
}
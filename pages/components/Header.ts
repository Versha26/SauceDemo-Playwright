import { Page, Locator } from '@playwright/test'

export class Header {
    readonly cartLink: Locator;
    readonly menuButton: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    }

    async logout() {
        await this.menuButton.click();
        await this.logoutLink.click();
    }
}
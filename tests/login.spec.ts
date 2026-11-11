import {test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users, invalidUsers } from '../test-data/users.data'


test.describe('Login', () => {
    let loginPage: LoginPage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });
    test('LOGIN-001: Login with valid credentials', async ({ page }) => {
        await loginPage.login(users.standard.username, users.standard.password);
        await expect(page).toHaveURL(/inventory/);
    });

    test('LOG-002: Login with locked out user', async({}) => {
        await loginPage.login(users.lockedOut.username, users.lockedOut.password);
        await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
    });

    test('LOG-003: Log in with invalid password', async({}) => {
        await loginPage.login(invalidUsers.wrongPassword.username, invalidUsers.wrongPassword.password);
        await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
    });

    test('LOG-004: Log in with invalid username', async({}) => {
        await loginPage.login(invalidUsers.unknownUser.username, invalidUsers.unknownUser.password);
        await expect(loginPage.errorMessage).toContainText('Username and password do not match any user in this service');
    });

    test('LOG-005: Login with empty username', async({}) => {
        await loginPage.login(invalidUsers.emptyUserName.username, invalidUsers.emptyUserName.password);
        await expect(loginPage.errorMessage).toContainText('Username is required');
    });

    test('LOG-006: Login with empty password', async({}) => {
        await loginPage.login(invalidUsers.emptyPassword.username, invalidUsers.emptyPassword.password);
        await expect(loginPage.errorMessage).toContainText('Password is required');
    });
    
    test('LOG-007: Login with both fields empty', async({}) => {
        await loginPage.login(invalidUsers.bothEmpty.username, invalidUsers.bothEmpty.password);
        await expect(loginPage.errorMessage).toContainText('Username is required');
    });

    test('LOG-008: Login Error message can be dismissed', async({}) => {
        await loginPage.login(invalidUsers.bothEmpty.username, invalidUsers.bothEmpty.password);
        await expect(loginPage.errorMessage).toBeVisible();
        await loginPage.errorDismiss.click();
        await expect(loginPage.errorMessage).toBeHidden();
    });

    test('LOG-009: Direct access to inventory without login', async({page}) => {
        await page.goto('/inventory.html');
        await expect(loginPage.errorMessage).toContainText('when you are logged in.');
    })
})

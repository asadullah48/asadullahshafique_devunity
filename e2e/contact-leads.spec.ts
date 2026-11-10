import { test, expect } from '@playwright/test';
// All values here are synthetic. Requests are intercepted; no database or email is used.
test('synthetic enquiry shows the reference returned by the API', async ({ page }) => {
  await page.route('**/api/contact', async route => {
    const body = route.request().postDataJSON();
    expect(body).toMatchObject({ name: 'Synthetic Visitor', email: 'synthetic@example.invalid', company: 'Synthetic Company', enquiryType: 'freelance project', website: '' });
    await route.fulfill({ status: 201, json: { leadId: 'synthetic-123' } });
  });
  await page.goto('/#contact');
  await expect(page.locator('html')).toHaveAttribute('data-anchor-navigation-ready', 'true');
  await expect(page.locator('#contact')).toContainText('I store your name, email and message only to reply to you. To have them deleted, email asadullahshafique@hotmail.com.');
  await page.locator('#contact-name').fill('Synthetic Visitor');
  await page.locator('#contact-email').fill('synthetic@example.invalid');
  await page.getByLabel('Company (optional)', { exact: true }).fill('Synthetic Company');
  await page.getByLabel('Enquiry type', { exact: true }).selectOption('freelance project');
  await page.locator('#contact-message').fill('Synthetic test enquiry.');
  await page.locator('#contact button[type="submit"]').click();
  await expect(page.locator('#contact [role="status"]')).toContainText('#synthetic-123');
});
test('synthetic rate limit error preserves the enquiry', async ({ page }) => {
  await page.route('**/api/contact', route => route.fulfill({ status: 429, json: { error: 'Please wait 15 minutes before sending another enquiry.' } }));
  await page.goto('/#contact');
  await expect(page.locator('html')).toHaveAttribute('data-anchor-navigation-ready', 'true');
  await page.locator('#contact-name').fill('Synthetic Visitor');
  await page.locator('#contact-email').fill('synthetic@example.invalid');
  await page.locator('#contact-message').fill('Synthetic test enquiry.');
  await page.locator('#contact button[type="submit"]').click();
  await expect(page.locator('#contact [role="alert"]')).toContainText('15 minutes');
  await expect(page.locator('#contact-message')).toHaveValue('Synthetic test enquiry.');
});

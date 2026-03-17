import { test, expect } from '@playwright/test';

test('chat error', async ({ page }) => {
  // Let's capture page console and network to see the error
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', request => console.log('FAILED REQUEST:', request.url(), request.failure()?.errorText));
  
  await page.goto('http://localhost:8080');
  
  // Wait for the start conversation button
  console.log('Waiting for welcome message...');
  await page.waitForTimeout(2000);
  
  // Click start conversation
  const startBtn = await page.$('button >> text=Start a Conversation');
  if (startBtn) {
    console.log('Clicking start conversation...');
    await startBtn.click();
    await page.waitForTimeout(2000);
  }
  
  // Type message
  console.log('Typing a message...');
  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.fill('Hello');
    await page.waitForTimeout(500);
    // Find the send button (it has an ArrowUp icon)
    const buttons = await page.$$('button');
    const sendBtn = buttons[buttons.length - 1]; // Assume last button is send
    if (sendBtn) {
        console.log('Clicking send...');
        await sendBtn.click();
        await page.waitForTimeout(3000);
    }
  } else {
    console.log('Textarea not found');
  }
});

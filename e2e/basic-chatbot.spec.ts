import { test, expect, type Page } from '@playwright/test';

const DEMO_URL = '/extensions/chatbot/overview/demo/basic-chatbot';

test.beforeEach(async ({ page }) => {
  await page.goto(DEMO_URL);
  await expect(page.getByRole('region', { name: 'Chatbot' })).toBeVisible();
});

test.describe('Basic Chatbot - Page Load', () => {
  test('chatbot is visible on page load', async ({ page }) => {
    const chatbot = page.getByRole('region', { name: 'Chatbot' });
    await expect(chatbot).toBeVisible();
  });

  test('displays welcome heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Hi, ChatBot User/i })
    ).toBeVisible();
  });

  test('displays footnote disclaimer', async ({ page }) => {
    await expect(
      page.getByText('Always review AI-generated content prior to use.')
    ).toBeVisible();
  });

  test('toggle button shows expanded state', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Chatbot toggle' });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('Basic Chatbot - Welcome Prompts', () => {
  test('displays "Set up account" prompt card', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Set up account' })).toBeVisible();
    await expect(
      page.getByText('Choose the necessary settings and preferences for your account.')
    ).toBeVisible();
  });

  test('displays "Troubleshoot issue" prompt card', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Troubleshoot issue' })).toBeVisible();
    await expect(
      page.getByText('Find documentation and instructions to resolve your issue.')
    ).toBeVisible();
  });
});

test.describe('Basic Chatbot - Pre-loaded Messages', () => {
  test('displays initial user message', async ({ page }) => {
    const userMessage = page.getByRole('region', { name: /Message from user/i });
    await expect(userMessage).toBeVisible();
    await expect(userMessage).toContainText(
      'Hello, can you give me an example of what you can do?'
    );
  });

  test('displays initial bot response with rich content', async ({ page }) => {
    const botMessage = page.getByRole('region', { name: /Message from bot/i });
    await expect(botMessage).toBeVisible();
    await expect(botMessage).toContainText('strong importance');
  });

  test('bot response includes code blocks', async ({ page }) => {
    const botMessage = page.getByRole('region', { name: /Message from bot/i });
    await expect(botMessage.getByText('yaml', { exact: true })).toBeVisible();
    await expect(botMessage.getByText('js', { exact: true })).toBeVisible();
  });

  test('bot response has copy code buttons', async ({ page }) => {
    const copyButtons = page.getByRole('button', { name: 'Copy code' });
    await expect(copyButtons).toHaveCount(2);
  });
});

test.describe('Basic Chatbot - Response Actions', () => {
  test('bot message displays all action buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Good response' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bad response' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Listen' })).toBeVisible();
  });

  test('can click "Good response" action', async ({ page }) => {
    const goodBtn = page.getByRole('button', { name: 'Good response' });
    await goodBtn.click();
    // Button should remain visible after click (toggled state)
    await expect(goodBtn).toBeVisible();
  });

  test('can click "Bad response" action', async ({ page }) => {
    const badBtn = page.getByRole('button', { name: 'Bad response' });
    await badBtn.click();
    await expect(badBtn).toBeVisible();
  });
});

test.describe('Basic Chatbot - Send Message', () => {
  test('message bar is visible with placeholder', async ({ page }) => {
    const textbox = page.getByRole('textbox', { name: 'Send a message...' });
    await expect(textbox).toBeVisible();
    await expect(textbox).toHaveAttribute('placeholder', 'Send a message...');
  });

  test('send button appears when text is entered', async ({ page }) => {
    const textbox = page.getByRole('textbox', { name: 'Send a message...' });
    await textbox.fill('Test message');
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
  });

  test('send button disappears when text is cleared', async ({ page }) => {
    const textbox = page.getByRole('textbox', { name: 'Send a message...' });
    await textbox.fill('Test message');
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
    await textbox.fill('');
    await expect(page.getByRole('button', { name: 'Send' })).not.toBeVisible();
  });

  test('can send a message by clicking Send button', async ({ page }) => {
    const textbox = page.getByRole('textbox', { name: 'Send a message...' });
    await textbox.fill('What is PatternFly?');
    await page.getByRole('button', { name: 'Send' }).click();

    // New user message should appear
    const messages = page.getByRole('region', { name: /Message from user/i });
    await expect(messages).toHaveCount(2);
    await expect(messages.last()).toContainText('What is PatternFly?');

    // Textbox should be cleared after sending
    await expect(textbox).toHaveValue('');
  });

  test('can send a message by pressing Enter', async ({ page }) => {
    const textbox = page.getByRole('textbox', { name: 'Send a message...' });
    await textbox.fill('Hello from keyboard');
    await textbox.press('Enter');

    const messages = page.getByRole('region', { name: /Message from user/i });
    await expect(messages).toHaveCount(2);
    await expect(messages.last()).toContainText('Hello from keyboard');
  });

  test('Shift+Enter adds a newline instead of sending', async ({ page }) => {
    const textbox = page.getByRole('textbox', { name: 'Send a message...' });
    await textbox.fill('Line one');
    await textbox.press('Shift+Enter');
    await textbox.pressSequentially('Line two');

    // Message should not have been sent (still only 1 user message region)
    const messages = page.getByRole('region', { name: /Message from user/i });
    await expect(messages).toHaveCount(1);
  });

  test('bot responds after sending a message (simulated API delay)', async ({ page }) => {
    const textbox = page.getByRole('textbox', { name: 'Send a message...' });
    await textbox.fill('Tell me something');
    await page.getByRole('button', { name: 'Send' }).click();

    // Wait for bot response to finish loading (~5s simulated delay)
    await expect(
      page.getByRole('button', { name: 'Good response' }).last()
    ).toBeVisible({ timeout: 10_000 });

    // Should now have 2 bot messages (initial + new response)
    const botMessages = page.getByRole('region', { name: /Message from bot/i });
    await expect(botMessages).toHaveCount(2);
  });

  test('attach button is visible in message bar', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Attach' })).toBeVisible();
  });
});

test.describe('Basic Chatbot - Toggle Visibility', () => {
  test('can hide chatbot by clicking toggle', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Chatbot toggle' });
    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('region', { name: 'Chatbot' })).not.toBeVisible();
  });

  test('can show chatbot again after hiding', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Chatbot toggle' });

    await toggle.click();
    await expect(page.getByRole('region', { name: 'Chatbot' })).not.toBeVisible();

    await toggle.click();
    await expect(page.getByRole('region', { name: 'Chatbot' })).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('Basic Chatbot - Header Controls', () => {
  test('model selector shows "Granite 7B" by default', async ({ page }) => {
    const modelSelector = page.getByRole('button', { name: 'Select model' });
    await expect(modelSelector).toBeVisible();
    await expect(modelSelector).toContainText('Granite 7B');
  });

  test('can open model selector dropdown and see options', async ({ page }) => {
    await page.getByRole('button', { name: 'Select model' }).click();
    await expect(page.getByText('Llama 3.0')).toBeVisible();
    await expect(page.getByText('Mistral 3B')).toBeVisible();
  });

  test('can switch to a different model', async ({ page }) => {
    await page.getByRole('button', { name: 'Select model' }).click();
    await page.getByText('Llama 3.0').click();

    const modelSelector = page.getByRole('button', { name: /Select model/i });
    await expect(modelSelector).toContainText('Llama 3.0');
  });

  test('options dropdown opens with display mode choices', async ({ page }) => {
    await page.getByRole('button', { name: 'Chatbot options' }).click();

    await expect(page.getByText('Overlay')).toBeVisible();
    await expect(page.getByText('Dock to window')).toBeVisible();
    await expect(page.getByText('Fullscreen')).toBeVisible();
  });

  test('can switch display mode to fullscreen', async ({ page }) => {
    await page.getByRole('button', { name: 'Chatbot options' }).click();
    await page.getByText('Fullscreen').click();

    const chatbot = page.locator('.pf-chatbot--fullscreen');
    await expect(chatbot).toBeVisible();
  });

  test('can switch display mode to docked', async ({ page }) => {
    await page.getByRole('button', { name: 'Chatbot options' }).click();
    await page.getByText('Dock to window').click();

    const chatbot = page.locator('.pf-chatbot--docked');
    await expect(chatbot).toBeVisible();
  });
});

test.describe('Basic Chatbot - Chat History Drawer', () => {
  test('can open chat history drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'Chat history drawer' }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('heading', { name: 'Chat history' })).toBeVisible();
    await expect(
      drawer.getByRole('textbox', { name: 'Search previous conversations' })
    ).toBeVisible();
  });

  test('"New chat" button is visible in history drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'Chat history drawer' }).click();
    await expect(page.getByRole('dialog').getByRole('button', { name: 'New chat' })).toBeVisible();
  });

  test('displays conversation history grouped by date', async ({ page }) => {
    await page.getByRole('button', { name: 'Chat history drawer' }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer.getByRole('heading', { name: 'Today' })).toBeVisible();
    await expect(drawer.getByRole('heading', { name: 'This month' })).toBeVisible();
  });

  test('can search in chat history', async ({ page }) => {
    await page.getByRole('button', { name: 'Chat history drawer' }).click();
    const drawer = page.getByRole('dialog');
    const searchBox = drawer.getByRole('textbox', {
      name: 'Search previous conversations',
    });
    await searchBox.fill('nonexistent query');
    await expect(drawer.getByText('No results found')).toBeVisible();
  });

  test('can close drawer with close button', async ({ page }) => {
    await page.getByRole('button', { name: 'Chat history drawer' }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();

    await drawer.getByRole('button', { name: 'Close drawer panel' }).click();
    await expect(drawer).not.toBeVisible();
  });

  test('"New chat" clears messages and closes drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'Chat history drawer' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'New chat' }).click();

    // Drawer should close
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Messages should be cleared — only welcome prompt visible
    await expect(
      page.getByRole('region', { name: /Message from user/i })
    ).toHaveCount(0);
  });
});

test.describe('Basic Chatbot - Accessibility', () => {
  test('skip-to-chatbot link is present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Skip to chatbot' })).toBeAttached();
  });

  test('message log region has correct aria label', async ({ page }) => {
    await expect(
      page.getByRole('region', { name: 'Scrollable message log' })
    ).toBeVisible();
  });

  test('chatbot container is a landmark region', async ({ page }) => {
    const chatbot = page.getByRole('region', { name: 'Chatbot' });
    await expect(chatbot).toBeVisible();
  });

  test('messages have descriptive aria labels with timestamps', async ({ page }) => {
    const userMessage = page.getByRole('region', { name: /Message from user - /i });
    await expect(userMessage).toBeVisible();

    const botMessage = page.getByRole('region', { name: /Message from bot - /i });
    await expect(botMessage).toBeVisible();
  });
});

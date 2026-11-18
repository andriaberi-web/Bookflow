import { act, render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './app';
import { SettingsProvider } from './helpers/settings';

// Waits for the page's own requests to settle.
async function renderAt(path) {
    await act(async () => {
        render(
            <SettingsProvider>
                <MemoryRouter initialEntries={ [path] }>
                    <App />
                </MemoryRouter>
            </SettingsProvider>
        );
    });
}

beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
});

test('the site opens straight on the converter', async () => {
    await renderAt('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Drop in a book.');
});

test('the footer shows the installed PDF2EPUB version', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ engine: '1.1.0+g1a2b3c4' }) }));
    await renderAt('/');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Uses PDF2EPUB 1.1.0');
});

test('the page is in English, even where Georgian was picked before', async () => {
    localStorage.setItem('lang', 'ka');
    await renderAt('/');
    expect(screen.queryByRole('button', { name: 'ქა' })).toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Drop in a book.');
    expect(document.documentElement.lang).toBe('en');
});

test('the theme button switches between light and dark', async () => {
    await renderAt('/');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light mode' }));
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('light');
});

test('an unknown address shows the not-found page', async () => {
    await renderAt('/nowhere');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
});

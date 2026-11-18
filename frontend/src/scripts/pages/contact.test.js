import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../app';
import { SettingsProvider } from '../helpers/settings';

// Everything goes out by XHR; this stands in for it.
let sent;
class FakeXhr {
    upload = {};
    open(method, url) {
        this.url = url;
    }
    setRequestHeader() {}
    send(form) {
        sent = { url: this.url, fields: Object.fromEntries(form.entries()) };
        this.status = FakeXhr.status;
        this.responseText = JSON.stringify(FakeXhr.reply);
        this.onload();
    }
}

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

const type = (label, value) => fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } });
const choose = (kind) => fireEvent.change(screen.getByLabelText('What’s it about?'), { target: { value: kind } });
const click = async (name) => act(async () => fireEvent.click(screen.getByRole('button', { name })));

beforeEach(() => {
    localStorage.clear();
    sent = null;
    FakeXhr.status = 201;
    FakeXhr.reply = {};
    global.XMLHttpRequest = FakeXhr;
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) }));
    document.cookie = 'csrftoken=test';
});

test('a message is sent, and the form can be used again', async () => {
    await renderAt('/contact');

    await click('Send message');
    expect(screen.getByRole('alert')).toHaveTextContent('Write a message first.');
    expect(sent).toBeNull();

    type('Name', 'Nino');
    type('Message', 'Love the converter.');
    await click('Send message');

    expect(sent).toEqual({ url: '/api/contact/', fields: { kind: 'message', name: 'Nino', text: 'Love the converter.' } });
    expect(screen.getByRole('status')).toHaveTextContent('Thank you. We have it.');
    await click('Write another');
    expect(screen.getByLabelText('Message')).toHaveValue('');
});

test('the server’s refusal is shown', async () => {
    FakeXhr.status = 400;
    FakeXhr.reply = { error: 'bad_email' };
    await renderAt('/contact');
    type('Message', 'Hi');
    await click('Send message');

    expect(screen.getByRole('alert')).toHaveTextContent('email address doesn’t look right');
});

test('each kind shows its own fields', async () => {
    await renderAt('/contact');
    expect(screen.queryByLabelText('Which page or book?', { exact: false })).toBeNull();

    choose('problem');
    expect(screen.getByLabelText('Which page or book?', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('What went wrong?')).toBeInTheDocument();
});

test('a problem is sent with the page it’s about', async () => {
    await renderAt('/contact?kind=problem');
    type('Which page or book?', '/convert/abc');
    type('What went wrong?', 'Chapter 3 is missing.');
    await click('Send report');

    expect(sent.fields).toEqual({ kind: 'problem', link: '/convert/abc', text: 'Chapter 3 is missing.' });
});

test('fields of another kind aren’t sent', async () => {
    await renderAt('/contact?kind=problem');
    type('Which page or book?', '/convert');
    choose('message');
    type('Message', 'Hello');
    await click('Send message');

    expect(sent.fields).toEqual({ kind: 'message', text: 'Hello' });
});

test('the navbar and the home page lead to the contact page', async () => {
    await renderAt('/');

    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: /Contact/ })).toHaveAttribute('href', '/contact');
    expect(within(nav).queryByRole('link', { name: /Suggest/ })).toBeNull();
    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', '/contact');
});

test('beside the form are the other places to go', async () => {
    await renderAt('/contact');
    const main = within(screen.getByRole('main'));

    expect(main.getByRole('link', { name: 'Open an issue on GitHub' })).toHaveAttribute('href', 'https://github.com/andriaberi-web/Bookflow/issues/new');
    expect(main.getByRole('link', { name: 'Bookflow' })).toHaveAttribute('href', 'https://github.com/andriaberi-web/Bookflow');
    expect(main.getByRole('link', { name: 'PDF2EPUB' })).toHaveAttribute('href', 'https://github.com/andriaberi/PDF2EPUB');
});

test('the email address sits beside the send button, and the tab says Contact', async () => {
    await renderAt('/contact');

    expect(screen.getByRole('link', { name: 'andria24b@gmail.com' })).toHaveAttribute('href', 'mailto:andria24b@gmail.com');
    expect(document.title).toBe('Contact · Bookflow');
});

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from '../i18n/en';
import ka from '../i18n/ka';

const DICTIONARIES = { en, ka };
// Georgian stays translated, but there's no switch to it.
const LANG = 'en';

// Storage can be blocked (private windows), so every read and write may fail.
function load(key, fallback) {
    try {
        return localStorage.getItem(key) || fallback;
    } catch {
        return fallback;
    }
}

function save(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {}
}

function systemTheme() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
    const [theme, setTheme] = useState(() => load('theme', systemTheme()));

    useEffect(() => {
        document.documentElement.lang = LANG;
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        save('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    }, []);

    const value = useMemo(
        () => ({ lang: LANG, theme, toggleTheme, t: DICTIONARIES[LANG] }),
        [theme, toggleTheme]
    );

    return <SettingsContext.Provider value={ value }>{ children }</SettingsContext.Provider>;
}

export function useSettings() {
    return useContext(SettingsContext);
}

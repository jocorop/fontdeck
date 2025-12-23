/*
 * Copyright (C) 2025 jocorop
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { create } from 'zustand';
import type { FontData, Collection } from '../types';

interface AppState {
    // State
    isInitialLoad: boolean;
    fonts: FontData[];
    filteredFonts: FontData[];
    collections: Collection[];
    favorites: string[]; // IDs of favorite fonts

    // View State
    activeView: 'list' | 'details';
    selectedFamily: string | null;
    activeProvider: 'all' | 'local' | 'google' | 'added' | string; // string for collection IDs

    // UI Settings
    previewText: string;
    previewSize: number;
    searchTerm: string;
    viewMode: 'list' | 'grid';
    locale: 'en' | 'es';
    theme: 'dark' | 'light';
    accentColor: string;

    setLocale: (lang: 'en' | 'es') => void;
    setTheme: (theme: 'dark' | 'light') => void;

    // Feedback
    toastMessage: string | null;

    // Context Menu
    contextMenu: {
        isOpen: boolean;
        x: number;
        y: number;
        targetId: string | null;
        type: 'font' | 'collection';
    };

    // UI Actions
    toggleInfo: () => void;
    isInfoOpen: boolean;

    // Sidebar
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;

    // Scroll Position
    listScrollTop: number;
    setListScrollTop: (top: number) => void;
    listPage: number;
    setListPage: (page: number) => void;

    // Actions
    addFonts: (newFonts: FontData[]) => void;
    setPreviewText: (text: string) => void;
    setPreviewSize: (size: number) => void;
    setSearchTerm: (term: string) => void;
    setAccentColor: (color: string) => void;
    loadFromPersistence: () => Promise<void>;

    setActiveView: (view: 'list' | 'details') => void;
    setSelectedFamily: (family: string | null) => void;
    setActiveProvider: (provider: 'all' | 'local' | 'google' | 'added' | string) => void;

    // Collections & Favorites
    createCollection: (name: string) => void;
    deleteCollection: (cId: string) => void;
    addToCollection: (cId: string, fId: string) => void;
    toggleFavorite: (fId: string) => void;

    // Toast
    showToast: (msg: string, duration?: number) => void;
    hideToast: () => void;

    // Context Menu Actions
    openContextMenu: (x: number, y: number, targetId: string, type: 'font' | 'collection') => void;
    closeContextMenu: () => void;
}

export const useStore = create<AppState>((set, get) => {
    let toastTimeoutId: ReturnType<typeof setTimeout> | null = null; // To manage toast timeouts

    return {
        isInitialLoad: true,
        fonts: [],
        filteredFonts: [],
        collections: [],
        favorites: [],

        activeView: 'list',
        selectedFamily: null,
        activeProvider: 'all',

        previewText: 'The quick brown fox jumps over the lazy dog',
        previewSize: 32,
        searchTerm: '',
        viewMode: 'list',
        locale: 'en',
        theme: 'dark',
        accentColor: '#00E676', // Default Green

        toastMessage: null,

        contextMenu: {
            isOpen: false,
            x: 0,
            y: 0,
            targetId: null,
            type: 'font'
        },

        isInfoOpen: false,
        toggleInfo: () => set(state => ({ isInfoOpen: !state.isInfoOpen })),

        isSidebarCollapsed: false,
        toggleSidebar: () => {
            set(state => {
                const newState = !state.isSidebarCollapsed;
                import('../services/db').then(({ getConsentStatus, saveUserSetting }) => {
                    if (getConsentStatus() === 'granted') saveUserSetting('isSidebarCollapsed', newState);
                });
                return { isSidebarCollapsed: newState };
            });
        },

        listScrollTop: 0,
        setListScrollTop: (top) => set({ listScrollTop: top }),
        listPage: 1,
        setListPage: (page) => set({ listPage: page }),

        addFonts: (newFonts) => set((state) => {
            // Filter out fonts that have the same HASH as existing fonts (Content Deduplication)
            const uniqueNew = newFonts.filter(nf => !state.fonts.some(f => f.hash === nf.hash));

            // If length changed, maybe show a toast? 
            // The user implies they should just be "discarded", i.e., silently ignored or maybe ignored with a note.
            // "it should detect that it is the same and therefore discard it." -> Silent discard is acceptable for duplicates.

            const updatedFonts = [...state.fonts, ...uniqueNew];

            // Persistence Check
            import('../services/db').then(({ getConsentStatus, saveFontsToDB }) => {
                if (getConsentStatus() === 'granted') {
                    saveFontsToDB(updatedFonts);
                }
            });

            return {
                fonts: updatedFonts,
                filteredFonts: filterFonts(updatedFonts, state.searchTerm, state.activeProvider, state.favorites, state.collections)
            };
        }),

        setPreviewText: (text) => {
            set({ previewText: text });
            import('../services/db').then(({ getConsentStatus, saveUserSetting }) => {
                if (getConsentStatus() === 'granted') saveUserSetting('previewText', text);
            });
        },

        setPreviewSize: (size) => {
            set({ previewSize: size });
            import('../services/db').then(({ getConsentStatus, saveUserSetting }) => {
                if (getConsentStatus() === 'granted') saveUserSetting('previewSize', size);
            });
        },

        setSearchTerm: (term) => set((state) => ({
            searchTerm: term,
            filteredFonts: filterFonts(state.fonts, term, state.activeProvider, state.favorites, state.collections),
            listScrollTop: 0,
            listPage: 1
        })),

        setAccentColor: (color) => {
            // Validation: Hex color only
            const hexRegex = /^#[0-9A-Fa-f]{6}$/;
            const validColor = hexRegex.test(color) ? color : '#00E676';

            set({ accentColor: validColor });
            import('../services/db').then(({ getConsentStatus, saveUserSetting }) => {
                if (getConsentStatus() === 'granted') saveUserSetting('accentColor', validColor);
            });
        },

        setLocale: (lang) => {
            set({ locale: lang });
            import('../i18n').then(m => m.default.changeLanguage(lang));
            import('../services/db').then(({ getConsentStatus, saveUserSetting }) => {
                if (getConsentStatus() === 'granted') saveUserSetting('locale', lang);
            });
        },

        setTheme: (theme) => {
            set({ theme });
            document.documentElement.setAttribute('data-theme', theme);
            import('../services/db').then(({ getConsentStatus, saveUserSetting }) => {
                if (getConsentStatus() === 'granted') saveUserSetting('theme', theme);
            });
        },

        setActiveView: (view) => set({ activeView: view }),
        setSelectedFamily: (family) => set({ selectedFamily: family }),

        setActiveProvider: (provider) => set((state) => ({
            activeProvider: provider,
            filteredFonts: filterFonts(state.fonts, state.searchTerm, provider, state.favorites, state.collections),
            listScrollTop: 0,
            listPage: 1
        })),

        createCollection: (name) => set((state) => {
            const newCol = { id: crypto.randomUUID(), name, fontIds: [] };
            const updated = [...state.collections, newCol];
            import('../services/db').then(({ getConsentStatus, saveCollectionsToDB }) => {
                if (getConsentStatus() === 'granted') saveCollectionsToDB(updated);
            });
            return { collections: updated };
        }),

        deleteCollection: (cId) => set((state) => {
            const updated = state.collections.filter(c => c.id !== cId);
            import('../services/db').then(({ getConsentStatus, saveCollectionsToDB }) => {
                if (getConsentStatus() === 'granted') saveCollectionsToDB(updated);
            });
            return { collections: updated };
        }),

        addToCollection: (cId, fId) => set((state) => {
            const updated = state.collections.map(c => c.id === cId ? { ...c, fontIds: [...c.fontIds, fId] } : c);
            import('../services/db').then(({ getConsentStatus, saveCollectionsToDB }) => {
                if (getConsentStatus() === 'granted') saveCollectionsToDB(updated);
            });
            return { collections: updated };
        }),

        toggleFavorite: (fId) => set((state) => {
            const isFav = state.favorites.includes(fId);
            const newFavs = isFav ? state.favorites.filter(id => id !== fId) : [...state.favorites, fId];

            import('../services/db').then(({ getConsentStatus, saveFavoritesToDB }) => {
                if (getConsentStatus() === 'granted') saveFavoritesToDB(newFavs);
            });

            return {
                favorites: newFavs,
                filteredFonts: filterFonts(state.fonts, state.searchTerm, state.activeProvider, newFavs, state.collections)
            };
        }),

        showToast: (msg, duration = 3000) => {
            if (toastTimeoutId) clearTimeout(toastTimeoutId);
            set({ toastMessage: msg });
            toastTimeoutId = setTimeout(() => {
                set({ toastMessage: null });
                toastTimeoutId = null;
            }, duration);
        },
        hideToast: () => {
            if (toastTimeoutId) clearTimeout(toastTimeoutId);
            set({ toastMessage: null });
        },

        openContextMenu: (x, y, targetId, type) => set({ contextMenu: { isOpen: true, x, y, targetId, type } }),
        closeContextMenu: () => set({ contextMenu: { isOpen: false, x: 0, y: 0, targetId: null, type: 'font' } }),

        loadFromPersistence: async () => {
            const { getConsentStatus, loadFontsFromDB, loadUserDataFromDB } = await import('../services/db');
            const { loadFontToDocument } = await import('../utils/fontParser');
            const { computeFileHash } = await import('../utils/hasher');

            if (getConsentStatus() === 'granted') {
                const savedFonts = await loadFontsFromDB();
                const { collections, settings } = await loadUserDataFromDB();

                // Revive Fonts: Regenerate Blob URLs and Register to Document
                const revivedFonts = await Promise.all(savedFonts.map(async f => {
                    // Start by validating the file object
                    if (f.file && (f.file instanceof Blob || f.file instanceof File)) {
                        // Update: ensure hash exists
                        if (!f.hash) {
                            f.hash = await computeFileHash(f.file);
                        }

                        const newUrl = URL.createObjectURL(f.file);
                        // Register font
                        loadFontToDocument(f.metadata.fullName, newUrl);
                        return { ...f, url: newUrl, hash: f.hash || 'legacy-no-hash' };
                    }
                    return f;
                }));

                set((state) => {
                    // Merge carefully to avoid duplicates
                    const uniqueSaved = revivedFonts.filter(sf => !state.fonts.some(f => f.id === sf.id));
                    const allFonts = [...state.fonts, ...uniqueSaved];

                    // Parse settings
                    const favorites = settings['favorites'] || state.favorites;
                    const previewText = settings['previewText'] || state.previewText;
                    const previewSize = settings['previewSize'] || state.previewSize;
                    const accentColor = settings['accentColor'] || state.accentColor;
                    const locale = settings['locale'] || state.locale;
                    const theme = settings['theme'] || state.theme;
                    const isSidebarCollapsed = settings['isSidebarCollapsed'] ?? state.isSidebarCollapsed;

                    // Trigger i18next change if loaded
                    if (settings['locale']) {
                        import('../i18n').then(m => m.default.changeLanguage(locale));
                    }

                    // Apply theme
                    document.documentElement.setAttribute('data-theme', theme);

                    return {
                        isInitialLoad: false,
                        fonts: allFonts,
                        collections: collections.length > 0 ? collections : state.collections,
                        favorites: favorites,
                        previewText: previewText,
                        previewSize: previewSize,
                        accentColor: accentColor,
                        locale: locale,
                        theme: theme,
                        isSidebarCollapsed: isSidebarCollapsed,
                        filteredFonts: filterFonts(allFonts, state.searchTerm, state.activeProvider, favorites, collections.length > 0 ? collections : state.collections),
                        listScrollTop: 0,
                        listPage: 1
                    };
                });
            } else {
                set({ isInitialLoad: false });
            }
        }
    };
});

// Helper to filter based on search AND provider
const filterFonts = (fonts: FontData[], term: string, provider: string, favorites: string[], collections: Collection[] = []) => {
    let constrained = fonts;

    // Filter by Provider
    if (provider === 'local') {
        constrained = fonts.filter(f => f.tags.includes('local'));
    } else if (provider === 'google') {
        constrained = fonts.filter(f => f.tags.includes('google'));
    } else if (provider === 'added') {
        constrained = fonts.filter(f => !f.tags.includes('local') && !f.tags.includes('google'));
    } else if (provider === 'favorites') {
        constrained = fonts.filter(f => favorites.includes(f.id));
    } else if (provider !== 'all') {
        // Assume provider is a Collection ID
        const targetCollection = collections.find(c => c.id === provider);
        if (targetCollection) {
            constrained = fonts.filter(f => targetCollection.fontIds.includes(f.id));
        }
    }

    if (!term) return constrained;
    const lower = term.toLowerCase();
    return constrained.filter(f =>
        f.metadata.family.toLowerCase().includes(lower) ||
        f.metadata.subfamily.toLowerCase().includes(lower)
    );
};

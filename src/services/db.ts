
import type { FontData, Collection } from '../types';

const DB_NAME = 'FontManagerDB';
const DB_VERSION = 2; // Bumped for new stores
const STORE_FONTS = 'fonts';
const STORE_COLLECTIONS = 'collections';
const STORE_USERDATA = 'userdata'; // For favorites, settings, etc.

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error || new Error('Unknown DB Error'));
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // v1: Fonts
            if (!db.objectStoreNames.contains(STORE_FONTS)) {
                db.createObjectStore(STORE_FONTS, { keyPath: 'id' });
            }

            // v2: Collections & UserData
            if (!db.objectStoreNames.contains(STORE_COLLECTIONS)) {
                db.createObjectStore(STORE_COLLECTIONS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_USERDATA)) {
                db.createObjectStore(STORE_USERDATA, { keyPath: 'key' });
            }
        };
    });
};

// --- Fonts ---

export const saveFontsToDB = async (fonts: FontData[]): Promise<void> => {
    // Filter including system fonts
    const persistableFonts = fonts.filter(f => f.file || f.url || f.tags.includes('local'));

    if (persistableFonts.length === 0) return; // Note: if user deleted all, we might want to clear db?
    // Current logic append/overwrite. To support deletion, we might need a full sync approach.
    // For now, let's stick to "save what we have". Use clearFontsDB if specifically clearing cache.

    try {
        const db = await openDB();
        const tx = db.transaction(STORE_FONTS, 'readwrite');
        const store = tx.objectStore(STORE_FONTS);

        // We clear first to ensure deleted fonts are removed from cache
        await new Promise<void>((resolve, reject) => {
            const clearReq = store.clear();
            clearReq.onsuccess = () => resolve();
            clearReq.onerror = () => reject(clearReq.error || new Error('Unknown DB Error'));
        });

        for (const font of persistableFonts) {
            store.put(font);
        }

        return await new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error('Unknown DB Error'));
        });
    } catch (err) {
        console.error("Failed to save fonts:", err);
    }
};

export const loadFontsFromDB = async (): Promise<FontData[]> => {
    try {
        const db = await openDB();
        return await new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_FONTS, 'readonly');
            const store = tx.objectStore(STORE_FONTS);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as FontData[]);
            request.onerror = () => reject(request.error || new Error('Unknown DB Error'));
        });
    } catch (err) {
        console.error("Failed to load fonts:", err);
        return [];
    }
};

export const clearFontsDB = async (): Promise<void> => {
    try {
        const db = await openDB();
        const tx = db.transaction([STORE_FONTS, STORE_COLLECTIONS, STORE_USERDATA], 'readwrite');
        tx.objectStore(STORE_FONTS).clear();
        tx.objectStore(STORE_COLLECTIONS).clear();
        tx.objectStore(STORE_USERDATA).clear();

        return await new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error('Unknown DB Error'));
        });
    } catch (err) {
        console.error("Failed to clear DB:", err);
    }
};

// --- Collections ---

export const saveCollectionsToDB = async (collections: Collection[]): Promise<void> => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_COLLECTIONS, 'readwrite');
        const store = tx.objectStore(STORE_COLLECTIONS);

        // Full sync pattern: clear then add
        store.clear();

        for (const col of collections) {
            store.put(col);
        }

        return await new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error('Unknown DB Error'));
        });
    } catch (err) { console.error("Failed save collections", err); }
};

// --- Favorites & Settings (UserData) ---

export const saveUserSetting = async (key: string, value: any): Promise<void> => {
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_USERDATA, 'readwrite');
        const store = tx.objectStore(STORE_USERDATA);

        store.put({ key, value });

        return await new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error('Unknown DB Error'));
        });
    } catch (err) { console.error(`Failed save setting ${key}`, err); }
};

export const saveFavoritesToDB = (favorites: string[]) => saveUserSetting('favorites', favorites);

// --- Load All User Data ---

export const loadUserDataFromDB = async () => {
    try {
        const db = await openDB();
        const tx = db.transaction([STORE_COLLECTIONS, STORE_USERDATA], 'readonly');

        const cStore = tx.objectStore(STORE_COLLECTIONS);
        const uStore = tx.objectStore(STORE_USERDATA);

        const collections = await new Promise<Collection[]>((res) => {
            const r = cStore.getAll();
            r.onsuccess = () => res(r.result);
        });

        // Load all userdata as a dictionary
        const settings = await new Promise<Record<string, any>>((res) => {
            const r = uStore.getAll();
            r.onsuccess = () => {
                const result: Record<string, any> = {};
                (r.result as { key: string, value: any }[]).forEach(item => {
                    result[item.key] = item.value;
                });
                res(result);
            };
        });

        return { collections, settings };
    } catch (err) {
        console.error("Failed load user data", err);
        return { collections: [], settings: {} };
    }
};

// --- Consent ---

const CONSENT_KEY = 'font_storage_consent';

export const getConsentStatus = (): 'granted' | 'denied' | 'unknown' => {
    const val = localStorage.getItem(CONSENT_KEY);
    if (val === 'granted') return 'granted';
    if (val === 'denied') return 'denied';
    return 'unknown';
};

export const setConsentStatus = (status: 'granted' | 'denied'): void => {
    localStorage.setItem(CONSENT_KEY, status);
    if (status === 'denied') {
        clearFontsDB();
    }
};

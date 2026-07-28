// src/utils/indexedDB.js

// 🎯 Set to 'fwc_Media_DB' so it connects to the active database used by your public views
const DB_NAME = 'fwc_Media_DB';
const DB_VERSION = 1;

// Define object store names for all modules
export const STORES = {
  SERMONS: 'sermons',
  GALLERY: 'gallery',
  EVENTS: 'events',
  LEADERSHIP: 'leadership',
};

// Open database connection and ensure required stores exist
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

// Dispatch global event so all mounted components refresh UI instantly
const notifyDBUpdate = () => {
  window.dispatchEvent(new Event('fwc_db_updated'));
};

// Get all items from a specific store
export const getAllFromDB = async (storeName) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains(storeName)) {
        resolve([]);
        return;
      }
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error(`Error reading from ${storeName}:`, err);
    return [];
  }
};

// Save or update an item in a specific store
export const saveToDB = async (storeName, item) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    // Ensure the store exists before attempting transaction
    if (!db.objectStoreNames.contains(storeName)) {
      db.close();
      // Trigger a version upgrade if the store is missing
      const upgradeReq = indexedDB.open(DB_NAME, db.version + 1);
      upgradeReq.onupgradeneeded = (e) => {
        const uDb = e.target.result;
        if (!uDb.objectStoreNames.contains(storeName)) {
          uDb.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
      upgradeReq.onsuccess = (e) => {
        const uDb = e.target.result;
        const tx = uDb.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(item);
        req.onsuccess = () => {
          notifyDBUpdate();
          resolve();
        };
        req.onerror = (err) => reject(err);
      };
      return;
    }

    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);
    request.onsuccess = () => {
      notifyDBUpdate();
      resolve();
    };
    request.onerror = (e) => reject(e.target.error);
  });
};

// Delete an item from a specific store
export const deleteFromDB = async (storeName, id) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(storeName)) {
      resolve();
      return;
    }
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => {
      notifyDBUpdate();
      resolve();
    };
    request.onerror = (e) => reject(e.target.error);
  });
};

// Helper function to convert files to Base64/DataURL
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
};
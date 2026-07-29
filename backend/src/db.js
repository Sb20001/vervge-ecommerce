import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, '..', 'data', 'db.json');

const defaultData = { users: [], products: [], orders: [] };

export const db = await JSONFilePreset(dbFile, defaultData);

// Simple auto-increment id helper
export function nextId(collection) {
  const items = db.data[collection];
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}

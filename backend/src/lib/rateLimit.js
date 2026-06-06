import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const LIMITS_FILE = path.join(DATA_DIR, 'rateLimits.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LIMITS_FILE)) fs.writeFileSync(LIMITS_FILE, '{}');

export function getRateLimits() {
  return JSON.parse(fs.readFileSync(LIMITS_FILE, 'utf-8'));
}

export function saveRateLimits(data) {
  fs.writeFileSync(LIMITS_FILE, JSON.stringify(data, null, 2));
}

function getWindowKey(category, id) {
  const hour = new Date().getHours();
  const date = new Date().toDateString();
  return `${category}:${id}:${date}:${hour}`;
}

export function checkAndIncrement(category, id, max) {
  const key = getWindowKey(category, id);
  const limits = getRateLimits();
  const now = Date.now();

  if (!limits[key]) {
    limits[key] = { count: 1, start: now };
    saveRateLimits(limits);
    return { allowed: true, remaining: max - 1 };
  }

  const elapsed = now - limits[key].start;
  const hour = 3600000;
  if (elapsed > hour) {
    limits[key] = { count: 1, start: now };
    saveRateLimits(limits);
    return { allowed: true, remaining: max - 1 };
  }

  limits[key].count++;
  saveRateLimits(limits);

  if (limits[key].count > max) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: max - limits[key].count };
}
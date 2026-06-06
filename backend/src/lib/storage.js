import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'meals.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

export function getMeals() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function addMeal(meal) {
  const meals = getMeals();
  const newMeal = { _id: Date.now().toString(), ...meal, timestamp: new Date().toISOString() };
  meals.unshift(newMeal);
  fs.writeFileSync(DATA_FILE, JSON.stringify(meals.slice(0, 100), null, 2));
  return newMeal;
}

export function updateMeal(id, updates) {
  const meals = getMeals();
  const index = meals.findIndex(m => m._id === id);
  if (index === -1) throw new Error('Meal not found');
  meals[index] = { ...meals[index], ...updates };
  fs.writeFileSync(DATA_FILE, JSON.stringify(meals, null, 2));
  return meals[index];
}
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RECIPES_FILE = path.join(__dirname, 'recipes.json');

// Initialisiere recipes.json wenn nicht vorhanden
if (!fs.existsSync(RECIPES_FILE)) {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify([], null, 2));
}

export function readRecipes() {
  try {
    const data = fs.readFileSync(RECIPES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading recipes:', error);
    return [];
  }
}

export function saveRecipe(recipe) {
  try {
    const recipes = readRecipes();
    recipes.push(recipe);
    fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
    return recipe;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
}

export function deleteRecipe(id) {
  try {
    const recipes = readRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    fs.writeFileSync(RECIPES_FILE, JSON.stringify(filtered, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return false;
  }
}
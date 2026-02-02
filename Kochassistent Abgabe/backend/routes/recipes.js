import express from 'express';
import { getAllMealDBRecipes, getMealDBRecipeById } from '../services/mealdb.service.js';
import { scrapeRecipeFromUrl } from '../services/scraper.service.js';
import { readRecipes, saveRecipe } from '../data/storage.js';

const router = express.Router();

// GET alle Rezepte (MealDB + gespeicherte)
router.get('/', async (req, res) => {
  try {
    const mealDBRecipes = await getAllMealDBRecipes();
    const savedRecipes = readRecipes();
    
    const allRecipes = [...mealDBRecipes, ...savedRecipes];
    res.json(allRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET einzelnes Rezept by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mealDBRecipe = await getMealDBRecipeById(id);
    if (mealDBRecipe) {
      return res.json(mealDBRecipe);
    }
    
    const savedRecipes = readRecipes();
    const savedRecipe = savedRecipes.find(r => r.id === id);
    
    if (savedRecipe) {
      return res.json(savedRecipe);
    }
    
    res.status(404).json({ error: 'Recipe not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST Rezept von URL importieren
router.post('/import', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const recipe = await scrapeRecipeFromUrl(url);
    const savedRecipe = saveRecipe(recipe);
    
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

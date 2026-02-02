import axios from 'axios';
import { parseInstructionsToSteps } from '../utils/stepParser.js';

const MEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1';

// Holt mehrere zufällige Rezepte von MealDB
export async function getAllMealDBRecipes() {
  try {
    // Hole 10 zufällige Rezepte
    const promises = Array(10).fill().map(() => 
      axios.get(`${MEALDB_API_URL}/random.php`)
    );
    
    const responses = await Promise.all(promises);
    const recipes = responses.map(res => formatMealDBRecipe(res.data.meals[0]));
    
    return recipes;
  } catch (error) {
    console.error('Error fetching MealDB recipes:', error);
    return [];
  }
}

// Holt einzelnes Rezept by ID
export async function getMealDBRecipeById(id) {
  try {
    const response = await axios.get(`${MEALDB_API_URL}/lookup.php?i=${id}`);
    
    if (response.data.meals) {
      return formatMealDBRecipe(response.data.meals[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching MealDB recipe:', error);
    return null;
  }
}

// Formatiert MealDB Rezept in unser Format
function formatMealDBRecipe(meal) {
  const ingredients = [];
  
  // MealDB hat Ingredients als strIngredient1, strIngredient2, etc.
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient,
        amount: measure || ''
      });
    }
  }
  
  const steps = parseInstructionsToSteps(meal.strInstructions);
  
  return {
    id: meal.idMeal,
    source: 'mealdb',
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
    ingredients,
    instructions: meal.strInstructions,
    steps,
    tags: meal.strTags ? meal.strTags.split(',') : [],
    video: meal.strYoutube || null
  };
}
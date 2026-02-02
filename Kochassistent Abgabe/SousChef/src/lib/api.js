const API_BASE_URL = 'http://localhost:3000/api';

export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes`);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
}

export async function fetchRecipeById(id) {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
  if (!response.ok) throw new Error('Failed to fetch recipe');
  return response.json();
}

export async function importRecipe(url) {
  const response = await fetch(`${API_BASE_URL}/recipes/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (!response.ok) throw new Error('Failed to import recipe');
  return response.json();
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
let allRecipesCache = null;
let isLoadingAll = false;

export async function fetchAllRecipes() {
  if (allRecipesCache) return allRecipesCache;
  if (isLoadingAll) {
    // Warte bis das Laden fertig ist
    while (isLoadingAll) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return allRecipesCache;
  }

  isLoadingAll = true;
  const allRecipes = [];
  
  // Lade 3 Buchstaben gleichzeitig für bessere Performance
  for (let i = 0; i < LETTERS.length; i += 3) {
    const batch = LETTERS.slice(i, i + 3);
    const promises = batch.map(async (letter) => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json();
        if (data.meals) {
          return data.meals.map(meal => ({
            id: meal.idMeal,
            title: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            area: meal.strArea
          }));
        }
        return [];
      } catch (error) {
        console.error(`Error fetching recipes for letter ${letter}:`, error);
        return [];
      }
    });
    
    const results = await Promise.all(promises);
    results.forEach(recipes => allRecipes.push(...recipes));
  }
  
  allRecipesCache = allRecipes;
  isLoadingAll = false;
  console.log(`✅ Loaded ${allRecipes.length} recipes from TheMealDB`);
  return allRecipes;
}

export async function fetchRecipesBatch(start, limit) {
  const allRecipes = await fetchAllRecipes();
  return allRecipes.slice(start, start + limit);
}

export async function getTotalRecipesCount() {
  const allRecipes = await fetchAllRecipes();
  return allRecipes.length;
}
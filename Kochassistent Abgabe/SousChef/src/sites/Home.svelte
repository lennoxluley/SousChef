<script>
  import { onMount, onDestroy } from 'svelte';
  import TopBar from '../components/TopBar.svelte';
  import SearchBar from '../components/SearchBar.svelte';
  import RecipeCard from '../components/RecipeCard.svelte';
  import { recipes } from '../lib/stores.js';
  import { currentStep } from '../lib/stores.js';

  let loading = false;
  let showSearch = false;
  let searchQuery = '';
  let activeTag = null;
  let filteredRecipes = [];
  let currentLetter = 'a';
  let hasMore = true;
  let searchLoading = false; // HINZUGEFÜGT

  const categoryOrder = {
    'Starter': 1,
    'Side': 2,
    'Vegetarian': 3,
    'Chicken': 4,
    'Beef': 5,
    'Pork': 6,
    'Lamb': 7,
    'Seafood': 8,
    'Pasta': 9,
    'Dessert': 10
  };

  function sortRecipes(recipeList) {
    return recipeList.sort((a, b) => {
      const categoryA = categoryOrder[a.category] || 999;
      const categoryB = categoryOrder[b.category] || 999;
      
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }
      
      return a.title.localeCompare(b.title);
    });
  }

  function handleToggleSearch() {
    showSearch = !showSearch;
    if (!showSearch) {
      searchQuery = '';
      activeTag = null;
      // Zurück zu geladenen Rezepten
      filteredRecipes = sortRecipes([...$recipes]);
    }
  }

  // GEÄNDERT: Async API-Suche
  async function handleSearch(event) {
    searchQuery = event.detail;
    console.log('Search query updated:', searchQuery);
    await performSearch();
  }

  // GEÄNDERT: Async API-Suche
  async function handleTagFilter(event) {
    activeTag = event.detail;
    console.log('Active tag:', activeTag);
    await performSearch();
  }

  // HINZUGEFÜGT: API-Suche über gesamte Datenbank
  async function performSearch() {
    // Keine Filter → Zeige geladene Rezepte
    if (!searchQuery && !activeTag) {
      filteredRecipes = sortRecipes([...$recipes]);
      return;
    }

    searchLoading = true;

    try {
      let results = [];

      // Suche nach Name
      if (searchQuery.trim() !== '') {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (data.meals) {
          results = data.meals.map(meal => ({
            id: meal.idMeal,
            title: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            image: meal.strMealThumb,
            ingredients: extractIngredients(meal),
            steps: meal.strInstructions ? meal.strInstructions.split('\n').filter(s => s.trim()) : []
          }));
        }
      }

      // Suche nach Category (Tag)
      if (activeTag) {
        const categoryResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(activeTag)}`);
        const categoryData = await categoryResponse.json();
        
        if (categoryData.meals) {
          // Bei Category-Filter müssen wir Details einzeln laden
          const categoryResults = await Promise.all(
            categoryData.meals.slice(0, 50).map(async (meal) => {
              try {
                const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
                const detailData = await detailResponse.json();
                
                if (detailData.meals && detailData.meals[0]) {
                  const fullMeal = detailData.meals[0];
                  return {
                    id: fullMeal.idMeal,
                    title: fullMeal.strMeal,
                    category: fullMeal.strCategory,
                    area: fullMeal.strArea,
                    image: fullMeal.strMealThumb,
                    ingredients: extractIngredients(fullMeal),
                    steps: fullMeal.strInstructions ? fullMeal.strInstructions.split('\n').filter(s => s.trim()) : []
                  };
                }
              } catch (error) {
                console.error('Error loading meal details:', error);
                return null;
              }
            })
          );
          
          // Kombiniere Ergebnisse
          if (searchQuery.trim() !== '') {
            // Filter Category-Results nach Suchtext
            results = categoryResults.filter(meal => 
              meal && meal.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
          } else {
            results = categoryResults.filter(meal => meal !== null);
          }
        }
      }

      filteredRecipes = sortRecipes(results);
      console.log('Search results:', filteredRecipes.length);

    } catch (error) {
      console.error('Search error:', error);
      filteredRecipes = [];
    } finally {
      searchLoading = false;
    }
  }

  async function loadMoreRecipes() {
    if (loading || !hasMore) return;
    
    loading = true;
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${currentLetter}`);
      const data = await response.json();
      
      if (data.meals && data.meals.length > 0) {
        const newRecipes = data.meals.map(meal => ({
          id: meal.idMeal,
          title: meal.strMeal,
          category: meal.strCategory,
          area: meal.strArea,
          image: meal.strMealThumb,
          ingredients: extractIngredients(meal),
          steps: meal.strInstructions ? meal.strInstructions.split('\n').filter(s => s.trim()) : []
        }));
        
        const allRecipes = [...$recipes, ...newRecipes];
        recipes.set(sortRecipes(allRecipes));
        
        // Update filteredRecipes nur wenn keine aktive Suche
        if (!searchQuery && !activeTag) {
          filteredRecipes = sortRecipes(allRecipes);
        }
        
        if (currentLetter === 'z') {
          hasMore = false;
        } else {
          currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
        }
      } else {
        if (currentLetter === 'z') {
          hasMore = false;
        } else {
          currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
          loading = false;
          await loadMoreRecipes();
          return;
        }
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      hasMore = false;
    } finally {
      loading = false;
    }
  }

  function extractIngredients(meal) {
    const ingredients = [];
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
    return ingredients;
  }

  function handleScroll() {
    // Nur auto-load wenn keine aktive Suche
    if (searchQuery || activeTag) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMoreRecipes();
    }
  }

  onMount(async () => {
    currentStep.set(0);
    
    if ($recipes.length === 0) {
      await loadMoreRecipes();
    } else {
      filteredRecipes = sortRecipes([...$recipes]);
    }
    window.addEventListener('scroll', handleScroll);
  });

  onDestroy(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<div class="app-container">
  <TopBar showSearch={true} on:toggleSearch={handleToggleSearch} />
  
  {#if showSearch}
    <SearchBar {searchQuery} on:search={handleSearch} on:tagFilter={handleTagFilter} />
  {/if}

  <div class="content">
    {#each filteredRecipes as recipe (recipe.id)}
      <RecipeCard {recipe} />
    {/each}
    
    {#if searchLoading}
      <p class="loading">Suche in der Datenbank...</p>
    {:else if loading}
      <p class="loading">Lade weitere Rezepte...</p>
    {/if}
    
    {#if !searchLoading && !loading && filteredRecipes.length === 0 && (searchQuery || activeTag)}
      <div class="no-results">
        <p class="end-message">Keine Rezepte gefunden</p>
        <button class="reload-btn" on:click={performSearch}>
          <img src="/src/assets/Reload.svg" alt="Reload" class="reload-icon" />
          Erneut suchen
        </button>
      </div>
    {/if}
    
    {#if !hasMore && $recipes.length > 0 && !searchQuery && !activeTag}
      <p class="end-message">Keine weiteren Rezepte verfügbar</p>
    {/if}
  </div>
</div>

<style>
  .app-container {
    background-color: white;
    width: 390px;
    min-width: 390px;
    max-width: 390px;
  }

  .content {
    padding: 72px 20px 20px 20px;
    width: 390px;
    box-sizing: border-box;
  }

  .loading {
    text-align: center;
    color: #999;
    padding: 20px;
    font-size: 14px;
  }

  .end-message {
    text-align: center;
    color: #999;
    padding: 20px;
    font-size: 14px;
    margin: 0;
  }

  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .reload-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: #ff7e34;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;
    outline: none;
  }

  .reload-btn:hover {
    opacity: 0.9;
  }

  .reload-btn:active {
    transform: scale(0.95);
  }

  .reload-icon {
    width: 20px;
    height: 20px;
  }

  /* DESKTOP BREAKPOINT - GRID MIT 3 SPALTEN */
  @media (min-width: 1024px) {
    .app-container {
      width: 100vw;
      min-width: 100vw;
      max-width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    .content {
      width: 1452px;
      max-width: 1452px;
      margin: 0;
      padding: 92px 0 20px 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .loading,
    .end-message,
    .no-results {
      grid-column: 1 / -1;
    }
  }
</style>
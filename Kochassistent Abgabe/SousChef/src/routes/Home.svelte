<script>
  import { onMount } from 'svelte';
  import TopBar from '../components/TopBar.svelte';
  import SearchBar from '../components/SearchBar.svelte';
  import RecipeCard from '../components/RecipeCard.svelte';
  import { recipes } from '../lib/stores.js';
  import { fetchRecipesBatch, getTotalRecipesCount } from '../lib/api.js';

  let loading = true;
  let loadingMore = false;
  let showSearch = false;
  let searchQuery = '';
  let filteredRecipes = [];
  let currentIndex = 0;
  let totalCount = 0;
  const BATCH_SIZE = 20;

  $: filteredRecipes = searchQuery === '' 
    ? $recipes 
    : $recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.category && recipe.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (recipe.area && recipe.area.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  function handleToggleSearch() {
    showSearch = !showSearch;
    if (!showSearch) {
      searchQuery = '';
    }
  }

  function handleSearch(event) {
    searchQuery = event.detail;
  }

  async function loadMoreRecipes() {
    if (loadingMore || currentIndex >= totalCount) return;
    
    loadingMore = true;
    try {
      const newRecipes = await fetchRecipesBatch(currentIndex, BATCH_SIZE);
      recipes.update(current => [...current, ...newRecipes]);
      currentIndex += newRecipes.length;
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      loadingMore = false;
    }
  }

  function handleScroll() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    
    if (scrolled >= scrollableHeight - 300 && !loadingMore && currentIndex < totalCount) {
      loadMoreRecipes();
    }
  }

  onMount(() => {
    const initialize = async () => {
      try {
        totalCount = await getTotalRecipesCount();
        const initialRecipes = await fetchRecipesBatch(0, BATCH_SIZE);
        recipes.set(initialRecipes);
        currentIndex = BATCH_SIZE;
        
        window.addEventListener('scroll', handleScroll);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        loading = false;
      }
    };

    initialize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<div class="app-container">
  <TopBar showSearch={true} on:toggleSearch={handleToggleSearch} />
  
  {#if showSearch}
    <SearchBar {searchQuery} on:search={handleSearch} />
  {/if}

  <div class="content">
    {#if loading}
      <p class="loading">Loading recipes...</p>
    {:else}
      {#each filteredRecipes as recipe (recipe.id)}
        <RecipeCard {recipe} />
      {/each}
      
      {#if loadingMore}
        <p class="loading-more">Loading more recipes...</p>
      {/if}
      
      {#if currentIndex >= totalCount && !searchQuery}
        <p class="end-message">All recipes loaded!</p>
      {/if}
    {/if}
  </div>
</div>

<style>
  .content {
    padding: 0 20px 20px 20px;
  }

  .loading {
    text-align: center;
    color: #999;
    padding: 40px 20px;
  }

  .loading-more {
    text-align: center;
    color: #999;
    padding: 20px;
    font-size: 14px;
  }

  .end-message {
    text-align: center;
    color: #FF6B6B;
    padding: 20px;
    font-weight: 600;
  }
</style>
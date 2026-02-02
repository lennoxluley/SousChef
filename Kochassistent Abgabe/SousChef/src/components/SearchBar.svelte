<script>
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte'; // HINZUGEFÜGT
  
  export let searchQuery = '';
  
  const dispatch = createEventDispatcher();
  
  const tags = [
    { id: 'Starter', color: '#FF6B6B' },
    { id: 'Side', color: '#4ECDC4' },
    { id: 'Vegetarian', color: '#95E1D3' },
    { id: 'Chicken', color: '#FFD93D' },
    { id: 'Beef', color: '#E15634' },
    { id: 'Pork', color: '#F08A5D' },
    { id: 'Lamb', color: '#B83B5E' },
    { id: 'Seafood', color: '#6A2C70' },
    { id: 'Pasta', color: '#F9CA24' },
    { id: 'Dessert', color: '#F38181' }
  ];
  
  let activeTag = null;
  let tagsEnabled = false;
  let searchInput; // HINZUGEFÜGT - Referenz zum Input
  
  function handleInput(event) {
    const value = event.target.value;
    searchQuery = value;
    console.log('SearchBar input:', value);
    dispatch('search', value);
  }
  
  function clearSearch() {
    searchQuery = '';
    dispatch('search', '');
  }

  function toggleTag(tagId) {
    const clickedTag = tags.find(t => t.id === tagId);
    
    if (activeTag?.id === tagId) {
      activeTag = null;
      tagsEnabled = false;
      dispatch('tagFilter', null);
    } else {
      activeTag = clickedTag;
      tagsEnabled = true;
      dispatch('tagFilter', tagId);
    }
  }

  function removeActiveTag() {
    activeTag = null;
    tagsEnabled = false;
    dispatch('tagFilter', null);
  }

  // HINZUGEFÜGT - Auto-Focus beim Mount
  onMount(() => {
    if (searchInput) {
      searchInput.focus();
    }
  });
</script>

<div class="search-bar">
  <div class="search-input-wrapper">
    <img src="/src/assets/Search.svg" alt="Search" class="search-icon" />
    
    {#if activeTag}
      <span class="active-tag-pill" style="background-color: {activeTag.color};">
        {activeTag.id}
        <button class="remove-tag-btn" on:click={removeActiveTag}>×</button>
      </span>
    {/if}
    
    <input 
      bind:this={searchInput}
      type="text" 
      placeholder="Rezepte suchen..." 
      bind:value={searchQuery}
      on:input={handleInput}
    />
    {#if searchQuery}
      <button class="clear-btn" on:click={clearSearch}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    {/if}
  </div>

  <div class="tags-row">
    <img 
      src={activeTag ? "/src/assets/Tags on.svg" : "/src/assets/Tags off.svg"} 
      alt="Tags" 
      class="tags-icon" 
    />
    
    <div class="tags-scroll">
      {#each tags as tag}
        <button
          class="tag-circle"
          class:active={activeTag?.id === tag.id}
          style="background-color: {tag.color};"
          on:click={() => toggleTag(tag.id)}
        >
          {tag.id}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .search-bar {
    position: sticky;
    top: 72px;
    padding: 15px 20px 15px 20px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    animation: slideDown 0.3s ease-out;
    z-index: 99;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 0 12px;
    margin-bottom: 12px;
    gap: 8px;
  }
  
  .search-icon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .active-tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .remove-tag-btn {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
  }

  .remove-tag-btn:hover {
    opacity: 0.8;
  }
  
  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 12px 8px;
    font-size: 16px;
    outline: none;
    color: #333;
  }
  
  input::placeholder {
    color: #999;
  }
  
  .clear-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .clear-btn:active {
    opacity: 0.6;
  }

  .tags-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding-left: 12px;
  }

  .tags-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .tags-scroll {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
    max-width: calc(100% - 30px - 12px);
  }

  .tag-circle {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    border: none;
    font-size: 12px;
    font-weight: 600;
    color: white;
    white-space: nowrap;
    cursor: pointer;
    flex-shrink: 0;
    outline: none;
    transition: opacity 0.2s;
  }

  .tag-circle:active {
    opacity: 0.8;
  }

  .tag-circle.active {
    box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor;
  }

  /* DESKTOP BREAKPOINT - ZENTRIERT SEARCHBAR CONTENT */
  @media (min-width: 1024px) {
    .search-bar {
      width: 100%;
    }

    .search-input-wrapper,
    .tags-row {
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 40px;
      padding-right: 40px;
    }

    .tags-row {
      padding-left: 52px;
    }
  }
</style>
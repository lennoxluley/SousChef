<script>
    import { push } from 'svelte-spa-router';
    
    export let recipe;
  
    function handleClick() {
      push(`/recipe/${recipe.id}`);
    }

    // Farben für verschiedene Kategorien
    const categoryColors = {
      'Starter': '#FF6B6B',
      'Side': '#4ECDC4',
      'Vegetarian': '#95E1D3',
      'Chicken': '#FFD93D',
      'Beef': '#E15634',
      'Pork': '#F08A5D',
      'Lamb': '#B83B5E',
      'Seafood': '#6A2C70',
      'Pasta': '#F9CA24',
      'Dessert': '#F38181'
    };

    function getCategoryColor(category) {
      return categoryColors[category] || '#999999';
    }
  </script>
  
  <div class="recipe-card" on:click={handleClick}>
    <img src={recipe.image} alt={recipe.title} />
    <div class="overlay">
      {#if recipe.category || recipe.area}
        <span 
          class="category-tag" 
          style="background-color: {getCategoryColor(recipe.category)};"
        >
          {recipe.category || recipe.area}
        </span>
      {/if}
      <h3>{recipe.title}</h3>
    </div>
  </div>
  
  <style>
    .recipe-card {
      width: 100%;
      max-width: 350px;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      margin-top: 20px;
      transition: transform 0.2s;
      box-sizing: border-box;
    }
  
    .recipe-card:active {
      transform: scale(0.98);
    }
  
    img {
      width: 100%;
      aspect-ratio: 15 / 5;
      object-fit: cover;
      display: block;
    }
  
    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
      padding: 16px;
      color: white;
      text-align: left;
    }
  
    h3 {
      margin: 8px 0 0 0;
      font-size: 18px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 30px;
    }
  
    .category {
      margin: 4px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .category-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: white;
    }

    /* DESKTOP BREAKPOINT - PASST SICH GRID AN + HOVER EFFEKT */
    @media (min-width: 1024px) {
      .recipe-card {
        max-width: 100%;
        margin-top: 0;
      }

      .recipe-card:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 1;
      }

      .recipe-card:active {
        transform: scale(1.02);
      }
    }
  </style>
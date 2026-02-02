<script>
  import { onMount } from 'svelte';
  import { push, pop } from 'svelte-spa-router';
  import TopBar from '../components/TopBar.svelte';
  import IngredientsList from '../components/IngredientsList.svelte';
  import InstructionsList from '../components/InstructionsList.svelte';
  import { currentRecipe } from '../lib/stores.js';
  import { fetchRecipeById } from '../lib/api.js';

  export let params = {};

  let recipe = null;
  let loading = true;

  onMount(async () => {
    try {
      recipe = await fetchRecipeById(params.id);
      currentRecipe.set(recipe);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      loading = false;
    }
  });

  function startCooking() {
    push(`/cook/${params.id}`);
  }
</script>

<div class="app-container">
  <TopBar showBack={true} showEdit={true} onBack={() => pop()} />

  {#if loading}
    <p class="loading">Loading...</p>
  {:else if recipe}
    <img src={recipe.image} alt={recipe.title} class="hero-image" />

    <div class="title-pill">
      <h1>{recipe.title}</h1>
    </div>

    <IngredientsList ingredients={recipe.ingredients} />

    <button class="start-btn" on:click={startCooking}>
      <svg class="play-icon" viewBox="0 0 24 24" fill="white">
        <path d="M8 5v14l11-7z" stroke="white" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round"/>
      </svg>
    </button>

    <InstructionsList steps={recipe.steps} />
  {/if}
</div>

<style>
  .app-container {
    width: 390px;
    min-width: 390px;
    max-width: 390px;
    background-color: white;
    padding-top: 72px;
  }

  .recipe-detail {
    padding: 16px;
  }

  .loading {
    text-align: center;
    padding: 40px 20px;
    color: #999;
  }

  .hero-image {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .title-pill {
    background-color: #ff7e34;
    border-radius: 16px;
    padding: 16px 24px;
    margin: 20px 20px 16px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: white;
  }

  .start-btn {
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    margin-left: 145px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #ff7e34;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 5px #ff7e34;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    outline: none;
  }

  .play-icon {
    width: 36px;
    height: 36px;
    pointer-events: none;
  }

  @media (max-width: 400px) {
    .start-btn {
      right: 32px;
    }
  }

  @media (min-width: 1024px) {
    .app-container {
      width: 100vw;
      min-width: 100vw;
      max-width: 100vw;
    }

    .hero-image {
      height: 300px;
      aspect-ratio: auto;
    }

    .title-pill {
      max-width: 1470px;
      margin: 20px auto 16px auto;
      text-align: left;
    }

    h1 {
      text-align: left;
      font-size: 24px;
      font-weight: 800;
    }

    .start-btn {
      left: auto;
      right: 100px;
      bottom: 40px;
      transform: none;
      scale: 1.5;
      margin-left: 0;
    }
  }
</style>
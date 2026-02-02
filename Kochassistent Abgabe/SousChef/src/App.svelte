<script>
  import Router from 'svelte-spa-router';
  import Home from './sites/Home.svelte';
  import RecipeDetail from './sites/RecipeDetail.svelte';
  import CookingMode from './sites/CookingMode.svelte';

  const routes = {
    '/': Home,
    '/recipe/:id': RecipeDetail,
    '/cook/:id': CookingMode,
  };
</script>

<main>
  <Router {routes} />
</main>

<style>
  :global(html) {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: white;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background-color: white;
    color: #333;
    height: 100%;
    overflow-x: hidden;
  }

  :global(*) {
    box-sizing: border-box;
  }

  main {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: white;
  }

  :global(.app-container) {
    width: 390px;
    min-width: 390px;
    max-width: 390px;
    min-height: 100vh;
    background-color: white;
    margin: 0;
  }

  @media (max-width: 390px) {
    :global(.app-container) {
      width: 100%;
      min-width: 100%;
    }
  }

  @media (min-width: 1024px) {
    :global(.app-container) {
      width: 100vw;
      min-width: 100vw;
      max-width: 100vw;
    }
  }
</style>

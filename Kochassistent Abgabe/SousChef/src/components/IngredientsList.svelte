<script>
  export let ingredients = [];
</script>

<div class="card">
  <h1>Ingredients</h1>
  <div class="ingredients-grid">
    {#each ingredients as ingredient}
      <div class="amount">{ingredient.amount}</div>
      <div class="name">{ingredient.name}</div>
    {/each}
  </div>
</div>

<style>
  .card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin: 16px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  h1 {
    margin: 0 0 16px 0;
    font-size: 20px;
    font-weight: 800;
    color: #333;
  }

  .ingredients-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px 16px;
    align-items: baseline;
  }

  .amount {
    color: #666;
    font-weight: 600;
    text-align: right;
  }

  .name {
    color: #333;
    text-align: left;
  }

  /* DESKTOP BREAKPOINT - BREITER WIE INSTRUCTIONS */
  @media (min-width: 1024px) {
    .card {
      max-width: 1470px;
      margin: 16px auto;
      padding: 40px;
    }

    h1 {
      text-align: left;
    }
  }
</style>

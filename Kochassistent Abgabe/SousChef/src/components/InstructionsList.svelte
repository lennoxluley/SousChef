<script>
  export let steps = [];
</script>

<div class="instructions-container">
  <h1>Instructions</h1>
  <div class="steps-list">
    {#each steps as step, index}
      <div class="step">
        <span class="step-number">{index + 1}.</span>
        <p class="step-text">{step}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .instructions-container {
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

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .step {
    display: flex;
    gap: 12px;
    text-align: left;
  }

  .step-number {
    font-weight: 700;
    color: #ff7e34;
    flex-shrink: 0;
  }

  .step-text {
    margin: 0;
    line-height: 1.6;
    color: #333;
    text-align: left;
  }

  /* DESKTOP BREAKPOINT - LINKSBÜNDIGE ÜBERSCHRIFT */
  @media (min-width: 1024px) {
    .instructions-container {
      max-width: 1470px;
      margin: 16px auto;
      padding: 40px;
    }

    h1 {
      text-align: left;
    }
  }
</style>

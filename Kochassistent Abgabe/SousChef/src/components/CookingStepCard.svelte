<script>
  export let stepText = '';
  export let currentStep = 1;
  export let totalSteps = 1;
</script>

<div class="step-card">
  <div class="step-header">
    <span class="step-counter">Step {currentStep} / {totalSteps}</span>
  </div>
  <div class="step-content">
    <p class="step-text">{stepText}</p>
  </div>
</div>

<style>
  .step-card {
    width: 100%;
    max-width: 400px;
    min-width: 100%;
    box-sizing: border-box;
    margin: 20px auto;
    padding: 24px;
    background-color: #f5f5f5;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .step-header {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .step-counter {
    font-size: 14px;
    font-weight: 600;
    color: #ff7e34;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .step-content {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .step-text {
    font-size: 18px;
    line-height: 1.6;
    color: #333;
    margin: 0;
    text-align: left;
    width: 100%;
  }
</style>
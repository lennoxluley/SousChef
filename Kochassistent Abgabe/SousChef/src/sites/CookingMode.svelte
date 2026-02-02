<script>
  import { onMount, onDestroy } from 'svelte';
  import { pop, push } from 'svelte-spa-router';
  import TopBar from '../components/TopBar.svelte';
  import CookingStepCard from '../components/CookingStepCard.svelte';
  import { currentRecipe, currentStep } from '../lib/stores.js';
  import { fetchRecipeById } from '../lib/api.js';

  export let params = {};

  let recipe = null;
  let step = 0;
  let showCompletion = false;
  let voiceEnabled = false; // HINZUGEFÜGT

  onMount(async () => {
    if (!$currentRecipe || $currentRecipe.id !== params.id) {
      recipe = await fetchRecipeById(params.id);
      currentRecipe.set(recipe);
    } else {
      recipe = $currentRecipe;
    }
    step = $currentStep;
  });

  onDestroy(() => {
    // HINZUGEFÜGT: Cleanup - Stoppe Sprachausgabe beim Verlassen
    stopSpeech();
  });

  function nextStep() {
    if (step === recipe.steps.length - 1) {
      showCompletion = true;
      stopSpeech(); // HINZUGEFÜGT
    } else if (step < recipe.steps.length - 1) {
      step++;
      currentStep.set(step);
      speakCurrentStep(); // HINZUGEFÜGT
    }
  }

  function prevStep() {
    if (showCompletion) {
      showCompletion = false;
      speakCurrentStep(); // HINZUGEFÜGT
    } else if (step > 0) {
      step--;
      currentStep.set(step);
      speakCurrentStep(); // HINZUGEFÜGT
    }
  }

  function completeRecipe() {
    stopSpeech(); // HINZUGEFÜGT
    push('/');
  }

  function cleanStepText(text) {
    return text.replace(/^STEP\s+\d+[:\.\s]*/i, '').trim();
  }

  // HINZUGEFÜGT: Audio Toggle Handler
  function handleAudioToggle() {
    voiceEnabled = !voiceEnabled;
    
    if (voiceEnabled && !showCompletion) {
      // Voice aktiviert → aktuellen Step vorlesen
      speakCurrentStep();
    } else {
      // Voice deaktiviert → Sprachausgabe stoppen
      stopSpeech();
    }
  }

  // HINZUGEFÜGT: Sprachausgabe stoppen
  function stopSpeech() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // HINZUGEFÜGT: Aktuellen Step vorlesen
  function speakCurrentStep() {
    // Nur vorlesen wenn Voice aktiviert, Rezept geladen und nicht Completion Screen
    if (!voiceEnabled || !recipe || showCompletion) {
      return;
    }
    
    // Stoppe vorherige Sprachausgabe
    stopSpeech();
    
    // Prüfe ob Web Speech API verfügbar ist
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Web Speech API nicht verfügbar');
      return;
    }
    
    // Step-Text vorbereiten
    const stepText = cleanStepText(recipe.steps[step]);
    
    if (!stepText || stepText.trim().length === 0) {
      return;
    }
    
    // SpeechSynthesisUtterance erstellen
    const utterance = new SpeechSynthesisUtterance(stepText);
    
    // Parameter setzen
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Error Handler
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };
    
    // Vorlesen starten
    window.speechSynthesis.speak(utterance);
  }
</script>

<div class="app-container cooking-mode">
  <TopBar showBack={true} showAudio={true} onBack={() => pop()} onAudio={handleAudioToggle} />

  {#if recipe}
    <div class="step-container">
      {#if showCompletion}
        <div class="completion-screen">
          <div class="emoji">🥘</div>
          <h2>Guten Appetit!</h2>
        </div>
      {:else}
        <!-- MOBILE: Nur aktueller Step -->
        <div class="mobile-view">
          <CookingStepCard 
            stepText={cleanStepText(recipe.steps[step])} 
            currentStep={step + 1} 
            totalSteps={recipe.steps.length} 
          />
        </div>

        <!-- DESKTOP: Previous, Current, Next -->
        <div class="desktop-view">
          <!-- Previous Step (links) -->
          <div class="step-slot previous-slot">
            {#if step > 0}
              <CookingStepCard 
                stepText={cleanStepText(recipe.steps[step - 1])} 
                currentStep={step} 
                totalSteps={recipe.steps.length} 
              />
            {/if}
          </div>

          <!-- Current Step (mitte) -->
          <div class="step-slot current-slot">
            <CookingStepCard 
              stepText={cleanStepText(recipe.steps[step])} 
              currentStep={step + 1} 
              totalSteps={recipe.steps.length} 
            />
          </div>

          <!-- Next Step (rechts) -->
          <div class="step-slot next-slot">
            {#if step < recipe.steps.length - 1}
              <CookingStepCard 
                stepText={cleanStepText(recipe.steps[step + 1])} 
                currentStep={step + 2} 
                totalSteps={recipe.steps.length} 
              />
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <div class="navigation">
      <button class="nav-btn" on:click={prevStep} disabled={step === 0 && !showCompletion}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <button class="nav-btn" on:click={showCompletion ? completeRecipe : nextStep} disabled={false}>
        {#if showCompletion}
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {:else}
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
  .app-container {
    width: 390px;
    min-width: 390px;
    max-width: 390px;
    background-color: white;
  }

  .cooking-mode {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 390px;
    min-width: 390px;
    padding-top: 92px;
  }

  .step-container {
    padding: 0 20px;
  }

  .mobile-view {
    display: block;
  }

  .desktop-view {
    display: none;
  }

  .completion-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
  }

  .emoji {
    font-size: 120px;
    margin-bottom: 24px;
  }

  .completion-screen h2 {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }

  .navigation {
    position: fixed;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 40px;
    max-width: 390px;
    width: 100%;
  }

  .nav-btn {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    background-color: #e0e0e0;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    outline: none;
  }

  .nav-icon {
    width: 64px;
    height: 64px;
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .nav-btn:disabled .nav-icon path {
    stroke: #999;
  }

  .nav-btn:not(:disabled):active {
    transform: scale(0.95);
  }

  @media (max-width: 400px) {
    .app-container {
      max-width: 100%;
    }
  }

  /* DESKTOP BREAKPOINT - 3 STEPS NEBENEINANDER */
  @media (min-width: 1024px) {
    .app-container {
      width: 100vw;
      min-width: 100vw;
      max-width: 100vw;
    }

    .cooking-mode {
      width: 100%;
      min-width: 100%;
    }

    .step-container {
      max-width: 100%;
      padding: 0 40px;
    }

    .mobile-view {
      display: none;
    }

    .desktop-view {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 40px;
      min-height: 60vh;
    }

    .step-slot {
      flex: 0 0 400px;
      transition: all 0.3s ease;
    }

    .previous-slot,
    .next-slot {
      opacity: 0.5;
      transform: scale(0.9);
    }

    .current-slot {
      flex: 0 0 500px;
      opacity: 1;
      transform: scale(1);
    }

    .previous-slot:empty,
    .next-slot:empty {
      flex: 0 0 400px;
    }
  }
</style>
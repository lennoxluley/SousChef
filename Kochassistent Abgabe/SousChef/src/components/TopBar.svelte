<script>
    import { createEventDispatcher } from 'svelte';

    export let showBack = false;
    export let showEdit = false;
    export let showSearch = false;
    export let showAudio = false;
    export let title = 'SousChef';
    export let onBack = null;
    export let onEdit = null;
    export let onAudio = null;

    const dispatch = createEventDispatcher();

    let audioEnabled = false;

    function toggleSearch() {
        dispatch('toggleSearch');
    }

    function toggleAudio() {
        audioEnabled = !audioEnabled;
        if (onAudio) {
            onAudio();
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
</script>
  
<div class="top-bar">
    <div class="left-center-wrapper" on:click={scrollToTop}>
      <div class="left">
        {#if showBack}
          <button class="icon-btn" on:click={onBack}>←</button>
        {:else}
          <div class="app-icon">🥘</div>
        {/if}
      </div>
    
      <div class="center">
        {#if !showBack}
          <span class="app-title">{title}</span>
        {/if}
      </div>
    </div>
  
    <div class="right">
      {#if showEdit}
        <button class="icon-btn" on:click={onEdit}>
          <img src="/src/assets/Edit.svg" alt="Edit" class="icon-svg" />
        </button>
      {:else if showAudio}
        <button class="icon-btn" on:click={toggleAudio}>
          <img 
            src={audioEnabled ? "/src/assets/Volume on.svg" : "/src/assets/Volume off.svg"} 
            alt={audioEnabled ? "Volume on" : "Volume off"} 
            class="icon-svg" 
          />
        </button>
      {/if}
      {#if showSearch}
        <button class="search-toggle" on:click={toggleSearch}>
          <img src="/src/assets/Search.svg" alt="Search" class="icon-svg" />
        </button>
      {/if}
    </div>
</div>
  
<style>
    .top-bar {
      height: 72px;
      width: 390px;
      min-width: 390px;
      max-width: 390px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background-color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      box-sizing: border-box;
    }

    .left-center-wrapper {
      display: flex;
      align-items: center;
      flex: 1;
      cursor: pointer;
    }
  
    .left, .right {
      width: 40px;
      display: flex;
      align-items: center;
    }
  
    .right {
      width: 40px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  
    .center {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      margin-left: 12px;
    }
  
    .app-icon {
      width: 40px;
      height: 40px;
      background-color: #ff7e34;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
    }
  
    .app-title {
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }
  
    .icon-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 8px;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      transition: filter 0.2s;
    }
  
    .icon-btn:active {
      filter: brightness(1.2);
    }

    .search-toggle {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      outline: none;
      transition: filter 0.2s;
    }

    .search-toggle:active {
      filter: brightness(1.2);
    }

    .icon-svg {
      width: 24px;
      height: 24px;
    }

    /* DESKTOP BREAKPOINT - MACHT TOPBAR BREITER */
    @media (min-width: 1024px) {
      .top-bar {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
      }
    }
</style>
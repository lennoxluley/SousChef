import { writable } from 'svelte/store';

// Persistenter Store für Rezepte
export const recipes = writable([]);

export const currentRecipe = writable(null);

export const currentStep = writable(0);
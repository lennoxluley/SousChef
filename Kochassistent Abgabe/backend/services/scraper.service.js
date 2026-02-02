import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseInstructionsToSteps } from '../utils/stepParser.js';
import crypto from 'crypto';

export async function scrapeRecipeFromUrl(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Versuche verschiedene Selektoren (funktioniert für viele Rezept-Seiten)
    const title = $('h1').first().text().trim() || 
                  $('[itemprop="name"]').first().text().trim() ||
                  $('title').text().trim();
    
    const image = $('img[itemprop="image"]').attr('src') ||
                  $('meta[property="og:image"]').attr('content') ||
                  $('img').first().attr('src');
    
    // Zutaten finden
    const ingredients = [];
    $('[itemprop="recipeIngredient"], .ingredients li, .ingredient').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text) {
        ingredients.push({ name: text, amount: '' });
      }
    });
    
    // Anleitung finden
    let instructions = '';
    const instructionsElem = $('[itemprop="recipeInstructions"]');
    if (instructionsElem.length) {
      instructions = instructionsElem.text().trim();
    } else {
      $('.instructions, .directions, .steps').each((i, elem) => {
        instructions += $(elem).text().trim() + '\n';
      });
    }
    
    const steps = parseInstructionsToSteps(instructions);
    
    return {
      id: crypto.randomUUID(),
      source: 'imported',
      sourceUrl: url,
      title: title || 'Imported Recipe',
      image: image || null,
      ingredients: ingredients.length ? ingredients : [{ name: 'No ingredients found', amount: '' }],
      instructions: instructions || 'No instructions found',
      steps: steps.length ? steps : ['No steps found'],
      tags: [],
      importedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to scrape recipe: ${error.message}`);
  }
}
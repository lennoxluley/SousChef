/**
 * Parst Rezept-Anleitung in einzelne Steps mit RegEx
 */
export function parseInstructionsToSteps(instructions) {
  if (!instructions) return [];
  
  let steps = [];
  
  // Strategie 1: Nummerierte Steps (1. / 2. / Step 1: / etc.)
  const numberedPattern = /(?:^|\n)\s*(?:Step\s*)?(\d+)[.):]\s*(.+?)(?=(?:\n\s*(?:Step\s*)?\d+[.):])|$)/gis;
  let matches = [...instructions.matchAll(numberedPattern)];
  
  if (matches.length > 0) {
    steps = matches.map(match => match[2].trim());
  } else {
    // Strategie 2: Nach Satzzeichen trennen (. ! ?)
    const sentences = instructions.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
    
    if (sentences.length > 1) {
      steps = sentences;
    } else {
      // Strategie 3: Nach Absätzen trennen
      const paragraphs = instructions.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 10);
      
      if (paragraphs.length > 1) {
        steps = paragraphs;
      } else {
        // Strategie 4: Nach Zeilenumbrüchen
        steps = instructions.split(/\n+/).map(s => s.trim()).filter(s => s.length > 10);
      }
    }
  }
  
  // Cleanup: Entferne führende Nummern/Bullets
  steps = steps.map(step => 
    step.replace(/^[-•*\d.)\]:]+\s*/, '').trim()
  ).filter(step => step.length > 0);
  
  return steps.length > 0 ? steps : [instructions.trim()];
}
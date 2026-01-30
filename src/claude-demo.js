// Beispiel: Claude (Anthropic) API mit Node.js nutzen
// Voraussetzung: npm install anthropic

const { Anthropic } = require('anthropic');

// Setze deinen API-Key als Umgebungsvariable ANTHROPIC_API_KEY
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function runClaude() {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229', // oder ein anderes Modell
      max_tokens: 256,
      messages: [
        { role: 'user', content: 'Hallo Claude, was kannst du?' },
      ],
    });
    console.log('Claude Antwort:', response.content);
  } catch (error) {
    console.error('Fehler bei Anfrage an Claude:', error);
  }
}

runClaude();

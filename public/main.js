// main.js - Activity Spark Generator

// --- Config Section ---
const serviceSelect = document.getElementById('service-select');
const apiKeyInput = document.getElementById('api-key');
const saveConfigBtn = document.getElementById('save-config');
const configStatus = document.getElementById('config-status');

// Load config from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedService = localStorage.getItem('ai_service');
  const savedKey = localStorage.getItem('ai_api_key');
  if (savedService) serviceSelect.value = savedService;
  if (savedKey) apiKeyInput.value = savedKey;
});

saveConfigBtn.addEventListener('click', () => {
  localStorage.setItem('ai_service', serviceSelect.value);
  localStorage.setItem('ai_api_key', apiKeyInput.value);
  configStatus.textContent = 'Saved!';
  setTimeout(() => configStatus.textContent = '', 1500);
});

// --- Input Section ---
const subject = document.getElementById('subject');
const grade = document.getElementById('grade');
const theme = document.getElementById('theme');
const materials = document.getElementById('materials');
const time = document.getElementById('time');
const generateBtn = document.getElementById('generate');
const ideasList = document.getElementById('ideas-list');

// --- AI Prompt Construction ---
function buildPrompt() {
  let prompt = `Generate 5 creative, age-appropriate activity ideas for a ${subject.value} class, grade ${grade.value}`;
  if (theme.value) prompt += `, with the theme/topic: ${theme.value}`;
  if (materials.value) prompt += `, using these materials/constraints: ${materials.value}`;
  if (time.value) prompt += `, for a ${time.value}`;
  prompt += `.\nEach idea should have:\n- A catchy title\n- 1-2 sentence description\n- An example.\nRespond as a numbered list.`;
  return prompt;
}

// --- API Integration ---
async function fetchIdeas(prompt) {
  const service = localStorage.getItem('ai_service') || 'openrouter';
  const apiKey = localStorage.getItem('ai_api_key') || '';
  if (!apiKey) {
    alert('Please enter and save your API key.');
    return null;
  }

  if (service === 'openrouter') {
    // OpenRouter (compatible with OpenAI API)
    return fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 1.1,
      })
    })
      .then(res => res.json())
      .then(data => data.choices && data.choices[0] ? data.choices[0].message.content : 'No ideas generated.')
      .catch(() => 'Error: Could not fetch ideas.');
  } else if (service === 'gemini') {
    // Gemini API (Google Generative Language API)
    return fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 1.1, maxOutputTokens: 512 }
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Gemini API raw response:', data);
        if (data.candidates && data.candidates[0]) {
          // Try to extract the text from the most likely structure
          if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
          } else if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            return data.candidates[0].content.parts[0];
          } else if (data.candidates[0].output) {
            return data.candidates[0].output;
          }
        }
        if (data.error && data.error.message) {
          return 'Error: ' + data.error.message;
        }
        return 'No ideas generated. Raw response: ' + JSON.stringify(data);
      })
      .catch((err) => {
        return 'Error: Could not fetch ideas. ' + err;
      });
  }
}

// --- Generate Button Handler ---
generateBtn.addEventListener('click', async () => {
  ideasList.innerHTML = '<li>Generating ideas...</li>';
  const prompt = buildPrompt();
  const result = await fetchIdeas(prompt);
  if (!result) return;
  // Parse and display ideas
  const ideas = result.split(/\n\d+\. /g).filter(Boolean);
  ideasList.innerHTML = '';
  ideas.forEach((idea, idx) => {
    ideasList.innerHTML += `<li><strong>${idx + 1}.</strong> ${idea.trim()}</li>`;
  });
});

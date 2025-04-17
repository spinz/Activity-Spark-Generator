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

// --- Curriculum Data ---
let curriculumData = {};

// Load curriculum.json on startup
fetch('curriculum.json')
  .then(response => response.json())
  .then(data => {
    curriculumData = data;
  })
  .catch(() => {
    curriculumData = {};
    console.warn('Could not load curriculum.json');
  });

// --- AI Prompt Construction ---
function buildPrompt() {
  let prompt = `Generate 5 creative, age-appropriate activity ideas for a ${subject.value} class, grade ${grade.value}`;
  // Add curriculum expectations if available
  if (curriculumData && curriculumData[subject.value] && curriculumData[subject.value][grade.value]) {
    const expectations = curriculumData[subject.value][grade.value];
    prompt += `\nOntario Curriculum Expectations for this grade/subject:`;
    expectations.forEach((ex, idx) => {
      prompt += `\n${idx + 1}. ${ex}`;
    });
  }
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
    const li = document.createElement('li');
    li.innerHTML = `<strong>${idx + 1}.</strong> ${idea.trim()}`;
    // Add expand button
    const expandBtn = document.createElement('button');
    expandBtn.textContent = 'Expand';
    expandBtn.className = 'expand-btn';
    expandBtn.addEventListener('click', () => expandIdea(idea.trim()));
    li.appendChild(expandBtn);
    ideasList.appendChild(li);
  });
});

// Expand idea logic
async function expandIdea(ideaText) {
  // Animate UI
  const mainFlex = document.getElementById('main-flex');
  const expandedPanel = document.getElementById('expanded-panel');
  const expandedContent = document.getElementById('expanded-content');
  mainFlex.classList.add('expanded');
  expandedPanel.style.display = 'block';
  expandedContent.innerHTML = '<em>Loading detailed steps...</em>';

  // Build detailed prompt
  let detailPrompt = `Expand on this classroom activity idea for a ${subject.value} class, grade ${grade.value}`;
  if (curriculumData && curriculumData[subject.value] && curriculumData[subject.value][grade.value]) {
    const expectations = curriculumData[subject.value][grade.value];
    detailPrompt += `\nOntario Curriculum Expectations for this grade/subject:`;
    expectations.forEach((ex, idx) => {
      detailPrompt += `\n${idx + 1}. ${ex}`;
    });
  }
  detailPrompt += `\n\nActivity Idea: ${ideaText}\n\nProvide a detailed, step-by-step guide for running this activity in the classroom. Include at least two concrete examples or variations. List any materials or preparation needed. Format clearly for teachers.`;

  // Fetch expanded details
  const expandedResult = await fetchIdeas(detailPrompt);
  expandedContent.innerHTML = expandedResult ? expandedResult : '<em>Could not fetch expanded details.</em>';
}

// Close expanded panel
const closeBtn = document.getElementById('close-expanded');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    const mainFlex = document.getElementById('main-flex');
    const expandedPanel = document.getElementById('expanded-panel');
    const expandedContent = document.getElementById('expanded-content');
    mainFlex.classList.remove('expanded');
    expandedPanel.style.display = 'none';
    expandedContent.innerHTML = '';
  });
}


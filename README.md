# Activity Spark Generator

## Overview

Activity Spark Generator is a static, front‑end web app for K–8 teachers in the York Region District School Board (YRDSB). It leverages LLMs (OpenRouter or Google Gemini) to rapidly produce Ontario curriculum–aligned classroom activities with optional theme, materials, and time constraints. It displays five creative, age‑appropriate ideas, each with a title, description, and example, plus an “Expand” mode for detailed step‑by‑step guides.

## Features

### Configuration

- **AI Service:** Select between OpenRouter (OpenAI‑compatible) or Gemini.
- **API Key:** Enter and save your key in browser localStorage.

### Inputs

- **Subject:** Math, Science, Social Studies, Literacy, Music, Art, Dance, Drama, Phys Ed.
- **Grade:** Kindergarten through Grade 8.
- **Theme/Topic (optional):** Free-text entry.
- **Materials/Constraints (optional):** Free-text entry.
- **Time Estimate (optional):** Warm-up (5-10 min), Main Activity (20-30 min), Cool-down (5 min).

### Curriculum Integration

- Loads `curriculum.json` containing Ontario curriculum expectations by subject and grade.
- Embeds selected expectations into AI prompts.
- Easily extend JSON with YRDSB scope-and-sequence, local course codes, Character Education or equity-inclusion outcomes.

### AI Prompt Construction

- `buildPrompt()` composes a natural-language prompt including inputs and curriculum expectations.
- Instructs the model to return **5 ideas**, each with:
  1. **Catchy title**
  2. **1–2 sentence description**
  3. **Concrete example**

### API Integration

- `fetchIdeas(prompt)` calls either:
  - **OpenRouter** (`openai/gpt-3.5-turbo`)
  - **Gemini** (Google Generative Language API)
- Handles authorization, errors, and max token limits.

### UI & Workflow

1. **Generate Ideas:** Click “Generate Ideas” to fetch and display a numbered list of 5 activity concepts.
2. **Expand Idea:** Click “Expand” on any idea to open an overlay with detailed, step-by-step instructions, materials list, and variations.
3. **Back:** Close the overlay to return to the list.

## Installation

1. Clone this repository:
   ```bash
   git clone <repo-url>
   ```
2. Install a static server (e.g., `npm install -g http-server`) or use any local server.
3. Serve the `public/` directory:
   ```bash
   http-server public
   ```
4. Open your browser at `http://localhost:8080`.
5. Select AI service, enter your API key, and click “Generate Ideas.”

## Customization

- **Curriculum Data:** Edit `public/curriculum.json` to add or override curriculum expectations with YRDSB-specific frameworks, unit plans, or local policies.
- **Branding & Styles:** Update `public/style.css` or `public/index.html` to apply YRDSB visual identity, fonts, and accessibility guidelines.
- **Secure Keys:** For board-wide deployment, consider adding a backend proxy (Node/Express) to store and forward API keys instead of using localStorage.

## Contributing

Contributions welcome! Open issues or PRs for:
- New curriculum entries
- UI enhancements
- Additional AI services

## License

MIT 2025 Robbie Share

## Acknowledgements

Made with for YRDSB K–8 teachers!

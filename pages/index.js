// pages/index.js
import { useState, useEffect } from 'react';

export default function Home() {
  // Config state
  const [service, setService] = useState('openrouter');
  const [apiKey, setApiKey] = useState('');
  const [configStatus, setConfigStatus] = useState('');

  // Input state
  const [subject, setSubject] = useState('Math');
  const [grade, setGrade] = useState('Kindergarten');
  const [theme, setTheme] = useState('');
  const [materials, setMaterials] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');

  // Curriculum data
  const [curriculumData, setCurriculumData] = useState({});

  // Ideas and expansion
  const [ideas, setIdeas] = useState([]);
  const [expandedContent, setExpandedContent] = useState('');
  const [expandedVisible, setExpandedVisible] = useState(false);

  useEffect(() => {
    // Load config
    const savedService = localStorage.getItem('ai_service');
    const savedKey = localStorage.getItem('ai_api_key');
    if (savedService) setService(savedService);
    if (savedKey) setApiKey(savedKey);
    // Fetch curriculum
    fetch('/curriculum.json')
      .then(res => res.json())
      .then(data => setCurriculumData(data))
      .catch(() => console.warn('Could not load curriculum.json'));
  }, []);

  const saveConfig = () => {
    localStorage.setItem('ai_service', service);
    localStorage.setItem('ai_api_key', apiKey);
    setConfigStatus('Saved!');
    setTimeout(() => setConfigStatus(''), 1500);
  };

  const buildPrompt = () => {
    let prompt = `Generate 5 creative, age-appropriate activity ideas for a ${subject} class, grade ${grade}`;
    if (curriculumData[subject] && curriculumData[subject][grade]) {
      prompt += `\nOntario Curriculum Expectations for this grade/subject:`;
      curriculumData[subject][grade].forEach((ex, idx) => {
        prompt += `\n${idx + 1}. ${ex}`;
      });
    }
    if (theme) prompt += `, with the theme/topic: ${theme}`;
    if (materials) prompt += `, using these materials/constraints: ${materials}`;
    if (timeEstimate) prompt += `, for a ${timeEstimate}`;
    prompt += `.`;
    prompt += `\nEach idea should have:\n- A catchy title\n- 1-2 sentence description\n- An example.\nRespond as a numbered list.`;
    return prompt;
  };

  const handleGenerate = async () => {
    const prompt = buildPrompt();
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (data.error) return alert(data.error);
    const lines = data.result.split(/\n\d+\.\s/).filter(Boolean);
    setIdeas(lines);
  };

  const handleExpand = async (idea) => {
    let detailPrompt = `Expand on this classroom activity idea for a ${subject} class, grade ${grade}`;
    if (curriculumData[subject] && curriculumData[subject][grade]) {
      detailPrompt += `\nOntario Curriculum Expectations for this grade/subject:`;
      curriculumData[subject][grade].forEach((ex, idx) => {
        detailPrompt += `\n${idx + 1}. ${ex}`;
      });
    }
    detailPrompt += `\n\nActivity Idea: ${idea}`;
    detailPrompt += `\n\nProvide a detailed, step-by-step guide for running this activity in the classroom. Include at least two concrete examples or variations. List any materials or preparation needed. Format clearly for teachers.`;
    setExpandedVisible(true);
    setExpandedContent('Loading detailed steps...');
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: detailPrompt }),
    });
    const data = await res.json();
    setExpandedContent(data.error ? data.error : data.result);
  };

  const closeExpand = () => setExpandedVisible(false);

  return (
    <div id="main-flex">
      <nav className="navbar">
        <div className="navbar-title">Activity Spark Generator</div>
      </nav>
      <div className="container">
        <header>
          <h1>Activity Spark Generator</h1>
          <p className="subtitle">AI-powered inspiration for K-8 teachers</p>
        </header>
        <section className="config-section">
          <label htmlFor="service-select">AI Service:</label>
          <select id="service-select" value={service} onChange={e => setService(e.target.value)}>
            <option value="openrouter">OpenRouter</option>
            <option value="gemini">Gemini</option>
          </select>
          <label htmlFor="api-key">API Key:</label>
          <input id="api-key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter your API key..." />
          <button id="save-config" onClick={saveConfig}>Save</button>
          <span id="config-status">{configStatus}</span>
        </section>
        <section className="input-section">
          <div className="input-group">
            <label htmlFor="subject">Subject:</label>
            <select id="subject" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Literacy">Literacy</option>
              <option value="Music">Music</option>
              <option value="Art">Art</option>
              <option value="Dance">Dance</option>
              <option value="Drama">Drama</option>
              <option value="Phys Ed">Phys Ed</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="grade">Grade Level:</label>
            <select id="grade" value={grade} onChange={e => setGrade(e.target.value)}>

// pages/index.js
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home({ session }) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    // Fetch curriculum
    fetch('/curriculum.json')
      .then(res => res.json())
      .then(data => setCurriculumData(data))
      .catch(() => console.warn('Could not load curriculum.json'));
  }, []);

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
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      const lines = data.result.split(/\n\d+\.\s/).filter(Boolean);
      setIdeas(lines);
    } catch (err) {
      console.error(err);
      alert('Error generating ideas.');
    } finally {
      setIsLoading(false);
    }
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
    setExpandedContent('');
    setIsExpanding(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: detailPrompt }),
      });
      const data = await res.json();
      setExpandedContent(data.error ? data.error : data.result);
    } catch (err) {
      console.error(err);
      setExpandedContent('Error loading details.');
    } finally {
      setIsExpanding(false);
    }
  };

  const closeExpand = () => setExpandedVisible(false);

  return (
    <div id="main-flex">
      <nav className="navbar">
        <div className="navbar-title">Activity Spark Generator</div>
        {session && (
          <div className="navbar-actions">
            <span>Welcome, {session.user.name}</span>
            <button onClick={() => signOut()}>Logout</button>
            {session.user.role === 'ADMIN' && <Link href="/admin">Admin</Link>}
          </div>
        )}
      </nav>
      <div className="container">
        <header>
          <h1>Activity Spark Generator</h1>
          <p className="subtitle">AI-powered inspiration for K-8 teachers</p>
        </header>
        <div className="main-grid">
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
                <option value="Kindergarten">Kindergarten</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="theme">Theme/Topic (optional):</label>
              <input id="theme" value={theme} onChange={e => setTheme(e.target.value)} placeholder="e.g. Space, Fractions, Community" />
            </div>
            <div className="input-group">
              <label htmlFor="materials">Materials/Constraints (optional):</label>
              <input id="materials" value={materials} onChange={e => setMaterials(e.target.value)} placeholder="e.g. Paper, No tech, Outdoors" />
            </div>
            <div className="input-group">
              <label htmlFor="time-estimate">Time Estimate (optional):</label>
              <select id="time-estimate" value={timeEstimate} onChange={e => setTimeEstimate(e.target.value)}>
                <option value="">Select...</option>
                <option value="Warm-up (5-10 min)">Warm-up (5-10 min)</option>
                <option value="Main Activity (20-30 min)">Main Activity (20-30 min)</option>
                <option value="Cool-down (5 min)">Cool-down (5 min)</option>
              </select>
            </div>
          </section>
          <div className="generate-container">
            <button id="generate" onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Ideas'}
            </button>
            {isLoading && (
              <div className="loading-bar">
                <div className="loading-fill" />
              </div>
            )}
          </div>
          <section className="ideas-section">
            <h2>Ideas</h2>
            <ol>
              {ideas.map((idea, idx) => (
                <li key={idx}>
                  <div className="idea-text">{idea}</div>
                  <button onClick={() => handleExpand(idea)}>Expand</button>
                </li>
              ))}
            </ol>
          </section>
        </div>
        {expandedVisible && (
          <div className="modal-overlay" onClick={closeExpand}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={closeExpand}>Close</button>
              {isExpanding && (
                <div className="loading-bar">
                  <div className="loading-fill" />
                </div>
              )}
              <div className="expanded-content">{expandedContent}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
  const safeSession = {
    ...session,
    user: {
      ...session.user,
      image: session.user.image ?? null,
      approved: session.user.approved ?? null,
      suspended: session.user.suspended ?? null
    },
  };
  return {
    props: { session: safeSession },
  };
}

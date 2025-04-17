// pages/api/generate.js

import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  // --- server proxy logic ---
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing GOOGLE_API_KEY in environment' });
  }
  try {
    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await aiRes.json();
    let resultText = '';
    if (data.candidates && data.candidates[0]) {
      const cand = data.candidates[0];
      if (cand.content?.parts?.[0]?.text) {
        resultText = cand.content.parts[0].text;
      } else if (cand.output) {
        resultText = cand.output;
      } else {
        resultText = JSON.stringify(cand);
      }
    } else if (data.error) {
      throw new Error(data.error.message);
    } else {
      throw new Error('No ideas generated.');
    }
    return res.status(200).json({ result: resultText });
  } catch (err) {
    console.error('Gemini API error:', err);
    return res.status(500).json({ error: 'AI service error: ' + err.message });
  }
}

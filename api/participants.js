// api/participants.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const participants = await kv.get('participants') || [];
    return res.status(200).json(participants);
  }

  if (req.method === 'POST') {
    const { name, slots } = req.body;
    let participants = await kv.get('participants') || [];
    
    const existingIndex = participants.findIndex(p => p.name === name);
    
    if (existingIndex !== -1) {
      participants[existingIndex] = { name, slots };
    } else {
      participants.push({ name, slots });
    }
    
    await kv.set('participants', participants);
    return res.status(200).json(participants);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
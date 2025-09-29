// api/participants.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = neon(process.env.DATABASE_URL);

  // Utwórz tabelę jeśli nie istnieje
  await sql`
    CREATE TABLE IF NOT EXISTS participants (
      name TEXT PRIMARY KEY,
      slots JSONB NOT NULL
    )
  `;

  if (req.method === 'GET') {
    const participants = await sql`SELECT name, slots FROM participants`;
    return res.status(200).json(participants);
  }

  if (req.method === 'POST') {
    const { name, slots } = req.body;
    
    await sql`
      INSERT INTO participants (name, slots)
      VALUES (${name}, ${JSON.stringify(slots)})
      ON CONFLICT (name) 
      DO UPDATE SET slots = ${JSON.stringify(slots)}
    `;
    
    const participants = await sql`SELECT name, slots FROM participants`;
    return res.status(200).json(participants);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
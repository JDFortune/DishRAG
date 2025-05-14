import { sql } from 'bun';

try {
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;

  await sql`
  CREATE TABLE IF NOT EXISTS embeddings (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    embedding vector(1536)
  )
  `;
} catch (err) {
  if (err instanceof Error) {
    console.error('An error occurred:', err.message);
  }
}
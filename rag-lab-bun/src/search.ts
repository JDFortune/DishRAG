import { sql } from 'bun';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// const result = await sql`SELECT COUNT(id) FROM travel_activity`;

export interface SearchResult {
  text: string;
  similarity: number;
}

export async function searchSimilarActivities(
  query: string
): Promise<SearchResult[]> {
  try {
      const embedding = await generateEmbedding(query);
      
      const result = await sql
          `SELECT 
              text,
              1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
           FROM embeddings
           WHERE 1 - (embedding <=> ${JSON.stringify(embedding)}::vector) > 0.2
           ORDER BY similarity DESC
           LIMIT 7`;

      return result;
  } catch (error) {
      console.error('Error searching activities:', error);
      throw error;
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
  });

  return response.data[0].embedding;
}


const value = await searchSimilarActivities('Going hikin in Hawaii, near the volcanoes');

console.log(value);
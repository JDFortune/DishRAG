import OpenAI from 'openai';
import { searchSimilarActivities } from './search';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function askQuestion(question: string): Promise<string> {
    try {
        // 1. Find relevant travel activities
        const searchResults = await searchSimilarActivities(question);
        
        if (searchResults.length === 0) {
            return "I couldn't find any relevant information to answer your question.";
        }
        
        // 2. Format context from search results
        const context = searchResults
            .map(result => `- ${result.text} (Similarity: ${result.similarity.toFixed(2)})`)
            .join('\n');
        
        // 3. Create prompt with context
        const prompt = `You are a helpful assistant. Use the following relevant results to answer the user's question. If the activities aren't relevant to the question, you can say so.

Available Relevant Info:
${context}

Question: ${question}

Please provide a helpful response based on the question and, if relevant, you can provide additional information based on your general knowledge.`;
        
        // 4. Get response from OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        return completion.choices[0].message.content || 'No answer found';
    } catch (error) {
        console.error('Error in RAG:', error);
        throw error;
    }
}
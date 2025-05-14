import OpenAI from 'openai';
import express, { Request, Response }from "express";
import cors from 'cors';
import { sql } from 'bun';
import { TokenTextSplitter } from "@langchain/textsplitters";
import { askQuestion } from './rag';


const app = express();
const PORT = 3000; 

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true}));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.get("/", (_req: any, res: any) => {
  res.send('Hello World!');
});

app.post('/api/process', async (req: any, res: any) => {
  const body = req.body;
  console.log('Parsing text...');
  const text = await parseTextFromImage(body.imageDataUrl);
  console.log('Text parsed!');
  if (!!text) {
    const splitter = new TokenTextSplitter({
      chunkSize: 600,
      chunkOverlap: 200
    });
    const chunks = await splitter.splitText(text);
    console.log('Embedding Text and Storing in Database...');
    chunks.forEach(async (chunk) => {
      const embedding = await embedText(chunk);
      await sql`INSERT INTO embeddings (text, embedding) VALUES (${text}, ${JSON.stringify(embedding)})`;
    });
    console.log('Embeddings Stored!');
    res.send({ text: `${chunks.length} chunks of text embedded and stored.` });
  } else {
    res.send({ text: "No Text Perceived", error: true })
  }
});

app.post('/api/query', async (req: Request, res: Response) => {
  const query = req.body.query;

  const result = await askQuestion(query);
  res.send(result);
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

async function embedText(text: string) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  return embedding.data[0].embedding;
}

async function parseTextFromImage(imageDataUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {role: "system", "content": "You are a highly skilled assistant that receives base64 encoded images of text from notes, and text books, and any other source and extracts the text to markdown formatted strings. Extract every bit of the text from the photo"},
      {role: 'assistant', content: 'When sending back the extracted text, only send the text itself in the content. Do not add anything else to the string. Be sure that all of the text from the photo is extracted'},
      {
        role: "user",
        content: [
          { type: "text", text: "Please extract the text from this image."},
          { type: "image_url", image_url: {url: imageDataUrl}}
        ],
      }
    ],
    max_tokens: 3000,
  });

  const text = response.choices[0].message.content;
  return text;
}
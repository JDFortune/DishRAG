import { SyntheticEvent, useState } from 'react';
import axios from 'axios';
import OpenAI from 'openai';
import './App.css'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});


function App() {
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [textResults, setTextResults] = useState<string[]>([]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (files) {
      const imageFiles = Array.from(files);
      const newBase64Images: string[] = [];
    
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newBase64Images.push(reader.result as string);
          if (newBase64Images.length === imageFiles.length) {
            setBase64Images(newBase64Images);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  async function parseTextFromImage(imageDataUrl: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // prompt: "Please extract the text from this image.",
      messages: [
        {"role": "system", "content": "You are a highly skilled assistant that receives base64 encoded images of text from notes, and text books, and any other source and extracts the text to markdown formatted strings. Extract every bit of the text from the photo"},
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
  
    // const requestBody = {
    //   model: "gpt-4-vision-preview",
    //   messages: [
    //     {"role": "developer", "content": "You are a highly skilled assistant that receives base64 encoded images of text from notes, and text books, and any other source and extracts the text to markdown formatted strings"},
    //     {"role": "user", "content": "Please extract the text from this image."}
    //   ],
    //   image: {
    //     data: text,
    //   }
    // };

    // const response = await fetch('https://api.openai.com/v4/chat/completions', {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify(requestBody),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.choices && data.choices[0] && data.choices[0].message) {
    //       const extractedText = data.choices[0].message.content;
    //       console.log('Extracted text:', extractedText);
    //       return extractedText
    //     }
    //   })
    //   .catch(error => console.error('Error making the request:', error.message));
    const text = response.choices[0].message.content;
    console.log(text);
    return text;
  }

  async function convertToText(e: SyntheticEvent) {
    if (base64Images.length > 0) {
      try {
        // const openai = new OpenAI({
        //   apiKey: process.env.OPENAI_API_KEY,
        // });

        const results: string[] = [];

        for (let i = 0; i < base64Images.length; i++) {
          let base64Image = base64Images[i];
          console.log(base64Image);
          // let response = await axios.post('http://localhost:3000/api/process', { image: base64Image });
          const response = await parseTextFromImage(base64Image);
          console.log(response);
          if (response) {
            results.push(response);
          }

          // const response = await openai.images.createVariation({
          //   image: base64Image,
          // });
          // const text = await extractTextFromBase64(base64Image);
        }

        setTextResults(results);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('An Error Occurred:', err.message);
        } else {
          console.error('Something went wrong.')
        }
      }
    }
  }

  return (
    <div>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        multiple
        onChange={handleFileChange}  
      />
      <button
        id="processButton"
        onClick={convertToText}
      >Extract Text</button>
      <p id="outputText"></p>
      <ul>
        {textResults.map((text, idx) => {
          return <li key={text + idx}>{text}</li>
        })}
      </ul>
    </div>

  )
}

export default App

import { SyntheticEvent, useState } from 'react';
import axios from 'axios';
import OpenAI from 'openai';
import './App.css'

const baseUrl = 'http://localhost:3000/api';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});


function App() {
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [textResults, setTextResults] = useState<string[]>([]);
  const [queryText, setQueryText] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (files) {
      const imageFiles = Array.from(files);
      const newBase64Images: string[] = [];
    
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // async function that reads the file as base64

        reader.onload = () => { // event listener that handles the event of reader finishing base64 conversion
          newBase64Images.push(reader.result as string); // once converted we push the base64encoding into our result array
          if (newBase64Images.length === imageFiles.length) {
            setBase64Images(newBase64Images); // ones the result array has the same number of elemens as the images files array, we set the state.
          }
        };
      });
    }
  };

  async function handleClickButton(e: SyntheticEvent) {
    if (base64Images.length > 0) {
      try {
        const results: string[] = [];

        for (let i = 0; i < base64Images.length; i++) {
          let base64Image = base64Images[i];
          console.log('base64 encoding:', base64Image);

          let response = await axios.post(baseUrl + '/process', { imageDataUrl: base64Image}, {
            headers: { 'Content-Type': 'application/json'}
          }) as { text: string };

          console.log(response);
          // results.push(response.text);
        }
        setBase64Images([]);
        setTextResults(results);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('An Error Occurred:', err.message);
        } else {
          console.error('Something went wrong.')
        }
      }
    } else {
      alert('Must Load Files');
    }
  }

  function handleSubmitQuery() {
    axios.post(baseUrl + '/query', { query: queryText })
      .then(response => {
        console.log('Response Data:', response.data);
        return response.data;
      })
      .then(answer => {
        console.log('Answer:', answer);
        setApiResponse(answer);
        setQueryText('');
      })
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
        onClick={handleClickButton}
      >Extract Text</button>
      <div style={{textAlign: 'left'}}>
      <p id="outputText"></p>
        {textResults.map((text, idx) => {
           return text.split("\n").map(t => <p key={t + idx}>{t}</p>);
        })}
      </div>
      <input type="text"
        onChange={(e) => setQueryText(e.target.value)}
        value={queryText}
      />
      <button
        id="submitQuery"
        onClick={handleSubmitQuery}
      >Ask?</button>
      <p>{apiResponse}</p>
    </div>

  )
}

export default App
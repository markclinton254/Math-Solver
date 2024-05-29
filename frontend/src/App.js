import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [textInput, setTextInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState('');

  const handleTextSubmit = async () => {
    try {
      const response = await axios.post('/api/solve', { problem: textInput });
      setResult(response.data.solution);
    } catch (error) {
      console.error("Error solving text problem:", error);
      setResult("Error solving the problem.");
    }
  };

  const handleImageSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await axios.post('/api/solve-image', formData);
      setResult(response.data.solution);
    } catch (error) {
      console.error("Error solving image problem:", error);
      setResult("Error solving the problem.");
    }
  };

  return (
    <div className="App">
      <h1>Math Solver</h1>
      <textarea 
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Type your math problem here"
      />
      <button onClick={handleTextSubmit}>Solve</button>
      <br />
      <input 
        type="file" 
        onChange={(e) => setImageFile(e.target.files[0])} 
      />
      <button onClick={handleImageSubmit}>Upload and Solve</button>
      <h2>Solution: {result}</h2>
    </div>
  );
}

export default App;

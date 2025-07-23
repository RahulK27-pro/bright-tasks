const axios = require('axios');

// Test the local backend endpoint
async function testLocalAPI() {
  console.log('Testing local Gemini API endpoint...');
  
  const testPayload = {
    tasks: [
      { title: "Complete project report", deadline: "2024-01-15", priority: "high" },
      { title: "Team meeting", deadline: "2024-01-10", priority: "medium" },
      { title: "Code review", deadline: "", priority: "low" }
    ]
  };

  try {
    const response = await axios.post('http://localhost:5000/api/gemini/prioritize', testPayload, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ SUCCESS!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ ERROR!');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Error Data:', error.response?.data);
    console.log('Error Message:', error.message);
    
    // If it's a server error, let's also test the Gemini API directly
    if (error.response?.status === 500) {
      console.log('\n--- Testing Gemini API directly ---');
      await testGeminiDirectly();
    }
  }
}

async function testGeminiDirectly() {
  require('dotenv').config();
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  
  console.log('API Key exists:', GEMINI_API_KEY ? 'Yes' : 'No');
  console.log('Gemini URL:', GEMINI_URL);
  
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{
        parts: [{ text: "Hello, respond with 'Gemini API is working!'" }]
      }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Gemini API Direct Test SUCCESS!');
    console.log('Response:', response.data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.log('❌ Gemini API Direct Test FAILED!');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.error?.message || error.message);
  }
}

testLocalAPI();

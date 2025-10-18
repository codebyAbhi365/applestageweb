// Note: This is an example for a Node.js environment.
// You would need to set up a simple Express server or a serverless function.

// Example using Express.js
const express = require('express');
const fetch = require('node-fetch'); // You might need to install this: npm install node-fetch
const app = express();
app.use(express.json());

const ELEVENLABS_API_KEY = "e4336c85b6807ef569c0ff2b49d7a028c8bc07cf5be942206cb463848bc88e34"; // Keep your key in an .env file
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // This is a generic female voice ID from ElevenLabs (Rachel)

app.post('/api/generate-speech', async (req, res) => {
  const { text } = req.body;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Good model for multiple languages
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  // Stream the audio back to the client
  res.setHeader('Content-Type', 'audio/mpeg');
  response.body.pipe(res);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
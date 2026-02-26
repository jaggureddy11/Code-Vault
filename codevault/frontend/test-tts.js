const fetch = require('node-fetch');

async function test() {
  const GEMINI_API_KEY = 'AIzaSyCfxdCIS_tbLQK-KXNTSuFWPwSnVXvtrWQ';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: "Hello, how can I help you today?" }] }],
          generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                  voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Puck' }
                  }
              }
          }
      })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();

const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("No API KEY found");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.error) {
        console.error("API Error:", json.error);
      } else {
        console.log("Available Models:");
        if (json.models) {
            json.models.forEach(m => {
                // Filter for generateContent supported models
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log(json);
        }
      }
    } catch (e) {
      console.error("Parse Error", e);
      console.log(data);
    }
  });
}).on('error', err => {
  console.error("Network Error", err);
});

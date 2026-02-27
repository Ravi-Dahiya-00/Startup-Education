const { GoogleGenerativeAI } = require('@google/generative-ai');

const parseJobWithAI = async (text) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API Key is not configured');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Using the model we verified works
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert HR Data Extraction AI. Transform the following unstructured job text into a structured JSON object.
    
    Output Schema:
    {
      "title": "Job Title",
      "company": "Company Name (use 'Unknown Company' if missing)",
      "companyDomain": "company.com (infer from name if missing)",
      "location": "City, Country (or 'Remote')",
      "category": "Engineering | Design | Marketing | Sales | Other",
      "jobType": "Full Time | Internship | Contract | Freelance",
      "experienceLevel": "Intern | Entry Level | Junior | Mid | Senior",
      "skills": ["Array", "of", "Skills"],
      "salary": "Salary Range (e.g. ₹5LPA - ₹10LPA or Not Disclosed)",
      "description": "A clean, concise summary of the role (HTML allowed for paragraphs)",
      "responsibilities": ["Array", "of", "key", "responsibilities"],
      "qualifications": ["Array", "of", "requirements"],
      "applyUrl": "Extracted Link or empty string",
      "detectedFrom": "Source type (e.g. LinkedIn, Tweet, etc.)"
    }

    Rules:
    1. Extract EXACT text where possible.
    2. INFER missing fields intelligently (e.g. "looking for react intern" -> jobType: "Internship", role: "React Developer Intern").
    3. If salary is missing, use "Not Disclosed".
    4. Convert "3-5 years" to "Mid Level", "0-1 years" to "Entry Level".
    5. Return ONLY valid JSON.
    
    Raw Text to Process:
    """
    ${text}
    """
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const textResponse = response.text();
  
  // Clean markdown code blocks if present
  const cleanJson = textResponse.replace(/^```json\s*|\s*```$/g, '');
  
  return JSON.parse(cleanJson);
};

module.exports = { parseJobWithAI };

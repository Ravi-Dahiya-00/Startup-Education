const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeLPU_CSE() {
  try {
    const url = 'https://www.lpu.in/programmes/engineering/b-tech-computer-science';
    console.log(`Fetching ${url}...`);
    const response = await axios.get(url);
    const html = response.data;

    const index = html.indexOf("Spring Term");
    
    if (index !== -1) {
        console.log("Found 'Spring Term' at index:", index);
        console.log("Context (1000 chars before and after):");
        console.log("---------------------------------------------------");
        console.log(html.substring(index - 1000, index + 1000));
        console.log("---------------------------------------------------");
    } else {
        console.log("'Spring Term' NOT found in raw HTML string.");
    }

  } catch (error) {
    console.error('Error scraping:', error.message);
  }
}

scrapeLPU_CSE();

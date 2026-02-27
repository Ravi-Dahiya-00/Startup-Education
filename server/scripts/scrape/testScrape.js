const axios = require('axios');

async function testScrape() {
  try {
    const url = 'https://www.lpu.in/programmes/engineering/b-tech-computer-science';
    console.log(`Fetching ${url}...`);
    const response = await axios.get(url);
    const html = response.data;

    console.log('Page fetched successfully.');
    
    // Check for "Curriculum" section
    if (html.includes('Curriculum')) {
      console.log('Found "Curriculum" keyword.');
    } else {
      console.log('"Curriculum" keyword NOT found.');
    }

    // Check for "1st Year" id
    if (html.includes('id="year1"')) {
      console.log('Found id="year1".');
    } else {
      console.log('id="year1" NOT found.');
    }

    // Check for table structure or course codes (guessing common format)
    // Looking for "Autumn Term" or "Spring Term" which are common in LPU curriculum
    if (html.includes('Autumn Term') || html.includes('Spring Term')) {
      console.log('Found "Autumn Term" or "Spring Term". Data might be static!');
      
      // Try to extract a snippet
      const index = html.indexOf('Autumn Term');
      console.log('Snippet around "Autumn Term":');
      console.log(html.substring(index - 100, index + 200));
    } else {
      console.log('Did not find "Autumn Term" or "Spring Term". Data might be dynamic.');
    }

  } catch (error) {
    console.error('Error fetching page:', error.message);
  }
}

testScrape();

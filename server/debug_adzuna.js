require('dotenv').config({ path: './server/.env' });
const axios = require('axios');

const resolveRedirect = async (url) => {
  console.log(`\n--- Resolving: ${url} ---`);
  try {
    const response = await axios.get(url, { 
      maxRedirects: 5,
      validateStatus: status => status >= 200 && status < 400,
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const finalUrl = response.request.res.responseUrl || url;
    console.log(`HTTP Resolved to: ${finalUrl}`);

    if (finalUrl.includes('adzuna')) {
      const html = response.data;
      if (typeof html === 'string') {
        console.log('Page HTML Preview: ', html.substring(0, 500));
        
        const metaRefresh = html.match(/<meta\s+http-equiv=["']refresh["']\s+content=["']\d+;\s*url=([^"']+)["']/i);
        if (metaRefresh && metaRefresh[1]) {
          console.log(`Found Meta Refresh to: ${metaRefresh[1]}`);
          return metaRefresh[1];
        }

        const jsRedirect = html.match(/window\.location(?:\.replace)?\s*\(\s*['"]([^'"]+)['"]\s*\)|window\.location\s*=\s*['"]([^'"]+)['"]/);
        if (jsRedirect) {
          console.log(`Found JS Redirect to: ${jsRedirect[1] || jsRedirect[2]}`);
          return jsRedirect[1] || jsRedirect[2];
        }
      }
    }
    return finalUrl;
  } catch (e) {
    console.error('Resolve Error:', e.message);
    return url;
  }
};

const run = async () => {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    console.error('Missing credentials');
    return;
  }

  try {
    console.log('Fetching 1 job from Adzuna...');
    const res = await axios.get(`https://api.adzuna.com/v1/api/jobs/in/search/1`, {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what: 'software engineer',
        results_per_page: 1,
        'content-type': 'application/json'
      }
    });

    const job = res.data.results[0];
    if (job) {
      console.log(`Raw URL: ${job.redirect_url}`);
      const resolved = await resolveRedirect(job.redirect_url);
      console.log(`\nFINAL RESOLVED URL: ${resolved}`);
    } else {
      console.log('No jobs found to test');
    }
  } catch (e) {
    console.error(e);
  }
};

run();

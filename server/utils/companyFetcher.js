const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Company Profile Fetcher
 * Aggregates data from multiple free APIs with fallbacks
 */

// ============== CLEARBIT LOGO ==============
const getClearbitLogo = (domain) => {
  return `https://logo.clearbit.com/${domain}`;
};

// ============== WIKIDATA / WIKIPEDIA ==============
const fetchWikipediaDescription = async (companyName) => {
  try {
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(companyName)}`;
    const response = await axios.get(searchUrl, { timeout: 5000 });
    
    if (response.data && response.data.extract) {
      return {
        description: response.data.extract,
        shortDescription: response.data.description || '',
        thumbnail: response.data.thumbnail?.source || null,
        source: 'wikipedia'
      };
    }
    return null;
  } catch (error) {
    console.log(`Wikipedia fetch failed for ${companyName}:`, error.message);
    return null;
  }
};

// ============== WIKIDATA SPARQL ==============
const fetchWikidataInfo = async (companyName) => {
  try {
    // First, search for the company entity
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(companyName)}&language=en&format=json&type=item&limit=1`;
    const searchResponse = await axios.get(searchUrl, { timeout: 5000 });
    
    if (!searchResponse.data.search || searchResponse.data.search.length === 0) {
      return null;
    }
    
    const entityId = searchResponse.data.search[0].id;
    
    // Fetch entity data
    const entityUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&languages=en&format=json`;
    const entityResponse = await axios.get(entityUrl, { timeout: 5000 });
    
    const entity = entityResponse.data.entities[entityId];
    const claims = entity.claims || {};
    
    // Extract relevant properties
    const result = {
      wikidataId: entityId,
      description: entity.descriptions?.en?.value || '',
      industry: extractWikidataClaim(claims, 'P452'), // Industry
      headquarters: extractWikidataClaim(claims, 'P159'), // Headquarters location
      foundedYear: extractWikidataYear(claims, 'P571'), // Inception date
      website: extractWikidataClaim(claims, 'P856'), // Official website
      source: 'wikidata'
    };
    
    return result;
  } catch (error) {
    console.log(`Wikidata fetch failed for ${companyName}:`, error.message);
    return null;
  }
};

// Helper to extract Wikidata claim value
const extractWikidataClaim = (claims, propertyId) => {
  if (claims[propertyId] && claims[propertyId][0]) {
    const mainsnak = claims[propertyId][0].mainsnak;
    if (mainsnak.datavalue) {
      if (mainsnak.datavalue.type === 'string') {
        return mainsnak.datavalue.value;
      }
      if (mainsnak.datavalue.type === 'wikibase-entityid') {
        return mainsnak.datavalue.value.id; // Returns entity ID
      }
    }
  }
  return null;
};

// Helper to extract year from Wikidata date
const extractWikidataYear = (claims, propertyId) => {
  if (claims[propertyId] && claims[propertyId][0]) {
    const timeValue = claims[propertyId][0].mainsnak?.datavalue?.value?.time;
    if (timeValue) {
      const match = timeValue.match(/\+(\d{4})/);
      return match ? parseInt(match[1]) : null;
    }
  }
  return null;
};

// ============== GITHUB ORG ==============
const fetchGitHubOrg = async (orgName) => {
  try {
    // Try to guess org name from company name
    const normalizedOrg = orgName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const [orgResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/orgs/${normalizedOrg}`, {
        timeout: 5000,
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      }).catch(() => null),
      axios.get(`https://api.github.com/orgs/${normalizedOrg}/repos?per_page=10&sort=stars`, {
        timeout: 5000,
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      }).catch(() => null)
    ]);
    
    if (!orgResponse?.data) return null;
    
    const repos = reposResponse?.data || [];
    
    // Calculate top languages
    const languageCounts = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });
    
    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);
    
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    
    return {
      orgName: orgResponse.data.login,
      publicRepos: orgResponse.data.public_repos,
      topLanguages,
      totalStars,
      followers: orgResponse.data.followers || 0,
      blog: orgResponse.data.blog || '',
      twitter: orgResponse.data.twitter_username || '',
      source: 'github'
    };
  } catch (error) {
    console.log(`GitHub fetch failed for ${orgName}:`, error.message);
    return null;
  }
};

// ============== OPEN GRAPH SCRAPER ==============
const fetchOpenGraphData = async (domain) => {
  try {
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StartupEducation/1.0; +https://startupeducation.com)'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const ogData = {
      title: $('meta[property="og:title"]').attr('content') || $('title').text() || '',
      description: $('meta[property="og:description"]').attr('content') || 
                   $('meta[name="description"]').attr('content') || '',
      image: $('meta[property="og:image"]').attr('content') || '',
      siteName: $('meta[property="og:site_name"]').attr('content') || '',
      source: 'opengraph'
    };
    
    // Try to find social links
    const socials = {
      linkedin: '',
      twitter: '',
      github: '',
      facebook: '',
      instagram: ''
    };
    
    $('a[href*="linkedin.com"]').first().each((_, el) => {
      socials.linkedin = $(el).attr('href') || '';
    });
    $('a[href*="twitter.com"], a[href*="x.com"]').first().each((_, el) => {
      socials.twitter = $(el).attr('href') || '';
    });
    $('a[href*="github.com"]').first().each((_, el) => {
      socials.github = $(el).attr('href') || '';
    });
    $('a[href*="facebook.com"]').first().each((_, el) => {
      socials.facebook = $(el).attr('href') || '';
    });
    $('a[href*="instagram.com"]').first().each((_, el) => {
      socials.instagram = $(el).attr('href') || '';
    });
    
    ogData.socials = socials;
    
    return ogData;
  } catch (error) {
    console.log(`OpenGraph fetch failed for ${domain}:`, error.message);
    return null;
  }
};

// ============== OPENCORPORATES ==============
const fetchOpenCorporates = async (companyName, jurisdiction = '') => {
  try {
    const searchUrl = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(companyName)}${jurisdiction ? `&jurisdiction_code=${jurisdiction}` : ''}&per_page=1`;
    const response = await axios.get(searchUrl, { timeout: 5000 });
    
    if (response.data.results.companies && response.data.results.companies.length > 0) {
      const company = response.data.results.companies[0].company;
      return {
        registrationNumber: company.company_number || '',
        jurisdiction: company.jurisdiction_code || '',
        status: company.current_status || '',
        incorporationDate: company.incorporation_date || '',
        companyType: company.company_type || '',
        source: 'opencorporates'
      };
    }
    return null;
  } catch (error) {
    console.log(`OpenCorporates fetch failed for ${companyName}:`, error.message);
    return null;
  }
};

// ============== MAIN AGGREGATOR ==============
const fetchCompanyProfile = async (domain, companyName) => {
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const name = companyName || cleanDomain.split('.')[0];
  
  console.log(`Fetching company profile for: ${cleanDomain} (${name})`);
  
  // Create a timeout wrapper
  const withTimeout = (promise, ms, fallback = null) => {
    const timeout = new Promise((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    });
    return Promise.race([promise, timeout]);
  };
  
  // Parallel fetch from APIs (skip OpenGraph and OpenCorporates for speed)
  const [wikipedia, github] = await Promise.all([
    withTimeout(fetchWikipediaDescription(name), 4000, null),
    withTimeout(fetchGitHubOrg(name), 4000, null)
  ]);
  
  // Aggregate results with priority order
  const profile = {
    domain: cleanDomain,
    name: name,
    logo: getClearbitLogo(cleanDomain),
    description: '',
    shortDescription: '',
    industry: [],
    headquarters: '',
    foundedYear: null,
    website: `https://${cleanDomain}`,
    socials: {},
    techStack: [],
    githubData: {},
    legalInfo: {},
    dataSources: []
  };
  
  // Wikipedia data (highest priority for description)
  if (wikipedia) {
    profile.description = wikipedia.description || profile.description;
    profile.shortDescription = wikipedia.shortDescription || profile.shortDescription;
    profile.dataSources.push({ source: 'wikipedia', fetchedAt: new Date() });
  }
  
  // GitHub data
  if (github) {
    profile.githubData = {
      orgName: github.orgName,
      publicRepos: github.publicRepos,
      topLanguages: github.topLanguages,
      totalStars: github.totalStars,
      followers: github.followers
    };
    profile.techStack = github.topLanguages || [];
    profile.socials.github = `https://github.com/${github.orgName}`;
    if (github.twitter) profile.socials.twitter = `https://twitter.com/${github.twitter}`;
    profile.dataSources.push({ source: 'github', fetchedAt: new Date() });
  }
  
  // Capitalize company name nicely
  if (profile.name) {
    profile.name = profile.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  return profile;
};

module.exports = {
  getClearbitLogo,
  fetchWikipediaDescription,
  fetchWikidataInfo,
  fetchGitHubOrg,
  fetchOpenGraphData,
  fetchOpenCorporates,
  fetchCompanyProfile
};

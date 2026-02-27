const axios = require("axios");
const Job = require("../models/Job");

// Approximate exchange rates (could be fetched dynamically in a real prod app)
const RATES = {
  USD: 84,
  EUR: 91,
  GBP: 106,
  CAD: 61,
  AUD: 55,
};

const convertToINR = (salaryString) => {
  if (!salaryString) return "Not Disclosed";

  // Basic regex to find numbers and currency
  // Very simplified for MVP
  const clean = salaryString.toLowerCase().replace(/,/g, "");
  let amount = 0;

  try {
    const match = clean.match(/(\d+)/);
    if (match) amount = parseInt(match[0]);

    if (clean.includes("usd") || clean.includes("$"))
      return `₹${(amount * RATES.USD).toLocaleString()}`;
    if (clean.includes("eur") || clean.includes("€"))
      return `₹${(amount * RATES.EUR).toLocaleString()}`;
    if (clean.includes("gbp") || clean.includes("£"))
      return `₹${(amount * RATES.GBP).toLocaleString()}`;
  } catch (e) {
    return salaryString;
  }

  return salaryString;
};

const getLogoUrl = (domain) => {
  if (!domain) return "https://via.placeholder.com/50";
  return `https://logo.clearbit.com/${domain}`;
};

const normalizeJob = (raw, source) => {
  let job = {
    role: "",
    company: "",
    companyWebsite: "",
    logo: "",
    location: "",
    salary: "Not Disclosed",
    experience: "Entry Level", // Default for these sources as we filter
    deadline: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
    category: "Engineering",
    tags: [],
    applyUrl: "",
    source: source,
    externalId: "",
    uniqueKey: "",
    publishedAt: new Date(),
    workType: "Full Time",
    responsibilities: [],
    description: "", // We might need this if we want to show full description
  };

  try {
    if (source === "Remotive") {
      job.role = raw.title;
      job.company = raw.company_name;
      job.location = raw.candidate_required_location;
      job.tags = raw.tags || [];
      job.applyUrl = raw.url;
      job.externalId = raw.id.toString();
      job.publishedAt = new Date(raw.publication_date);
      job.companyWebsite = "";
      job.logo = raw.company_logo || getLogoUrl(raw.company_name + ".com"); // Fallback guess
      job.salary = raw.salary ? convertToINR(raw.salary) : "Not Disclosed";
      job.category = raw.category || "Engineering";
      job.description = raw.description || ""; // Remotive provides full HTML
    } else if (source === "RemoteOK") {
      job.role = raw.position;
      job.company = raw.company;
      job.location = raw.location;
      job.tags = raw.tags || [];
      job.applyUrl = raw.apply_url;
      job.externalId = raw.id;
      job.publishedAt = new Date(raw.date);
      job.logo =
        raw.company_logo ||
        getLogoUrl(raw.company.replace(/\s+/g, "") + ".com");
      job.salary = raw.salary_min
        ? `₹${(raw.salary_min * RATES.USD).toLocaleString()} - ₹${(raw.salary_max * RATES.USD).toLocaleString()}`
        : "Not Disclosed";
      job.description = raw.description || ""; // RemoteOK provides HTML/Markdown
    } else if (source === "Adzuna") {
      job.role = raw.title;
      job.company = raw.company.display_name;
      job.location = raw.location.display_name;
      job.applyUrl = raw.redirect_url; // Already resolved in fetcher
      job.externalId = raw.id;
      job.publishedAt = new Date(raw.created);
      job.salary = raw.salary_min
        ? `₹${raw.salary_min.toLocaleString()}`
        : "Not Disclosed";
      job.tags = [raw.category.label];
      // Adzuna doesn't give logos easily, guess domain
      job.logo = getLogoUrl(
        raw.company.display_name.toLowerCase().replace(/[^a-z0-9]/g, "") +
          ".com",
      );
      job.description = raw.description || ""; // Adzuna provides a short summary
    }

    job.uniqueKey =
      `${job.company.toLowerCase().trim()}_${job.role.toLowerCase().trim()}`.replace(
        /[^a-z0-9_]/g,
        "",
      );

    // Map categories
    const cat = job.category.toLowerCase();
    if (
      cat.includes("dev") ||
      cat.includes("engineer") ||
      cat.includes("software")
    )
      job.category = "Engineering";
    else if (cat.includes("design") || cat.includes("ux"))
      job.category = "Design";
    else if (cat.includes("marketing") || cat.includes("sales"))
      job.category = "Marketing";
    else if (cat.includes("product")) job.category = "Product";
    else if (cat.includes("data")) job.category = "Data Science";
    else job.category = "Other";

    return job;
  } catch (e) {
    console.error(`Error normalizing ${source} job:`, e.message);
    return null;
  }
};

const fetchRemotiveJobs = async () => {
  try {
    const res = await axios.get(
      "https://remotive.com/api/remote-jobs?category=software-dev&limit=500",
    );
    const jobs = res.data.jobs || [];
    console.log(`Remotive: Fetched ${jobs.length} jobs`);
    return jobs
      .map((j) => normalizeJob(j, "Remotive"))
      .filter((j) => j !== null);
  } catch (e) {
    console.error("Remotive Fetch Error:", e.message);
    return [];
  }
};

const fetchRemoteOKJobs = async () => {
  try {
    const res = await axios.get("https://remoteok.com/api");
    const jobs = Array.isArray(res.data) ? res.data.slice(1) : []; // First item is legal info
    console.log(`RemoteOK: Fetched ${jobs.length} jobs`);
    return jobs
      .filter((j) => j.position) // Only need valid positions
      .map((j) => normalizeJob(j, "RemoteOK"))
      .filter((j) => j !== null);
  } catch (e) {
    console.error("RemoteOK Fetch Error:", e.message);
    return [];
  }
};

const fetchAdzunaJobs = async () => {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    console.log("Skipping Adzuna: Missing API Credentials");
    return [];
  }

  const allAdzunaJobs = [];
  const MAX_PAGES = 5; // Fetch 5 pages

  try {
    for (let p = 1; p <= MAX_PAGES; p++) {
      const res = await axios.get(
        `https://api.adzuna.com/v1/api/jobs/in/search/${p}`,
        {
          params: {
            app_id: process.env.ADZUNA_APP_ID,
            app_key: process.env.ADZUNA_APP_KEY,
            what: "software developer", // Broader search
            results_per_page: 50, // Max results per page
            "content-type": "application/json",
          },
        },
      );

      const pageJobsRaw = res.data.results || [];

      for (const raw of pageJobsRaw) {
        // Use original URL directly (no Puppeteer needed)
        const normalized = normalizeJob(raw, "Adzuna");
        if (normalized) allAdzunaJobs.push(normalized);
      }

      if (pageJobsRaw.length === 0) break;
    }

    console.log(`Adzuna: Fetched ${allAdzunaJobs.length} jobs`);
    return allAdzunaJobs;
  } catch (e) {
    console.error("Adzuna Fetch Error:", e.message);
    return [];
  }
};

const syncJobs = async () => {
  console.log("Starting Job Sync...");

  const [remotive, remoteOk, adzuna] = await Promise.all([
    fetchRemotiveJobs(),
    fetchRemoteOKJobs(),
    fetchAdzunaJobs(),
  ]);

  const allJobs = [...remotive, ...remoteOk, ...adzuna];
  let newCount = 0;
  let updatedCount = 0;

  for (const job of allJobs) {
    try {
      const result = await Job.updateOne(
        { uniqueKey: job.uniqueKey },
        { $set: job },
        { upsert: true },
      );

      if (result.upsertedCount > 0) newCount++;
      else if (result.modifiedCount > 0) updatedCount++;
    } catch (e) {
      console.error(`Failed to save job ${job.uniqueKey}:`, e.message);
    }
  }

  console.log(
    `Job Sync Complete. Inserted: ${newCount}, Updated: ${updatedCount}`,
  );
  return { inserted: newCount, updated: updatedCount, total: allJobs.length };
};

module.exports = { syncJobs };

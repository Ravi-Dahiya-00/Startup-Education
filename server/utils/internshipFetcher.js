const axios = require("axios");
const Internship = require("../models/Internship");

// Approximate exchange rates
const RATES = {
  USD: 84,
  EUR: 91,
  GBP: 106,
  CAD: 61,
  AUD: 55,
};

const convertToINR = (salaryString) => {
  if (!salaryString) return "Not Disclosed";

  const clean = salaryString.toLowerCase().replace(/,/g, "");
  let amount = 0;

  try {
    const match = clean.match(/(\d+)/);
    if (match) amount = parseInt(match[0]);

    if (clean.includes("usd") || clean.includes("$"))
      return `₹${(amount * RATES.USD).toLocaleString()}/month`;
    if (clean.includes("eur") || clean.includes("€"))
      return `₹${(amount * RATES.EUR).toLocaleString()}/month`;
    if (clean.includes("gbp") || clean.includes("£"))
      return `₹${(amount * RATES.GBP).toLocaleString()}/month`;
  } catch (e) {
    return salaryString;
  }
  return salaryString;
};

const getLogoUrl = (domain) => {
  if (!domain) return "https://via.placeholder.com/50";
  return `https://logo.clearbit.com/${domain}`;
};

const normalizeInternship = (raw, source) => {
  let internship = {
    role: "",
    company: "",
    companyWebsite: "",
    logo: "",
    location: "",
    stipend: "Unpaid",
    duration: "3-6 Months", // Default duration guess
    deadline: new Date(+new Date() + 30 * 24 * 60 * 60 * 1000),
    category: "Engineering",
    tags: [],
    // applyUrl: "", // Schema doesn't strictly have applyUrl but let's see if we can add it or map to description
    // Using existing fields from jobFetcher pattern, but mapping to Internship schema:
    workType: "Full Time",
    workingDays: "5 Days/Week",
    userType: "College Student",
    responsibilities: [],
    skills: [],
    organizer: {
      name: "HR",
      email: "hr@company.com",
    },
    createdAt: new Date(),
  };

  // Internship Schema doesn't have applyUrl explicitly in the version I saw,
  // but it's crucial. I'll check if I can add it to description or if I should add it to schema.
  // The 'Job' schema has applyUrl. 'Internship' schema might rely on organizer email?
  // Actually, checking the dummy data, there's no applyUrl in Internship schema explicitly shown in seedInternships.js?
  // Wait, let's verify Schema again. Seed data has role, company, location, stipend, etc.
  // Ah, the Schema has: role, company, companyWebsite, logo, location, stipend, duration, deadline, category, tags.
  // It does NOT have applyUrl. I should probably add it to Schema too if I want it to be useful.
  // For now, I'll append it to description or "companyWebsite" if appropriate?
  // Let's assume for now we want to add applyUrl to Schema. But I can't easily change schema without potentially breaking frontend if it expects something else.
  // I will check if companyWebsite is used for applying.

  try {
    if (source === "Remotive") {
      internship.role = raw.title;
      internship.company = raw.company_name;
      internship.location = raw.candidate_required_location;
      internship.tags = raw.tags || [];
      internship.companyWebsite = raw.url; // Use apply link as website
      internship.logo =
        raw.company_logo || getLogoUrl(raw.company_name + ".com");
      internship.stipend = raw.salary
        ? convertToINR(raw.salary)
        : "Not Disclosed";
      internship.category = "Engineering"; // Remotive is mostly soft dev
    } else if (source === "RemoteOK") {
      internship.role = raw.position;
      internship.company = raw.company;
      internship.location = raw.location;
      internship.tags = raw.tags || [];
      internship.companyWebsite = raw.apply_url;
      internship.logo =
        raw.company_logo ||
        getLogoUrl(raw.company.replace(/\s+/g, "") + ".com");
      internship.stipend = raw.salary_min
        ? `₹${(raw.salary_min * RATES.USD).toLocaleString()}/month`
        : "Not Disclosed";
    } else if (source === "Adzuna") {
      internship.role = raw.title;
      internship.company = raw.company.display_name;
      internship.location = raw.location.display_name;
      internship.companyWebsite = raw.redirect_url;
      internship.stipend = raw.salary_min
        ? `₹${raw.salary_min.toLocaleString()}/month`
        : "Not Disclosed";
      internship.tags = [raw.category.label];
      internship.logo = getLogoUrl(
        raw.company.display_name.toLowerCase().replace(/[^a-z0-9]/g, "") +
          ".com",
      );
    }

    // Filter for standard internship keywords if not guaranteed by fetcher
    const title = internship.role.toLowerCase();
    if (
      !title.includes("intern") &&
      !title.includes("trainee") &&
      !title.includes("apprentice")
    ) {
      return null; // Strict filter
    }

    return internship;
  } catch (e) {
    console.error(`Error normalizing ${source} internship:`, e.message);
    return null;
  }
};

const fetchRemotiveInternships = async () => {
  try {
    const res = await axios.get(
      "https://remotive.com/api/remote-jobs?category=software-dev&limit=500",
    );
    const jobs = res.data.jobs || [];
    // Remotive doesn't have strict internship category, so we filter heavily
    return jobs
      .filter((j) => j.title.toLowerCase().includes("intern"))
      .map((j) => normalizeInternship(j, "Remotive"))
      .filter((j) => j !== null);
  } catch (e) {
    console.error("Remotive Internship Fetch Error:", e.message);
    return [];
  }
};

const fetchRemoteOKInternships = async () => {
  try {
    const res = await axios.get("https://remoteok.com/api");
    const jobs = Array.isArray(res.data) ? res.data.slice(1) : [];
    return jobs
      .filter((j) => j.position && j.position.toLowerCase().includes("intern"))
      .map((j) => normalizeInternship(j, "RemoteOK"))
      .filter((j) => j !== null);
  } catch (e) {
    console.error("RemoteOK Internship Fetch Error:", e.message);
    return [];
  }
};

const fetchAdzunaInternships = async () => {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) return [];

  const allInternships = [];
  const MAX_PAGES = 3;

  try {
    for (let p = 1; p <= MAX_PAGES; p++) {
      const res = await axios.get(
        `https://api.adzuna.com/v1/api/jobs/in/search/${p}`,
        {
          params: {
            app_id: process.env.ADZUNA_APP_ID,
            app_key: process.env.ADZUNA_APP_KEY,
            what: "internship software", // Specific search
            results_per_page: 50,
            "content-type": "application/json",
          },
        },
      );

      const pageJobs = res.data.results || [];
      if (pageJobs.length === 0) break;

      for (const raw of pageJobs) {
        const normalized = normalizeInternship(raw, "Adzuna");
        if (normalized) allInternships.push(normalized);
      }
    }
    return allInternships;
  } catch (e) {
    console.error("Adzuna Internship Fetch Error:", e.message);
    return [];
  }
};

const syncInternships = async () => {
  console.log("Starting Internship Sync...");
  const [remotive, remoteOk, adzuna] = await Promise.all([
    fetchRemotiveInternships(),
    fetchRemoteOKInternships(),
    fetchAdzunaInternships(),
  ]);

  const allInternships = [...remotive, ...remoteOk, ...adzuna];
  let count = 0;

  // For internships, we might want to clear old ones or upsert.
  // Since uniqueKey isn't strictly defined in Schema, we'll try to dedup by company+role.
  // Ideally we update Schema to have uniqueKey, but for now let's just insert new ones
  // or maybe check if exists.

  // To avoid duplicates effectively without uniqueKey, let's look them up.

  for (const intern of allInternships) {
    const exists = await Internship.findOne({
      role: intern.role,
      company: intern.company,
    });

    if (!exists) {
      await Internship.create(intern);
      count++;
    }
  }

  console.log(`Internship Sync Complete. Added: ${count}`);
  return { added: count, totalFound: allInternships.length };
};

module.exports = { syncInternships };

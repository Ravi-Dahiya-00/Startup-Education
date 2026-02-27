import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Bookmark,
  Share2,
  Heart,
  Users,
  Navigation,
  Filter,
  X,
  TrendingUp,
  Building2,
  Calendar,
  Award,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserLocation } from "../../hooks/useUserLocation";
import { POPULAR_SKILLS, searchSkills } from "../../data/skills";
import { TOP_TECH_CITIES, searchIndianCities } from "../../data/locations";
import { useLocationAutocomplete } from "../../hooks/useLocationAutocomplete";
import ShareModal from "../../components/ShareModal";
import CompanyProfileModal from "../../components/CompanyProfileModal";
import API_URL from "../../config/api";

const WORK_TYPES = ["Full Time", "Part Time", "Contract", "Freelance"];
const WORKING_DAYS = ["4 Days/Week", "5 Days/Week", "6 Days/Week", "Flexible"];
const USER_TYPES = ["College Student", "Professional", "Fresher"];
const DATE_RANGES = [
  { label: "Past 24 hours", value: "24h" },
  { label: "Past 3 days", value: "3d" },
  { label: "Past week", value: "7d" },
  { label: "Past month", value: "30d" },
];
const DOMAINS = [
  "Engineering",
  "Design",
  "Marketing",
  "Product",
  "Sales",
  "Data Science",
  "Content",
  "Finance",
];

const getPostedString = (dateString) => {
  if (!dateString) return "Posted recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

  if (diffHours < 24) return `Posted ${diffHours} hours ago`;
  if (diffDays === 1) return "Posted 1 day ago";
  return `Posted ${diffDays} days ago`;
};

const Internships = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [skillsSearch, setSkillsSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "Live",
    type: [], // Remote/In-Office
    workType: [], // Full Time/Part Time
    workingDays: [],
    datePosted: "",
    userType: [],
    domain: [],
    location: [],
    skills: [],
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("internships-theme") || "dark";
  });

  const {
    detectLocation,
    location: userLocation,
    loading: locLoading,
  } = useUserLocation();
  const {
    query: locationQuery,
    setQuery: setLocationQuery,
    suggestions: locationSuggestions,
    loading: locationApiLoading,
    error: locationError,
    clearSuggestions,
  } = useLocationAutocomplete();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [itemToShare, setItemToShare] = useState(null);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState({
    domain: "",
    name: "",
  });

  const openCompanyProfile = (company, logo) => {
    // Extract domain from logo URL (Clearbit format: logo.clearbit.com/domain.com)
    let domain = "";
    if (logo && logo.includes("logo.clearbit.com/")) {
      domain = logo.split("logo.clearbit.com/")[1];
    } else if (logo && logo.includes(".")) {
      // Try to extract domain from other logo URLs
      try {
        const url = new URL(logo);
        if (
          url.hostname.includes("via.placeholder.com") ||
          url.hostname.includes("randomuser.me")
        ) {
          throw new Error("Placeholder image");
        }
        domain = url.hostname.replace("www.", "");
      } catch {
        domain = company.toLowerCase().replace(/\s+/g, "") + ".com";
      }
    } else {
      domain = company.toLowerCase().replace(/\s+/g, "") + ".com";
    }
    setSelectedCompany({ domain, name: company });
    setCompanyModalOpen(true);
  };

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/internships`);

      if (!response.ok) {
        throw new Error("Failed to fetch internships");
      }

      const data = await response.json();

      // Enrich data with mock fields if missing (for UI demonstration)
      const enrichedData = data.map((item) => ({
        ...item,
        workType:
          item.workType ||
          WORK_TYPES[Math.floor(Math.random() * WORK_TYPES.length)],
        workingDays:
          item.workingDays ||
          WORKING_DAYS[Math.floor(Math.random() * WORKING_DAYS.length)],
        userType:
          item.userType ||
          USER_TYPES[Math.floor(Math.random() * USER_TYPES.length)],
        postedAt:
          item.postedAt ||
          new Date(
            Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000),
          ).toISOString(), // Random date in last 10 days
        domain:
          item.domain || DOMAINS[Math.floor(Math.random() * DOMAINS.length)],
      }));

      setInternships(enrichedData);
    } catch (error) {
      console.error("Error fetching internships:", error);
      setError("Failed to load internships. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    localStorage.setItem("internships-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (userLocation?.city) {
      if (!filters.location.includes(userLocation.city)) {
        setFilters((prev) => ({
          ...prev,
          location: [...prev.location, userLocation.city],
        }));
      }
    }
  }, [userLocation]);

  const handleFilterChange = (category, value) => {
    if (category === "status" || category === "datePosted") {
      setFilters((prev) => ({
        ...prev,
        [category]: value === prev[category] ? "" : value,
      }));
    } else {
      setFilters((prev) => {
        const current = prev[category];
        if (current.includes(value)) {
          return {
            ...prev,
            [category]: current.filter((item) => item !== value),
          };
        } else {
          return { ...prev, [category]: [...current, value] };
        }
      });
    }
  };

  const handleDetectLocation = async () => {
    await detectLocation();
  };

  const toggleSave = (id) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredInternships = internships.filter((internship) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      internship.role.toLowerCase().includes(searchLower) ||
      internship.company.toLowerCase().includes(searchLower) ||
      internship.location.toLowerCase().includes(searchLower) ||
      internship.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;

    // Type Filter (Remote/In Office)
    if (filters.type.length > 0) {
      const isRemote = internship.location.toLowerCase().includes("remote");
      const typeMatch = filters.type.some((t) => {
        if (t === "Remote") return isRemote;
        if (t === "In Office") return !isRemote;
        return false;
      });
      if (!typeMatch) return false;
    }

    // Work Type Filter
    if (filters.workType.length > 0) {
      const match = filters.workType.some(
        (type) =>
          internship.tags.some(
            (tag) => tag.toLowerCase() === type.toLowerCase(),
          ) ||
          (internship.type &&
            internship.type.toLowerCase() === type.toLowerCase()),
      );
      if (!match) return false;
    }

    // Working Days Filter
    if (filters.workingDays.length > 0) {
      const match = filters.workingDays.some((days) =>
        internship.tags.some((tag) =>
          tag.toLowerCase().includes(days.toLowerCase()),
        ),
      );
      if (!match) return false;
    }

    // User Type Filter
    if (filters.userType.length > 0) {
      const match = filters.userType.some((type) =>
        internship.tags.some((tag) => tag.toLowerCase() === type.toLowerCase()),
      );
      if (!match) return false;
    }

    // Domain Filter
    if (filters.domain.length > 0) {
      const match = filters.domain.some(
        (domain) =>
          internship.tags.some(
            (tag) => tag.toLowerCase() === domain.toLowerCase(),
          ) ||
          (internship.domain &&
            internship.domain.toLowerCase() === domain.toLowerCase()),
      );
      if (!match) return false;
    }

    // Date Posted Filter
    if (filters.datePosted) {
      // Assuming internship.postedAt is a date string or timestamp
      // If not available, we skip this filter or rely on tags like "Posted 2 days ago" parsing
      // For now, let's assume a 'postedAt' field exists or we parse the 'posted' string
      const postedDate = new Date(internship.postedAt || Date.now()); // Fallback to now if missing
      const now = new Date();
      const diffTime = Math.abs(now - postedDate);
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.datePosted) {
        case "24h":
          if (diffHours > 24) return false;
          break;
        case "3d":
          if (diffDays > 3) return false;
          break;
        case "7d":
          if (diffDays > 7) return false;
          break;
        case "30d":
          if (diffDays > 30) return false;
          break;
      }
    }

    if (filters.location.length > 0) {
      const locationMatch = filters.location.some((loc) =>
        internship.location.toLowerCase().includes(loc.toLowerCase()),
      );
      if (!locationMatch) return false;
    }

    // Skills Filter
    if (filters.skills.length > 0) {
      const skillsMatch = filters.skills.some((skill) =>
        internship.tags.some((tag) =>
          tag.toLowerCase().includes(skill.toLowerCase()),
        ),
      );
      if (!skillsMatch) return false;
    }

    return true;
  });

  const featuredCompanies = [
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
      count: 12,
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
      count: 8,
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      count: 15,
    },
  ];

  if (loading) {
    return (
      <div className="internships-loading">
        <div className="loading-spinner"></div>
        <p>Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="internships-error"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: "1rem",
          color: "var(--page-text-muted)",
        }}
      >
        <div style={{ fontSize: "3rem" }}>⚠️</div>
        <h3>{error}</h3>
        <button
          onClick={fetchInternships}
          style={{
            padding: "0.5rem 1.5rem",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`internships-page ${theme}-theme`}>
      {/* Premium Header */}
      <div className="internships-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1>All Internships</h1>
            <span className="count-badge">{filteredInternships.length}</span>
          </div>
          <div className="header-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by role, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="internships-layout">
        {/* Premium Filters Sidebar */}
        <aside className="filters-panel">
          <div className="filters-header">
            <div className="filters-title">
              <Filter size={18} />
              <span>Filters</span>
            </div>
            {(filters.type.length > 0 ||
              filters.location.length > 0 ||
              filters.skills.length > 0 ||
              filters.workType.length > 0 ||
              filters.workingDays.length > 0 ||
              filters.datePosted ||
              filters.userType.length > 0 ||
              filters.domain.length > 0) && (
              <button
                className="clear-all-btn"
                onClick={() =>
                  setFilters({
                    status: "Live",
                    type: [],
                    workType: [],
                    workingDays: [],
                    datePosted: "",
                    userType: [],
                    domain: [],
                    location: [],
                    skills: [],
                  })
                }
              >
                Clear All
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <div className="pill-group">
              {["Live", "Expired", "Closed"].map((status) => (
                <button
                  key={status}
                  className={`pill ${filters.status === status ? "active" : ""}`}
                  onClick={() => handleFilterChange("status", status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Type</label>
            <div className="pill-group">
              {["In Office", "Remote", "Hybrid"].map((type) => (
                <button
                  key={type}
                  className={`pill ${filters.type.includes(type) ? "active" : ""}`}
                  onClick={() => handleFilterChange("type", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Work Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Work Type</label>
            <div className="pill-group">
              {WORK_TYPES.map((type) => (
                <button
                  key={type}
                  className={`pill ${filters.workType.includes(type) ? "active" : ""}`}
                  onClick={() => handleFilterChange("workType", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Working Days Filter */}
          <div className="filter-group">
            <label className="filter-label">Working Days</label>
            <div className="pill-group">
              {WORKING_DAYS.map((days) => (
                <button
                  key={days}
                  className={`pill ${filters.workingDays.includes(days) ? "active" : ""}`}
                  onClick={() => handleFilterChange("workingDays", days)}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>

          {/* Date Posted Filter */}
          <div className="filter-group">
            <label className="filter-label">Date Posted</label>
            <div className="pill-group">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  className={`pill ${filters.datePosted === range.value ? "active" : ""}`}
                  onClick={() => handleFilterChange("datePosted", range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Type Filter */}
          <div className="filter-group">
            <label className="filter-label">User Type</label>
            <div className="pill-group">
              {USER_TYPES.map((type) => (
                <button
                  key={type}
                  className={`pill ${filters.userType.includes(type) ? "active" : ""}`}
                  onClick={() => handleFilterChange("userType", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Filter */}
          <div className="filter-group">
            <label className="filter-label">Domain</label>
            <div className="pill-group">
              {DOMAINS.map((domain) => (
                <button
                  key={domain}
                  className={`pill ${filters.domain.includes(domain) ? "active" : ""}`}
                  onClick={() => handleFilterChange("domain", domain)}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <div className="filter-label-row">
              <label className="filter-label">
                Location ({filters.location.length} selected)
              </label>
              <button
                className="detect-location-btn"
                onClick={handleDetectLocation}
              >
                {locLoading ? (
                  <span className="detecting">Locating...</span>
                ) : (
                  <>
                    <Navigation size={14} />
                    <span>Near Me</span>
                  </>
                )}
              </button>
            </div>
            <div className="location-search-box">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search cities across India..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="location-search-input"
              />
              {locationQuery && (
                <button
                  onClick={() => {
                    setLocationQuery("");
                    clearSuggestions();
                  }}
                  className="clear-search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {locationApiLoading && (
              <div className="api-loading">
                <div className="loading-spinner-small"></div>
                <span>Searching...</span>
              </div>
            )}
            {locationError && (
              <div className="api-error">
                <span>⚠️ Using offline list</span>
              </div>
            )}
            <div className="location-chips-grid">
              {locationSuggestions.length > 0
                ? // Show API suggestions when available
                  locationSuggestions.map((location, idx) => {
                    const cityName =
                      location.city || location.displayName.split(",")[0];
                    return (
                      <button
                        key={idx}
                        className={`location-chip ${filters.location.includes(cityName) ? "active" : ""}`}
                        onClick={() => handleFilterChange("location", cityName)}
                      >
                        <MapPin size={12} />
                        <span className="location-name">
                          {location.city
                            ? `${location.city}, ${location.state}`
                            : cityName}
                        </span>
                        {filters.location.includes(cityName) && (
                          <X
                            size={12}
                            className="remove-location"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFilterChange("location", cityName);
                            }}
                          />
                        )}
                      </button>
                    );
                  })
                : // Show top tech cities when no search or as fallback
                  TOP_TECH_CITIES.map((loc) => (
                    <button
                      key={loc}
                      className={`location-chip ${filters.location.includes(loc) ? "active" : ""}`}
                      onClick={() => handleFilterChange("location", loc)}
                    >
                      <MapPin size={12} />
                      <span className="location-name">{loc}</span>
                      {filters.location.includes(loc) && (
                        <X
                          size={12}
                          className="remove-location"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterChange("location", loc);
                          }}
                        />
                      )}
                    </button>
                  ))}
            </div>
          </div>

          {/* Skills Filter */}
          <div className="filter-group">
            <label className="filter-label">
              Skills ({filters.skills.length} selected)
            </label>
            <div className="skills-search-box">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search skills..."
                value={skillsSearch}
                onChange={(e) => setSkillsSearch(e.target.value)}
                className="skills-search-input"
              />
              {skillsSearch && (
                <button
                  onClick={() => setSkillsSearch("")}
                  className="clear-search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="skills-grid">
              {(skillsSearch
                ? searchSkills(skillsSearch).slice(0, 30)
                : POPULAR_SKILLS
              ).map((skill) => (
                <button
                  key={skill}
                  className={`skill-chip ${filters.skills.includes(skill) ? "active" : ""}`}
                  onClick={() => handleFilterChange("skills", skill)}
                >
                  <span className="skill-name">{skill}</span>
                  {filters.skills.includes(skill) && (
                    <X
                      size={12}
                      className="remove-skill"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange("skills", skill);
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
            {skillsSearch && searchSkills(skillsSearch).length > 30 && (
              <div className="more-results">
                +{searchSkills(skillsSearch).length - 30} more results
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="internships-grid">
            <AnimatePresence>
              {filteredInternships.map((internship, index) => (
                <motion.div
                  key={internship._id}
                  className="internship-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="card-header">
                    <div className="company-info">
                      <div className="company-logo">
                        <img
                          src={internship.logo}
                          alt={internship.company}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="logo-fallback">
                          <Briefcase size={24} />
                        </div>
                      </div>
                      <div className="company-details">
                        <h3
                          className="role-title"
                          onClick={() =>
                            navigate(`/internships/${internship._id}`, {
                              state: { internship },
                            })
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {internship.role}
                        </h3>
                        <p
                          className="company-name clickable"
                          onClick={() =>
                            openCompanyProfile(
                              internship.company,
                              internship.logo,
                            )
                          }
                        >
                          {internship.company}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`save-btn ${savedJobs.has(internship._id) ? "saved" : ""}`}
                      onClick={() => toggleSave(internship._id)}
                    >
                      <Bookmark size={20} />
                    </button>
                  </div>

                  <div className="card-meta">
                    <div className="meta-item">
                      <Briefcase size={16} />
                      <span>{internship.workType}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{internship.workingDays}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{internship.location}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{internship.duration}</span>
                    </div>
                  </div>

                  <div className="card-tags">
                    {internship.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                    {internship.tags.length > 4 && (
                      <span className="tag more">
                        +{internship.tags.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="card-footer">
                    <div className="footer-left">
                      <div className="badge-group">
                        <span className="badge">{internship.userType}</span>
                        <span className="badge">{internship.domain}</span>
                      </div>
                      <div className="stipend">
                        <DollarSign size={16} />
                        <span>{internship.stipend}</span>
                      </div>
                    </div>
                    <div className="footer-right">
                      <button
                        className="share-btn"
                        onClick={() => {
                          setItemToShare(internship);
                          setShareModalOpen(true);
                        }}
                      >
                        <Share2 size={18} />
                      </button>
                      <button
                        className="apply-btn"
                        onClick={() =>
                          navigate(`/internships/${internship._id}`, {
                            state: { internship },
                          })
                        }
                      >
                        Apply Now
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="card-bottom-meta">
                    <span className="posted">
                      {getPostedString(internship.postedAt)}
                    </span>
                    <span className="deadline">10 days left</span>
                    <span className="applied">
                      <Users size={14} />
                      120 Applied
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>

        {/* Premium Featured Panel */}
        <aside className="featured-panel">
          <div className="featured-header">
            <TrendingUp size={18} />
            <h3>Trending Companies</h3>
          </div>

          <div className="featured-companies">
            {featuredCompanies.map((company) => (
              <div key={company.name} className="featured-company">
                <img src={company.logo} alt={company.name} />
                <div className="company-meta">
                  <h4>{company.name}</h4>
                  <p>{company.count} open positions</p>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-card">
            <div className="stat-item">
              <div className="stat-icon">
                <Building2 size={20} />
              </div>
              <div className="stat-info">
                <h4>500+</h4>
                <p>Active Companies</p>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Award size={20} />
              </div>
              <div className="stat-info">
                <h4>1000+</h4>
                <p>Opportunities</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <ShareModal
        item={itemToShare}
        type="internship"
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <CompanyProfileModal
        domain={selectedCompany.domain}
        companyName={selectedCompany.name}
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
      />

      <style>{`
        /* ===== THEME SYSTEM ===== */
        
        .internships-page {
          min-height: 100vh;
          font-family: var(--font-main);
          padding-top: 70px;
          transition: background-color 0.3s ease;
        }

        /* Dark Theme (Default) - Enhanced for better readability */
        .dark-theme {
          background: linear-gradient(135deg, #0f172a 0%, #1a1f35 100%);
          --page-bg: #0f172a;
          --page-surface: #1e293b;
          --page-surface-hover: #334155;
          --page-text-main: #f1f5f9;
          --page-text-muted: #cbd5e1;
          --page-border: #3b4861;
          --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        /* Light Theme */
        .light-theme {
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
          --page-bg: #ffffff;
          --page-surface: #ffffff;
          --page-surface-hover: #f9fafb;
          --page-text-main: #111827;
          --page-text-muted: #6b7280;
          --page-border: #e5e7eb;
          --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* Theme Toggle Button */
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--primary);
          padding: 0.625rem 1.25rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .theme-toggle-btn svg {
          flex-shrink: 0;
        }

        /* Loading State */
        .internships-loading {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(99, 102, 241, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Premium Header */
        .internships-header {
          background: var(--page-surface);
          padding: 2rem 3rem;
          border-bottom: 1px solid var(--page-border);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .header-title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-title-section h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--page-text-main);
          margin: 0;
          letter-spacing: -0.5px;
        }

        .count-badge {
          background: rgba(99, 102, 241, 0.2);
          backdrop-filter: blur(10px);
          color: var(--primary);
          padding: 0.375rem 0.875rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .header-search {
          position: relative;
          max-width: 500px;
          flex: 1;
        }

        .header-search svg {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--page-text-muted);
          z-index: 1;
        }

        .header-search input {
          width: 100%;
          padding: 0.875rem 1.25rem 0.875rem 3.25rem;
          border: 1px solid var(--page-border);
          border-radius: 12px;
          font-size: 0.9375rem;
          background: var(--page-bg);
          color: var(--page-text-main);
          transition: all 0.2s ease;
        }

        .header-search input::placeholder {
          color: var(--page-text-muted);
        }

        .header-search input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        /* Main Layout */
        .internships-layout {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 3rem;
          display: grid;
          grid-template-columns: 280px 1fr 320px;
          gap: 2rem;
          align-items: start;
        }

        /* ===== DARK FILTERS PANEL ===== */
        .filters-panel {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.5rem;
          position: sticky;
          top: 90px;
          max-height: calc(100vh - 110px);
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
        }

        .filters-panel::-webkit-scrollbar {
          width: 6px;
        }

        .filters-panel::-webkit-scrollbar-track {
          background: var(--page-bg);
          border-radius: 3px;
        }

        .filters-panel::-webkit-scrollbar-thumb {
          background: var(--page-border);
          border-radius: 3px;
        }

        .filters-panel::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }

        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--page-border);
        }

        .filters-title {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--page-text-main);
        }

        .filters-title svg {
          color: var(--primary);
        }

        .clear-all-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .clear-all-btn:hover {
          background: rgba(99, 102, 241, 0.1);
        }

        .filter-group {
          margin-bottom: 1.75rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--page-text-muted);
          margin-bottom: 0.75rem;
        }

        .filter-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .detect-location-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .detect-location-btn:hover {
          background: rgba(99, 102, 241, 0.1);
        }

        .detecting {
          color: var(--page-text-muted);
        }

        .pill-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pill {
          background: var(--page-bg);
          border: 1.5px solid var(--page-border);
          color: var(--page-text-muted);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pill:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }

        .pill.active {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--page-text-muted);
          transition: color 0.2s ease;
        }

        .checkbox-label:hover {
          color: var(--page-text-main);
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          border: 2px solid var(--page-border);
          border-radius: 4px;
          cursor: pointer;
          accent-color: var(--primary);
        }

        /* Location Search & Chips */
        .location-search-box {
          position: relative;
          margin-bottom: 0.75rem;
        }

        .location-search-box svg:first-child {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--page-text-muted);
          pointer-events: none;
          z-index: 1;
        }

        .location-search-input {
          width: 100%;
          padding: 0.5rem 2.25rem 0.5rem 2.25rem;
          border: 1px solid var(--page-border);
          border-radius: 8px;
          font-size: 0.8125rem;
          background: var(--page-bg);
          color: var(--page-text-main);
          transition: all 0.2s ease;
        }

        .location-search-input::placeholder {
          color: var(--page-text-muted);
        }

        .location-search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .location-chips-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 0.5rem;
          overscroll-behavior: contain;
        }

        .location-chips-grid::-webkit-scrollbar {
          width: 4px;
        }

        .location-chips-grid::-webkit-scrollbar-track {
          background: var(--page-bg);
          border-radius: 4px;
        }

        .location-chips-grid::-webkit-scrollbar-thumb {
          background: var(--page-border);
          border-radius: 4px;
        }

        .location-chips-grid::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }

        .location-chip {
          background: var(--page-bg);
          border: 1px solid var(--page-border);
          color: var(--page-text-muted);
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .location-chip svg:first-child {
          flex-shrink: 0;
        }

        .location-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
          transform: translateY(-1px);
        }

        .location-chip.active {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-color: #10b981;
          color: white;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
        }

        .location-name {
          flex: 1;
        }

        .remove-location {
          margin-left: 0.25rem;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s ease;
          flex-shrink: 0;
        }

        .remove-location:hover {
          opacity: 1;
        }

        /* API Loading & Error States */
        .api-loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 6px;
          margin-bottom: 0.75rem;
          font-size: 0.8125rem;
          color: var(--page-text-muted);
        }

        .loading-spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(99, 102, 241, 0.2);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .api-error {
          padding: 0.5rem;
          background: rgba(245, 158, 11, 0.1);
          border-radius: 6px;
          margin-bottom: 0.75rem;
          font-size: 0.75rem;
          color: #f59e0b;
          text-align: center;
        }

        /* ===== MAIN CONTENT ===== */
        .main-content {
          min-height: 600px;
        }

        .internships-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Skills Filter Chips */
        .skills-search-box {
          position: relative;
          margin-bottom: 0.75rem;
        }

        .skills-search-box svg:first-child {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--page-text-muted);
          pointer-events: none;
          z-index: 1;
        }

        .skills-search-input {
          width: 100%;
          padding: 0.5rem 2.25rem 0.5rem 2.25rem;
          border: 1px solid var(--page-border);
          border-radius: 8px;
          font-size: 0.8125rem;
          background: var(--page-bg);
          color: var(--page-text-main);
          transition: all 0.2s ease;
        }

        .skills-search-input::placeholder {
          color: var(--page-text-muted);
        }

        .skills-search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--page-text-muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .clear-search:hover {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
        }

        .skills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 0.5rem;
          overscroll-behavior: contain;
        }

        .skills-grid::-webkit-scrollbar {
          width: 4px;
        }

        .skills-grid::-webkit-scrollbar-track {
          background: var(--page-bg);
          border-radius: 4px;
        }

        .skills-grid::-webkit-scrollbar-thumb {
          background: var(--page-border);
          border-radius: 4px;
        }

        .skills-grid::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }

        .skill-chip {
          background: var(--page-bg);
          border: 1px solid var(--page-border);
          color: var(--page-text-muted);
          padding: 0.4rem 0.875rem;
          border-radius: 20px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .skill-chip:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
          transform: translateY(-1px);
        }

        .skill-chip.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
        }

        .skill-name {
          flex: 1;
        }

        .remove-skill {
          margin-left: 0.25rem;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s ease;
          flex-shrink: 0;
        }

        .remove-skill:hover {
          opacity: 1;
        }

        .more-results {
          text-align: center;
          font-size: 0.75rem;
          color: var(--page-text-muted);
          padding: 0.5rem;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 6px;
          margin-top: 0.5rem;
        }

        /* Improve scroll performance */
        .skills-grid,
        .location-chips-grid {
          will-change: scroll-position;
          -webkit-overflow-scrolling: touch;
        }

        /* ===== DARK INTERNSHIP CARDS ===== */
        .internship-card {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--card-shadow);
        }

        .internship-card:hover {
          border-color: var(--primary);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.25);
          transform: translateY(-2px);
          background: var(--page-surface-hover);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .company-info {
          display: flex;
          gap: 1rem;
          flex: 1;
        }

        .company-logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          overflow: hidden;
          background: var(--page-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--page-border);
        }

        .company-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 8px;
        }

        .logo-fallback {
          display: none;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .company-details {
          flex: 1;
        }

        .role-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--page-text-main);
          margin: 0 0 0.375rem 0;
          line-height: 1.3;
          letter-spacing: -0.3px;
        }

        .company-name {
          font-size: 0.9375rem;
          color: var(--page-text-muted);
          margin: 0;
          font-weight: 500;
        }

        .company-name.clickable {
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .company-name.clickable:hover {
          color: var(--primary);
          text-decoration: underline;
        }

        .save-btn {
          background: var(--page-bg);
          border: 1px solid var(--page-border);
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--page-text-muted);
          transition: all 0.2s ease;
        }

        .save-btn:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--primary);
          color: var(--primary);
        }

        .save-btn.saved {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-bottom: 1rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--page-border);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--page-text-main);
          background: rgba(99, 102, 241, 0.08);
          padding: 0.5rem 0.875rem;
          border-radius: 8px;
          border: 1px solid rgba(99, 102, 241, 0.15);
        }

        .meta-item svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.625rem;
          margin-bottom: 1.25rem;
        }

        .tag {
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          padding: 0.4rem 0.875rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.3);
          transition: all 0.2s ease;
        }

        .tag:hover {
          background: rgba(99, 102, 241, 0.25);
          border-color: rgba(99, 102, 241, 0.5);
        }

        .tag.more {
          background: var(--page-bg);
          color: var(--page-text-muted);
          border-color: var(--page-border);
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--page-border);
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .badge-group {
          display: flex;
          gap: 0.5rem;
        }

        .badge {
          background: rgba(16, 185, 129, 0.12);
          color: #6ee7b7;
          padding: 0.4rem 0.875rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .stipend {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #10b981;
          font-size: 0.9375rem;
          font-weight: 700;
        }

        .stipend svg {
          color: #10b981;
        }

        .footer-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .share-btn {
          background: var(--page-bg);
          border: 1px solid var(--page-border);
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--page-text-muted);
          transition: all 0.2s ease;
        }

        .share-btn:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--primary);
          color: var(--primary);
        }

        .apply-btn {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
        }

        .apply-btn:hover {
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
          transform: translateY(-1px);
        }

        .card-bottom-meta {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-size: 0.8125rem;
          color: var(--page-text-muted);
        }

        .deadline {
          color: #f59e0b;
          font-weight: 500;
        }

        .applied {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        /* ===== DARK FEATURED PANEL ===== */
        .featured-panel {
          position: sticky;
          top: 90px;
        }

        .featured-header {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .featured-header svg {
          color: var(--primary);
        }

        .featured-header h3 {
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--page-text-main);
          margin: 0;
        }

        .featured-companies {
          background: var(--page-surface);
          border: 1px solid var(--page-border);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .featured-company {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 0.75rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .featured-company:last-child {
          margin-bottom: 0;
        }

        .featured-company:hover {
          background: var(--page-surface-hover);
        }

        .featured-company img {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          object-fit: contain;
          background: var(--page-bg);
          padding: 8px;
          border: 1px solid var(--page-border);
        }

        .company-meta h4 {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--page-text-main);
          margin: 0 0 0.25rem 0;
        }

        .company-meta p {
          font-size: 0.8125rem;
          color: var(--page-text-muted);
          margin: 0;
        }

        .stats-card {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .stat-item:last-child {
          margin-bottom: 0;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-info h4 {
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.5px;
        }

        .stat-info p {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 1280px) {
          .internships-layout {
            grid-template-columns: 260px 1fr;
            padding: 1.5rem 2rem;
          }
          
          .featured-panel {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .internships-header {
            padding: 1.5rem 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
          }

          .header-search {
            max-width: none;
          }

          .internships-layout {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .filters-panel {
            position: relative;
            top: 0;
          }

          .internship-card {
            padding: 1.25rem;
          }

          .card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .footer-right {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Internships;

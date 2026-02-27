# Location API Integration Guide

## 🗺️ Recommended Maps APIs for Location Search

### Option 1: LocationIQ (FREE - Best for Testing) ⭐

**Why LocationIQ:**
- ✅ **5,000 requests/day FREE** (no credit card required!)
- ✅ Based on OpenStreetMap data
- ✅ Supports Indian cities very well
- ✅ Easy to set up
- ✅ Good for development and small-scale production

**Setup Steps:**

1. **Get Free API Key:**
   - Go to https://locationiq.com/
   - Click "Sign Up" (free account)
   - Verify your email
   - Go to Dashboard → API Access Tokens
   - Copy your API key

2. **Add to Environment Variables:**
   Create `.env` file in client folder:
   ```bash
   VITE_LOCATIONIQ_API_KEY=your_api_key_here
   ```

3. **Update the Hook:**
   In `client/src/hooks/useLocationAutocomplete.js`, replace:
   ```javascript
   const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;
   ```

4. **Install lodash (for debouncing):**
   ```bash
   cd client
   npm install lodash
   ```

**API Limits:**
- Free: 5,000 requests/day
- Paid: $49/month for 30,000 requests/day

---

### Option 2: Mapbox Geocoding API (Better Performance)

**Why Mapbox:**
- ✅ **100,000 requests/month FREE**
- ✅ Faster and more accurate
- ✅ Better autocomplete experience
- ✅ Modern API design
- ⚠️ Requires credit card (won't charge until you exceed free tier)

**Setup Steps:**

1. **Get API Key:**
   - Go to https://www.mapbox.com/
   - Sign up for free account
   - Go to Account → Access Tokens
   - Create a new token with **Geocoding** scope
   - Copy the token

2. **Add to Environment:**
   ```bash
   VITE_MAPBOX_TOKEN=your_mapbox_token_here
   ```

3. **Use Mapbox Hook:**
   Import `useMapboxAutocomplete` instead of `useLocationAutocomplete`

**API Limits:**
- Free: 100,000 requests/month
- Cost: $0.50 per 1000 after free tier

---

### Option 3: Google Maps Places Autocomplete (Most Accurate)

**Why Google Maps:**
- ✅ Most comprehensive database
- ✅ Best autocomplete experience
- ✅ Trusted globally
- ⚠️ Most expensive option
- ⚠️ Requires credit card

**Pricing:**
- Free: $200 credit/month (~28,000 requests)
- Cost: $2.83 per 1000 after free credit

**Setup:**
1. Go to https://console.cloud.google.com/
2. Enable "Places API"
3. Create API key
4. Restrict to your domain for security

---

## 📝 How to Integrate into Internships Page

### Step 1: Update Internships Component

Replace the static location search with dynamic API search:

```javascript
import { useLocationAutocomplete } from '../hooks/useLocationAutocomplete';

const Internships = () => {
  const {
    query: locationQuery,
    setQuery: setLocationQuery,
    suggestions: locationSuggestions,
    loading: locationLoading,
    clearSuggestions
  } = useLocationAutocomplete();

  // ... rest of your code
```

### Step 2: Update Location Filter UI

```javascript
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
    <button onClick={() => {
      setLocationQuery('');
      clearSuggestions();
    }} className="clear-search">
      <X size={14} />
    </button>
  )}
  {locationLoading && <span className="loading-indicator">Searching...</span>}
</div>

<div className="location-chips-grid">
  {locationSuggestions.length > 0 ? (
    locationSuggestions.map(location => (
      <button
        key={location.displayName}
        className={`location-chip ${filters.location.includes(location.city) ? 'active' : ''}`}
        onClick={() => handleFilterChange('location', location.city)}
      >
        <MapPin size={12} />
        {location.city}, {location.state}
      </button>
    ))
  ) : (
    // Show top tech cities when no search
    TOP_TECH_CITIES.map(loc => (
      <button
        key={loc}
        className={`location-chip ${filters.location.includes(loc) ? 'active' : ''}`}
        onClick={() => handleFilterChange('location', loc)}
      >
        <MapPin size={12} />
        {loc}
      </button>
    ))
  )}
</div>
```

---

## 🔄 Hybrid Approach (Best Practice)

Use **API + Static Fallback**:

```javascript
const LocationFilter = () => {
  const { suggestions, loading } = useLocationAutocomplete();
  const [useStaticList, setUseStaticList] = useState(true);

  // Show API suggestions if available, otherwise use static list
  const displayLocations = suggestions.length > 0 
    ? suggestions 
    : TOP_TECH_CITIES;

  return (
    // Your filter UI
  );
};
```

**Benefits:**
- API provides real-time, accurate data
- Static list works when API is down or quota exceeded
- Best user experience

---

## 📊 Comparison Table

| Feature | LocationIQ | Mapbox | Google Maps |
|---------|-----------|---------|-------------|
| **Free Tier** | 5k/day | 100k/month | $200 credit |
| **Credit Card** | ❌ No | ⚠️ Yes | ⚠️ Yes |
| **Accuracy** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Speed** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Setup Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **India Coverage** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Cost (Paid)** | $49/mo | $0.50/1k | $2.83/1k |

---

## 💡 My Recommendation

### For Development & Testing:
**Use LocationIQ** - Free, no credit card, perfect for learning

### For Production (Small Scale):
**Use Mapbox** - Better performance, generous free tier

### For Production (Large Scale):
**Use Google Maps** - Most reliable, but costs scale up

### Best Approach:
**Hybrid** - Use API for search + Static list as fallback

---

## 🚀 Quick Start (LocationIQ)

1. Get free API key from https://locationiq.com/
2. Create `client/.env`:
   ```
   VITE_LOCATIONIQ_API_KEY=pk.xxxxxxxxxxxxx
   ```
3. Install lodash: `npm install lodash`
4. Use the hook I created above
5. Update your Internships component

That's it! You'll have dynamic location search with real geocoding data! 🎉

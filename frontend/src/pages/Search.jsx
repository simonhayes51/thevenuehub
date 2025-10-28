import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FaFilter, FaMapMarkerAlt, FaTh, FaList, FaMap } from "react-icons/fa";
import CardAct from "../components/CardAct";
import CardVenue from "../components/CardVenue";
import LoadingGrid from "../components/LoadingGrid";
import SEO from "../components/SEO";

const API = import.meta.env.VITE_API_BASE || "";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("type") || "all");
  const [view, setView] = useState("grid");
  const [acts, setActs] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    genre: searchParams.get("genre") || "",
    style: searchParams.get("style") || "",
    minCapacity: searchParams.get("minCapacity") || "",
    maxCapacity: searchParams.get("maxCapacity") || "",
    featured: searchParams.get("featured") === "true",
  });

  useEffect(() => {
    loadData();
  }, [filters, tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      if (tab === "all" || tab === "acts") {
        const actsRes = await fetch(`${API}/acts?${params}`);
        setActs(await actsRes.json());
      }

      if (tab === "all" || tab === "venues") {
        const venuesRes = await fetch(`${API}/venues?${params}`);
        setVenues(await venuesRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      q: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      genre: "",
      style: "",
      minCapacity: "",
      maxCapacity: "",
      featured: false,
    });
    setSearchParams({});
  };

  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "q") return false;
      return value && value !== "";
    }).length;
  }, [filters]);

  const filteredActs = useMemo(() => {
    if (tab === "venues") return [];
    return acts;
  }, [acts, tab]);

  const filteredVenues = useMemo(() => {
    if (tab === "acts") return [];
    return venues;
  }, [venues, tab]);

  const totalResults = filteredActs.length + filteredVenues.length;

  // Extract unique values for dropdowns
  const genres = useMemo(() => {
    const set = new Set();
    acts.forEach(a => {
      (a.genres || "").split(",").forEach(g => set.add(g.trim()));
    });
    return Array.from(set).filter(Boolean).sort();
  }, [acts]);

  const styles = useMemo(() => {
    const set = new Set();
    venues.forEach(v => {
      if (v.style) set.add(v.style.trim());
    });
    return Array.from(set).filter(Boolean).sort();
  }, [venues]);

  const locations = useMemo(() => {
    const set = new Set();
    [...acts, ...venues].forEach(item => {
      if (item.location) set.add(item.location.trim());
    });
    return Array.from(set).filter(Boolean).sort();
  }, [acts, venues]);

  return (
    <main className="container-h py-10">
      <SEO 
        title={filters.q ? `Search: ${filters.q}` : "Search Entertainment & Venues"}
        description="Find the perfect act or venue with powerful filters, real-time availability, and verified reviews."
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {filters.q ? `Results for "${filters.q}"` : "Search Everything"}
        </h1>
        <p className="text-white/60">
          {loading ? "Searching..." : `${totalResults} results found`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search acts, venues, locations..."
            value={filters.q}
            onChange={(e) => updateFilter("q", e.target.value)}
            className="flex-1 bg-white/5 border border-line rounded-xl px-4 py-3 outline-none"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`pill ${activeFiltersCount > 0 ? "bg-brand-primary text-black" : ""}`}
          >
            <FaFilter />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Advanced Filters</h3>
            <button onClick={clearFilters} className="text-sm text-brand-primary hover:underline">
              Clear All
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Location</label>
              <select
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                className="w-full bg-white/5 border border-line rounded-xl px-4 py-2 outline-none"
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {tab !== "venues" && (
              <div>
                <label className="text-sm text-white/70 mb-2 block">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => updateFilter("genre", e.target.value)}
                  className="w-full bg-white/5 border border-line rounded-xl px-4 py-2 outline-none"
                >
                  <option value="">All Genres</option>
                  {genres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}

            {tab !== "acts" && (
              <div>
                <label className="text-sm text-white/70 mb-2 block">Style</label>
                <select
                  value={filters.style}
                  onChange={(e) => updateFilter("style", e.target.value)}
                  className="w-full bg-white/5 border border-line rounded-xl px-4 py-2 outline-none"
                >
                  <option value="">All Styles</option>
                  {styles.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm text-white/70 mb-2 block">Min Price</label>
              <input
                type="number"
                placeholder="£0"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full bg-white/5 border border-line rounded-xl px-4 py-2 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Max Price</label>
              <input
                type="number"
                placeholder="£10000"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full bg-white/5 border border-line rounded-xl px-4 py-2 outline-none"
              />
            </div>

            {tab !== "acts" && (
              <>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Min Capacity</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minCapacity}
                    onChange={(e) => updateFilter("minCapacity", e.target.value)}
                    className="w-full bg-white/5 border border-line rounded-xl px-4 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">Max Capacity</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxCapacity}
                    onChange={(e) => updateFilter("maxCapacity", e.target.value)}
                    className="w-full bg-white/5 border border-line rounded-xl px-4 py-2 outline-none"
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={filters.featured}
                onChange={(e) => updateFilter("featured", e.target.checked)}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm">Featured Only</label>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & View Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("all")}
            className={`pill ${tab === "all" ? "bg-brand-primary text-black" : ""}`}
          >
            All ({acts.length + venues.length})
          </button>
          <button
            onClick={() => setTab("acts")}
            className={`pill ${tab === "acts" ? "bg-brand-primary text-black" : ""}`}
          >
            Acts ({acts.length})
          </button>
          <button
            onClick={() => setTab("venues")}
            className={`pill ${tab === "venues" ? "bg-brand-primary text-black" : ""}`}
          >
            Venues ({venues.length})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`pill ${view === "grid" ? "bg-white/10" : ""}`}
          >
            <FaTh />
          </button>
          <button
            onClick={() => setView("list")}
            className={`pill ${view === "list" ? "bg-white/10" : ""}`}
          >
            <FaList />
          </button>
          <button
            onClick={() => setView("map")}
            className={`pill ${view === "map" ? "bg-white/10" : ""}`}
          >
            <FaMap />
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingGrid />
      ) : totalResults === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-white/60 mb-6">Try adjusting your filters or search term</p>
          <button onClick={clearFilters} className="btn">Clear Filters</button>
        </div>
      ) : view === "map" ? (
        <div className="card p-6">
          <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <FaMapMarkerAlt className="text-5xl text-white/40 mx-auto mb-3" />
              <p className="text-white/60">Map view coming soon</p>
              <p className="text-sm text-white/40 mt-2">Integrate with Google Maps or Mapbox</p>
            </div>
          </div>
        </div>
      ) : view === "list" ? (
        <div className="space-y-4">
          {filteredActs.map(act => (
            <div key={`act-${act.id}`} className="card p-4 flex gap-4 spotlight">
              <img
                src={act.image_url || "https://via.placeholder.com/150"}
                alt={act.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{act.name}</h3>
                <p className="text-sm text-white/70">{act.location} • {act.genres}</p>
                <p className="text-sm text-brand-primary mt-2">
                  {act.price_from ? `From £${act.price_from}` : "Price on request"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a href={`/acts/${act.id}`} className="btn">View</a>
              </div>
            </div>
          ))}
          {filteredVenues.map(venue => (
            <div key={`venue-${venue.id}`} className="card p-4 flex gap-4 spotlight">
              <img
                src={venue.image_url || "https://via.placeholder.com/150"}
                alt={venue.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{venue.name}</h3>
                <p className="text-sm text-white/70">{venue.location} • Capacity: {venue.capacity || "N/A"}</p>
                <p className="text-sm text-brand-primary mt-2">
                  {venue.price_from ? `From £${venue.price_from}` : "Price on request"}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <a href={`/venues/${venue.id}`} className="btn">View</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-cards">
          {filteredActs.map(act => (
            <CardAct key={`act-${act.id}`} act={act} />
          ))}
          {filteredVenues.map(venue => (
            <CardVenue key={`venue-${venue.id}`} venue={venue} />
          ))}
        </div>
      )}
    </main>
  );
}
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSearch, FaStar, FaMapMarkerAlt, FaCalendar, FaHeart, FaChartLine } from "react-icons/fa";
import SEO from "../components/SEO";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ acts: 0, venues: 0, bookings: 0 });

  useEffect(() => {
    // Animate numbers on load
    const targets = { acts: 247, venues: 189, bookings: 1423 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let current = { acts: 0, venues: 0, bookings: 0 };
    const interval = setInterval(() => {
      current = {
        acts: Math.min(current.acts + targets.acts / steps, targets.acts),
        venues: Math.min(current.venues + targets.venues / steps, targets.venues),
        bookings: Math.min(current.bookings + targets.bookings / steps, targets.bookings),
      };
      setStats({
        acts: Math.floor(current.acts),
        venues: Math.floor(current.venues),
        bookings: Math.floor(current.bookings),
      });
      if (current.acts >= targets.acts) clearInterval(interval);
    }, increment);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FaSearch className="text-3xl" />,
      title: "Smart Discovery",
      desc: "AI-powered recommendations match you with perfect acts & venues",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FaStar className="text-3xl" />,
      title: "Verified Reviews",
      desc: "Real feedback from 10,000+ events to help you decide",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <FaCalendar className="text-3xl" />,
      title: "Live Availability",
      desc: "Real-time calendars show you what's available instantly",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaHeart className="text-3xl" />,
      title: "Save & Compare",
      desc: "Build shortlists, compare prices, and share with your team",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Provider Insights",
      desc: "Premium members get analytics, leads, and priority placement",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      title: "Map Search",
      desc: "Find acts and venues near you with interactive map view",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const testimonials = [
    {
      quote: "Found our dream wedding band in minutes. The comparison tool saved us hours!",
      author: "Emma & James",
      role: "Wedding, June 2024",
      rating: 5,
    },
    {
      quote: "As a band, VenueHub has tripled our bookings. The analytics are incredible.",
      author: "The Midnight Collective",
      role: "Premium Provider",
      rating: 5,
    },
    {
      quote: "Event planning made easy. Love the calendar integration and instant quotes.",
      author: "Sarah Chen",
      role: "Corporate Events",
      rating: 5,
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <main className="overflow-hidden">
      <SEO 
        title="Book Top Entertainment & Venues"
        description="Discover 500+ verified acts and premium venues. Compare prices, read reviews, and book with confidence. No commission fees."
      />
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[90vh] flex items-center border-b border-line">
        {/* Animated Gradient Blobs */}
        <div className="blobs" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-brand-primary blur-3xl animate-pulse-slow" />
          <div className="absolute top-40 right-[15%] w-40 h-40 rounded-full bg-brand-blue blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-32 left-[20%] w-36 h-36 rounded-full bg-brand-pink blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}} />
        </div>

        <div className="container-h relative z-10 py-16 sm:py-24">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <span className="text-sm font-medium">10,000+ Events Booked This Year</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
              Book the{" "}
              <span className="bg-gradient-to-r from-brand-primary via-brand-blue to-brand-pink bg-clip-text text-transparent animate-gradient">
                perfect entertainment
              </span>
              <br />
              in minutes, not days
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
              Connect with top-rated entertainers and stunning venues. Compare prices, read verified reviews, and book with confidence. No commissions, just great connections.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary via-brand-blue to-brand-pink rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-surface/90 backdrop-blur rounded-2xl border border-line overflow-hidden">
                  <FaSearch className="absolute left-5 text-white/40 text-xl" />
                  <input
                    type="text"
                    placeholder="Search for bands, DJs, magicians, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-4 py-5 bg-transparent text-lg outline-none placeholder:text-white/40"
                  />
                  <button type="submit" className="btn mx-2 my-2">
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/acts" className="btn group">
                <span>Browse Acts</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/venues" className="btn-outline group">
                <span>Explore Venues</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-line/50">
              <div>
                <div className="text-3xl font-bold text-brand-primary mb-1">{stats.acts}+</div>
                <div className="text-sm text-white/60">Verified Acts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-blue mb-1">{stats.venues}+</div>
                <div className="text-sm text-white/60">Premium Venues</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-pink mb-1">{stats.bookings}+</div>
                <div className="text-sm text-white/60">Events Booked</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container-h py-20">
        <div className="text-center mb-16">
          <p className="eyebrow mb-3">WHY VENUEHUB</p>
          <h2 className="text-4xl font-bold mb-4">Everything you need to plan amazing events</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Professional tools that make discovering and booking entertainment effortless
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="card p-8 spotlight group hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-h py-20">
        <div className="text-center mb-16">
          <p className="eyebrow mb-3">TESTIMONIALS</p>
          <h2 className="text-4xl font-bold">Loved by event planners & providers</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-8 spotlight hover:scale-[1.02] transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <FaStar key={j} className="text-brand-yellow" />
                ))}
              </div>
              <blockquote className="text-lg text-white/90 mb-6 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-blue" />
                <div>
                  <div className="font-semibold">{t.author}</div>
                  <div className="text-sm text-white/60">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container-h py-20">
        <div className="text-center mb-16">
          <p className="eyebrow mb-3">HOW IT WORKS</p>
          <h2 className="text-4xl font-bold">Book in 3 simple steps</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { num: "01", title: "Search & Discover", desc: "Browse thousands of acts and venues with smart filters" },
            { num: "02", title: "Compare & Shortlist", desc: "Save favorites, compare prices, and read verified reviews" },
            { num: "03", title: "Connect & Book", desc: "Send enquiries directly and negotiate your perfect deal" },
          ].map((step, i) => (
            <div key={i} className="text-center relative">
              {i < 2 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-brand-primary to-transparent" />
              )}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-blue text-2xl font-bold mb-6 shadow-glow">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-white/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-h py-20">
        <div className="card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-blue/20 to-brand-pink/20" />
          <div className="relative p-12 md:p-16 text-center">
            <p className="eyebrow mb-4">FOR PROVIDERS</p>
            <h2 className="text-4xl font-bold mb-6">
              Grow your business with VenueHub
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join 500+ entertainers and venues already getting quality leads. 
              Premium features start at just £29/month.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/join" className="btn text-lg px-8 py-4">
                Get Started Free
              </Link>
              <Link to="/pricing" className="btn-outline text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container-h py-16 border-t border-line">
        <div className="text-center mb-10">
          <p className="text-white/60 text-sm mb-6">Trusted by leading brands</p>
        </div>
        <div className="marquee">
          {["LiveNation", "Eventbrite", "WeddingWire", "Spotify", "SoundCloud", "BBC Events", "ITV Productions", "Warner Music"].concat(["LiveNation", "Eventbrite", "WeddingWire", "Spotify", "SoundCloud", "BBC Events", "ITV Productions", "Warner Music"]).map((brand, i) => (
            <div key={i} className="text-white/40 text-lg font-semibold border border-line px-6 py-3 rounded-xl bg-white/5">
              {brand}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
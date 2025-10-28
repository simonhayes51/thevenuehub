import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaHeart, FaShare, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EnquiryForm from "../components/EnquiryForm";
import { useShortlist } from "../context/ShortlistContext";
import SEO from "../components/SEO";

const API = import.meta.env.VITE_API_BASE || "";

export default function ActDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { add, items } = useShortlist();

  const isSaved = items.acts?.some(a => a.id === data?.id);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/acts/${id}`);
      if (res.ok) {
        const act = await res.json();
        setData(act);
        
        // Load reviews
        const reviewsRes = await fetch(`${API}/reviews?act_id=${id}`);
        if (reviewsRes.ok) {
          act.reviews = await reviewsRes.json();
          setData(act);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.name,
          text: `Check out ${data?.name} on VenueHub`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const images = data?.images || (data?.image_url ? [data.image_url] : []);

  const openLightbox = (index) => {
    setLightbox({ open: true, index });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, index: 0 });
  };

  const nextImage = () => {
    setLightbox(prev => ({
      ...prev,
      index: (prev.index + 1) % images.length
    }));
  };

  const prevImage = () => {
    setLightbox(prev => ({
      ...prev,
      index: (prev.index - 1 + images.length) % images.length
    }));
  };

  if (loading) {
    return (
      <main className="container-h py-10">
        <div className="skeleton h-64 w-full mb-6" />
        <div className="skeleton h-12 w-2/3 mb-4" />
        <div className="skeleton h-32 w-full" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="container-h py-10">
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Act Not Found</h2>
          <p className="text-white/60 mb-6">This act doesn't exist or has been removed</p>
          <Link to="/acts" className="btn">Browse All Acts</Link>
        </div>
      </main>
    );
  }

  const avgRating = data.reviews?.length > 0
    ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
    : data.rating || 5.0;

  return (
    <main className="container-h py-10">
      <SEO
        title={data.name}
        description={data.description || `Book ${data.name} for your next event. ${data.location}.`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "MusicGroup",
          name: data.name,
          description: data.description,
          genre: data.genres,
          address: {
            "@type": "PostalAddress",
            addressLocality: data.location,
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: data.reviews?.length || 0,
          },
        }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link to="/acts" className="hover:text-white">Acts</Link>
        <span>/</span>
        <span className="text-white">{data.name}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="card overflow-hidden">
            {images.length > 0 ? (
              <div className="relative aspect-video group cursor-pointer" onClick={() => openLightbox(0)}>
                <img
                  src={images[0]}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white font-semibold">Click to view gallery</span>
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm">
                    +{images.length - 1} more
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-white/5 flex items-center justify-center">
                <span className="text-white/40">No images available</span>
              </div>
            )}

            {images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {images.slice(1, 6).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:ring-2 ring-brand-primary transition"
                    onClick={() => openLightbox(i + 1)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/70">
                  <span className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-brand-primary" />
                    {data.location}
                  </span>
                  {data.genres && (
                    <span className="pill">{data.genres.split(",")[0]}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => add("acts", data)}
                  className={`pill ${isSaved ? "bg-brand-primary text-black" : ""}`}
                >
                  <FaHeart className={isSaved ? "" : "text-white/60"} />
                </button>
                <button onClick={handleShare} className="pill">
                  <FaShare />
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(avgRating) ? "text-brand-yellow" : "text-white/20"}
                    />
                  ))}
                </div>
                <span className="font-semibold">{avgRating}</span>
              </div>
              <span className="text-white/60">
                {data.reviews?.length || 0} reviews
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 leading-relaxed">
                {data.description || "No description provided."}
              </p>
            </div>

            {/* Genres/Tags */}
            {data.genres && (
              <div className="mt-6 flex flex-wrap gap-2">
                {data.genres.split(",").map((genre, i) => (
                  <span key={i} className="pill text-sm">
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Video */}
            {data.video_url && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Watch Performance</h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={data.video_url.replace("watch?v=", "embed/")}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          {data.reviews && data.reviews.length > 0 && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Reviews</h3>
              <div className="space-y-4">
                {data.reviews.slice(0, 5).map((review, i) => (
                  <div key={i} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <FaStar
                            key={j}
                            className={j < review.rating ? "text-brand-yellow text-sm" : "text-white/20 text-sm"}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.author_name || "Anonymous"}</span>
                    </div>
                    <p className="text-white/80">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="card p-6 sticky top-4">
            <div className="mb-6">
              <div className="text-sm text-white/60 mb-1">Starting from</div>
              <div className="text-3xl font-bold text-brand-primary">
                {data.price_from ? `£${data.price_from}` : "Price on request"}
              </div>
            </div>

            <EnquiryForm targetType="act" targetId={id} />

            <div className="mt-6 pt-6 border-t border-line space-y-3 text-sm">
              {data.phone && (
                <a href={`tel:${data.phone}`} className="flex items-center gap-3 text-white/70 hover:text-white">
                  <FaPhone className="text-brand-primary" />
                  {data.phone}
                </a>
              )}
              {data.email && (
                <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-white/70 hover:text-white">
                  <FaEnvelope className="text-brand-primary" />
                  {data.email}
                </a>
              )}
              {data.website && (
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/70 hover:text-white">
                  <FaGlobe className="text-brand-primary" />
                  Visit Website
                </a>
              )}
            </div>
          </div>

          {/* Related Acts */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Similar Acts</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 hover:bg-white/5 p-2 rounded-lg transition cursor-pointer">
                  <div className="w-16 h-16 rounded-lg bg-white/5" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">Act Name {i}</div>
                    <div className="text-sm text-white/60">From £800</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightbox.open && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition z-10"
          >
            <FaTimes />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          <img
            src={images[lightbox.index]}
            alt=""
            className="max-w-full max-h-full object-contain"
            onClick={closeLightbox}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-lg">
            {lightbox.index + 1} / {images.length}
          </div>
        </div>
      )}
    </main>
  );
}
import { PremiumBadge, FeaturedBadge } from './Badge'
export default function VenueCard({venue}){
  return (
    <a href={`/venues/${venue.id}`} className="card overflow-hidden group block">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={venue.image_url} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition"/>
        <div className="absolute top-2 left-2 flex gap-2">
          {venue.premium && <PremiumBadge/>}
          {venue.featured && <FeaturedBadge/>}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">{venue.name}</h3>
          <span className="pill">{venue.style || 'Venue'}</span>
        </div>
        <div className="mt-1 text-white/70 text-sm">{venue.location} • cap {venue.capacity || '-'}</div>
        <div className="mt-2 text-sm text-white/80">{venue.price_from ? `from £${Math.round(venue.price_from)}` : ''}</div>
      </div>
    </a>
  )
}

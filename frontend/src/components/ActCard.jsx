import Rating from './Rating'
import { PremiumBadge, FeaturedBadge } from './Badge'

export default function ActCard({act}){
  return (
    <a href={`/acts/${act.id}`} className="card overflow-hidden group block">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={act.image_url} alt={act.name} className="w-full h-full object-cover group-hover:scale-105 transition"/>
        <div className="absolute top-2 left-2 flex gap-2">
          {act.premium && <PremiumBadge/>}
          {act.featured && <FeaturedBadge/>}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg">{act.name}</h3>
          <span className="pill">{act.act_type || 'Act'}</span>
        </div>
        <div className="mt-1 text-white/70 text-sm">{act.location}</div>
        <div className="mt-2 flex items-center justify-between">
          <Rating value={act.rating || 0}/>
          {act.price_from ? <div className="text-sm text-white/80">from £{Math.round(act.price_from)}</div> : null}
        </div>
      </div>
    </a>
  )
}

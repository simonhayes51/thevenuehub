export default function Logo({className=""}){
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" className="text-brand-secondary">
        <path fill="currentColor" d="M4 4h16v2H4zM7 9h10v2H7zM4 14h16v2H4zM9 19h6v2H9z"/>
      </svg>
      <span className="font-display text-xl tracking-tight">
        <span className="text-brand-primary">Venue</span><span className="text-white">Hub</span>
      </span>
    </div>
  )
}

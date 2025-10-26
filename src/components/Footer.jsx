import Logo from './Logo'
export default function Footer(){
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="container-2xl py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <Logo className="mb-3"/>
          <p className="text-muted">Find the perfect act or venue. No platform fees — just connect.</p>
        </div>
        <div>
          <div className="font-medium mb-2">Explore</div>
          <ul className="space-y-1 text-white/80">
            <li><a href="/acts">All Acts</a></li>
            <li><a href="/venues">All Venues</a></li>
            <li><a href="/join">Add My Services</a></li>
            <li><a href="/pricing">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-2">Company</div>
          <ul className="space-y-1 text-white/80">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/terms">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-white/50 border-t border-white/10">© {new Date().getFullYear()} VenueHub</div>
    </footer>
  )
}

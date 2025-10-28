import { useState } from "react";

export default function Navbar(){
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f13]/85 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="" onError={(e)=>{e.target.style.display="none"}} className="w-6 h-6"/>
          <span className="font-semibold">VenueHub</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/acts">Acts</a>
          <a href="/venues">Venues</a>
          <a href="/pricing">Pricing</a>
          <a href="/search">Search</a>
          <a href="/admin/leads">Admin</a>
          <a href="/join" className="ml-2 rounded-xl px-3 py-1 bg-emerald-500 text-black font-medium hover:bg-emerald-600">
            Add My Services
          </a>
          <a href="/shortlist" className="rounded-xl px-3 py-1 bg-white/10 border border-white/10">Shortlist</a>
        </nav>
        <button onClick={()=>setOpen(!open)} className="md:hidden rounded-lg px-2 py-1 border border-white/10">Menu</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 flex flex-col gap-2 text-sm">
            <a href="/acts">Acts</a>
            <a href="/venues">Venues</a>
            <a href="/pricing">Pricing</a>
            <a href="/search">Search</a>
            <a href="/admin/leads">Admin</a>
            <a href="/join">Add My Services</a>
            <a href="/shortlist">Shortlist</a>
          </div>
        </div>
      )}
    </header>
  );
}

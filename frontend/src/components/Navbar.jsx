import { useState } from 'react'
import Logo from './Logo'
export default function Navbar(){
  const [open,setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand.bg/70 backdrop-blur">
      <div className="container-2xl flex items-center justify-between h-14">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/">Home</a>
          <a href="/acts">Acts</a>
          <a href="/venues">Venues</a>
          <a href="/join" className="pill">Add My Services</a>
          <a href="/shortlist" className="pill">Shortlist</a>
          <a href="/login" className="btn-ghost">Login</a>
        </nav>
        <button className="md:hidden btn-ghost" onClick={()=>setOpen(!open)}>☰</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 pb-3">
          <div className="flex flex-col gap-3 py-3">
            <a href="/">Home</a>
            <a href="/acts">Acts</a>
            <a href="/venues">Venues</a>
            <a href="/join" className="pill">Add My Services</a>
            <a href="/shortlist" className="pill">Shortlist</a>
            <a href="/login" className="btn-ghost w-max">Login</a>
          </div>
        </div>
      )}
    </header>
  )
}

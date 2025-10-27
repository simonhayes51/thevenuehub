import { NavLink, Link } from "react-router-dom";
import { useShortlist } from "../context/ShortlistContext.jsx";

export default function Navbar(){
  const {toggleOpen, items} = useShortlist();
  const count = (items?.acts?.length||0) + (items?.venues?.length||0);
  const link = "px-3 py-2 rounded-lg hover:bg-white/5 transition text-white/90";
  const active = "bg-white/10 text-white";
  return (
    <header className="sticky top-0 z-40 border-b border-line backdrop-blur bg-bg/75">
      <div className="container-h h-16 flex items-center justify-between gap-3">
        <Link to="/" className="font-display font-extrabold tracking-tight text-lg flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-primary text-black">🎭</span>
          VenueHub
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/acts" className={({isActive})=>`${link} ${isActive?active:""}`}>Acts</NavLink>
          <NavLink to="/venues" className={({isActive})=>`${link} ${isActive?active:""}`}>Venues</NavLink>
          <NavLink to="/pricing" className={({isActive})=>`${link} ${isActive?active:""}`}>Pricing</NavLink>
          <NavLink to="/join" className="btn ml-1">Add My Services</NavLink>
          <button className="pill ml-1" onClick={toggleOpen}>Shortlist {count? `(${count})` : ""}</button>
        </nav>
      </div>
    </header>
  );
}
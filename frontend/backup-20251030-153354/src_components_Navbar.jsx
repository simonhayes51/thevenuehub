import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getShortlist } from "../data/store";
import ShortlistDrawer from "./ShortlistDrawer";

export default function Navbar(){
  const [open,setOpen]=useState(false);
  const [count,setCount]=useState(getShortlist().length);
  const loc = useLocation();
  useEffect(()=>{ setCount(getShortlist().length); },[loc,open]);

  return (
    <header className="navbar">
      <div className="wrapper navbar-inner">
        <Link className="brand" to="/">
          <img src="/logo-bookedup.svg" alt="BookedUp" />
          <span>BOOKED<b>UP</b></span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/acts">Acts</NavLink>
          <NavLink to="/venues">Venues</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/search">Search</NavLink>
          <a className="nav-cta" onClick={()=>setOpen(true)}>Shortlist ({count})</a>
          <NavLink className="nav-cta" to="/admin">+ Add Services</NavLink>
        </nav>
      </div>
      <ShortlistDrawer open={open} onClose={()=>setOpen(false)}/>
    </header>
  );
}

import { Link, NavLink } from "react-router-dom";

export default function Navbar(){
  return (
    <nav className="appbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <img src="/logo-bookedup.svg" alt="BookedUp" />
          <b>BOOKEDUP</b>
        </Link>
        <NavLink to="/acts">Acts</NavLink>
        <NavLink to="/venues">Venues</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/admin">Admin</NavLink>
        <Link id="shortlist-toggle" to="/shortlist" style={{marginLeft:"auto"}}>Shortlist</Link>
      </div>
    </nav>
  );
}

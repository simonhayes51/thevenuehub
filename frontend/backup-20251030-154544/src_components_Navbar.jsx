import { Link } from "react-router-dom";

export default function Navbar(){
  return (
    <header className="navbar">
      <div className="inner">
        <Link to="/" style={{display:'inline-flex', alignItems:'center', gap:10, fontWeight:900}}>
          <img src="/logo-bookedup.svg" alt="BookedUp" height="28" />
        </Link>

        <nav style={{marginLeft:'auto', display:'flex', gap:22}}>
          <Link to="/acts">Acts</Link>
          <Link to="/venues">Venues</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/search">Search</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

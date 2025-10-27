import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { ShortlistProvider } from "./context/ShortlistContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import ShortlistDrawer from "./components/ShortlistDrawer.jsx";
import CompareModal from "./components/CompareModal.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Acts from "./pages/Acts.jsx";
import Venues from "./pages/Venues.jsx";
import Join from "./pages/Join.jsx";
import Pricing from "./pages/Pricing.jsx";
import ActDetail from "./pages/ActDetail.jsx";
import VenueDetail from "./pages/VenueDetail.jsx";
import Search from "./pages/Search.jsx";
import Onboard from "./pages/Onboard.jsx";
import Leads from "./pages/Leads.jsx";

function Shell(){
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/acts" element={<Acts/>}/>
        <Route path="/venues" element={<Venues/>}/>
        <Route path="/acts/:id" element={<ActDetail/>}/>
        <Route path="/venues/:id" element={<VenueDetail/>}/>
        <Route path="/join" element={<Join/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
              <Route path="/search" element={<Search/>}/>
        <Route path="/onboard" element={<Onboard/>}/>
        <Route path="/admin/leads" element={<Leads/>}/>
      </Routes>
      <Footer/>
      <ShortlistDrawer/>
      <CompareModal/>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShortlistProvider>
      <CompareProvider>
        <Shell/>
      </CompareProvider>
    </ShortlistProvider>
  </BrowserRouter>
);

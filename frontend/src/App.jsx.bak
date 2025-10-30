import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ShortlistBubble from "./components/ShortlistBubble";

import Home from "./pages/Home";
import Acts from "./pages/Acts";
import ActDetails from "./pages/ActDetails";
import Venues from "./pages/Venues";
import Pricing from "./pages/Pricing";
import Search from "./pages/Search";
import Admin from "./pages/Admin";

import { initStore } from "./data/store";

export default function App() {
  useEffect(() => { initStore(); }, []);
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acts" element={<Acts />} />
        <Route path="/act/:id" element={<ActDetails />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
      <ShortlistBubble />
    </>
  );
}

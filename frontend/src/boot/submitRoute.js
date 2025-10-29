import React from "react";
import ReactDOM from "react-dom/client";
import SubmitPage from "@/pages/Submit.jsx";

if (typeof window !== "undefined" && location.pathname === "/submit") {
  const root = document.getElementById("root");
  if (root) ReactDOM.createRoot(root).render(React.createElement(SubmitPage));
}

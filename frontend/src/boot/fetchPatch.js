const API = import.meta.env.VITE_API_URL;

function toSubmitUrl(url){
  const u = String(url||"");
  // normalise any legacy paths to the new submit endpoint
  if (u.endsWith("/providers/register") || u.includes("/providers/register")) {
    return (API||"").replace(/\/$/,"") + "/api/providers/submit";
  }
  if (u.endsWith("/providers/submit") || u.includes("/providers/submit")) {
    return (API||"").replace(/\/$/,"") + "/api/providers/submit";
  }
  return url;
}

(function patchFetch(){
  if (window.__vhFetchPatched) return;
  const _fetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const target = toSubmitUrl(url);
    return _fetch(target, init);
  };
  window.__vhFetchPatched = true;
})();

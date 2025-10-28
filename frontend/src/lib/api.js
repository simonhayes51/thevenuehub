const BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/,"") || "";
async function req(path, {method="GET", json, headers} = {}){
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type":"application/json", ...(headers||{}) },
    body: json ? JSON.stringify(json) : undefined,
    credentials: "include"
  });
  if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status===204 ? null : res.json();
}
export const getJSON = (p) => req(p);
export const postJSON = (p, body) => req(p, {method:"POST", json:body});
export const patchJSON = (p, body) => req(p, {method:"PATCH", json:body});

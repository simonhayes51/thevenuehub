const API_BASE = import.meta.env.VITE_API_BASE || "";
function getToken(){
  try{ return localStorage.getItem("vh_token") || ""; }catch{ return ""; }
}
async function req(path, {method="GET", json, auth=false}={}){
  const headers = {"Content-Type":"application/json"};
  if(auth){ const t = getToken(); if(t) headers["Authorization"] = `Bearer ${t}`; }
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: json?JSON.stringify(json):undefined, credentials:"include" });
  if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if(res.status===204) return null;
  return res.json();
}
export const api = {
  login: (email,password)=>req("/api/auth/login",{method:"POST",json:{email,password}}),
  search: (q,type)=>req(`/api/search?q=${encodeURIComponent(q||"")}&type=${encodeURIComponent(type||"all")}`),
  providersRegister: (payload)=>req("/api/providers/register",{method:"POST",json:payload}),
  enquiriesCreate: (payload)=>req("/api/enquiries",{method:"POST",json:payload}),
  adminLeads: ()=>req("/api/admin/leads",{auth:true}),
};
export default api;

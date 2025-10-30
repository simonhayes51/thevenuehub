/**
 * BookedUp "DB" – demo/local only
 * Acts & Venues kept in localStorage (fallback to seed).
 */

const LS_ACTS = "bookedup_acts";
const LS_VENUES = "bookedup_venues";
const LS_SHORTLIST = "bookedup_shortlist";

const seedActs = [
  { id:"a1", title:"Neon Nights Band", city:"Newcastle", rating:4.8, priceFrom:600, tags:["band","party"] },
  { id:"a2", title:"DJ Vortex",       city:"Leeds",      rating:4.7, priceFrom:350, tags:["dj","club"] },
  { id:"a3", title:"Magic Max",       city:"Sunderland", rating:4.6, priceFrom:250, tags:["magic","host"] },
];

const seedVenues = [
  { id:"v1", title:"City Lights Loft",  city:"Leeds",      capacity:80,  priceFrom:600 },
  { id:"v2", title:"Coastal View Barn", city:"Sunderland", capacity:120, priceFrom:900 },
  { id:"v3", title:"The Grand Hall",    city:"Newcastle",  capacity:300, priceFrom:1500 },
];

function readLS(key, fallback){ try{ const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v)?v:fallback; } catch{ return fallback; } }
function writeLS(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

let actsCache   = readLS(LS_ACTS, seedActs);
let venuesCache = readLS(LS_VENUES, seedVenues);
let shortlist   = new Set(readLS(LS_SHORTLIST, []));

export function getActs(){ return actsCache.slice().sort((a,b)=>a.title.localeCompare(b.title)); }
export function getVenues(){ return venuesCache.slice().sort((a,b)=>a.title.localeCompare(b.title)); }

export function addAct(act){
  const a = { id: crypto.randomUUID(), title: act.title?.trim()||"Untitled Act", city: act.city?.trim()||"", rating: +act.rating||4.5, priceFrom:+act.priceFrom||0, tags: act.tags||[] };
  actsCache = [a, ...actsCache]; writeLS(LS_ACTS, actsCache); return a;
}
export function addVenue(v){
  const x = { id: crypto.randomUUID(), title: v.title?.trim()||"Untitled Venue", city: v.city?.trim()||"", capacity:+v.capacity||0, priceFrom:+v.priceFrom||0 };
  venuesCache = [x, ...venuesCache]; writeLS(LS_VENUES, venuesCache); return x;
}

/* shortlist */
export function toggleShort(id){
  shortlist.has(id) ? shortlist.delete(id) : shortlist.add(id);
  writeLS(LS_SHORTLIST, Array.from(shortlist)); return Array.from(shortlist);
}
export function getShortlist(){ return Array.from(shortlist); }

/* search both domains */
export function searchAll(q){
  const needle = (q||"").trim().toLowerCase();
  if(!needle) return { acts:getActs(), venues:getVenues() };
  const acts   = getActs().filter(x => `${x.title} ${x.city} ${(x.tags||[]).join(" ")}`.toLowerCase().includes(needle));
  const venues = getVenues().filter(x => `${x.title} ${x.city}`.toLowerCase().includes(needle));
  return { acts, venues };
}

export function getAct(id){ return getActs().find(a=>a.id===id); }
export function getVenue(id){ return getVenues().find(v=>v.id===id); }
export function deleteAct(id){ actsCache = actsCache.filter(a=>a.id!==id); localStorage.setItem("bookedup_acts", JSON.stringify(actsCache)); }
export function deleteVenue(id){ venuesCache = venuesCache.filter(v=>v.id!==id); localStorage.setItem("bookedup_venues", JSON.stringify(venuesCache)); }


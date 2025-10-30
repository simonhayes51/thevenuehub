const KEY = "bookedup-data-v1";
const SL = "bookedup-shortlist-v1";

const seed = {
  acts: [
    { id:"act_1", title:"Neon Nights Band", city:"Leeds", rating:4.9, price:600, desc:"80s/90s party band with full lighting and sax." },
    { id:"act_2", title:"DJ Vortex", city:"Newcastle", rating:4.7, price:350, desc:"High-energy DJ with mashups and requests." },
    { id:"act_3", title:"Boogie Test", city:"Sunderland", rating:4.5, price:400, desc:"Function band, repertoire from Motown to modern." }
  ],
  venues: [
    { id:"v_1", title:"City Lights Loft", city:"Leeds", capacity:80, price:600, desc:"Industrial loft with skyline views." },
    { id:"v_2", title:"Coastal View Barn", city:"Sunderland", capacity:120, price:900, desc:"Rustic barn, sea breeze, fairy lights." },
    { id:"v_3", title:"The Grand Hall", city:"Newcastle", capacity:300, price:1500, desc:"Classic hall with stage & balcony." }
  ]
};

function read(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return {...seed};
    return JSON.parse(raw);
  }catch(_){ return {...seed}; }
}
function write(db){ localStorage.setItem(KEY, JSON.stringify(db)); }

let db = read();

/* === Acts / Venues === */
export function getActs(){ return db.acts.slice(); }
export function getVenues(){ return db.venues.slice(); }

export function searchAll(q){
  const needle = (q||"").trim().toLowerCase();
  if(!needle) return { acts:getActs(), venues:getVenues() };
  const acts = getActs().filter(x => (x.title||"").toLowerCase().includes(needle) || (x.city||"").toLowerCase().includes(needle));
  const venues = getVenues().filter(x => (x.title||"").toLowerCase().includes(needle) || (x.city||"").toLowerCase().includes(needle));
  return { acts, venues };
}

/* === shortlist === */
function readSL(){
  try{ return JSON.parse(localStorage.getItem(SL) || "[]"); }catch(_){ return []; }
}
function writeSL(list){ localStorage.setItem(SL, JSON.stringify(list)); }

export function getShortlist(){ return readSL(); }
export function toggleShort(id){
  const set = new Set(readSL());
  if(set.has(id)) set.delete(id); else set.add(id);
  writeSL([...set]);
  return [...set];
}
export function clearShort(){ writeSL([]); }

/* === Admin: add/delete in-memory === */
export function addAct(payload){
  const id = "act_" + Math.random().toString(36).slice(2,9);
  const item = { id, rating:4.6, price:300, ...payload };
  db.acts.unshift(item); write(db); return item;
}
export function addVenue(payload){
  const id = "v_" + Math.random().toString(36).slice(2,9);
  const item = { id, capacity:80, price:600, ...payload };
  db.venues.unshift(item); write(db); return item;
}
export function deleteAct(id){ db.acts = db.acts.filter(x => x.id !== id); write(db); }
export function deleteVenue(id){ db.venues = db.venues.filter(x => x.id !== id); write(db); }

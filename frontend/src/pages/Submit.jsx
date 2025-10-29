import React from "react";
const API = import.meta.env.VITE_API_URL;

export default function SubmitPage(){
  const [type,setType] = React.useState("act");
  const [name,setName] = React.useState("");
  const [email,setEmail] = React.useState("");
  const [phone,setPhone] = React.useState("");
  const [location,setLocation] = React.useState("");
  const [genres,setGenres] = React.useState("");
  const [price,setPrice] = React.useState("");
  const [website,setWebsite] = React.useState("");
  const [desc,setDesc] = React.useState("");
  const [actType,setActType] = React.useState("");
  const [style,setStyle] = React.useState("");
  const [amenities,setAmenities] = React.useState("");
  const [image,setImage] = React.useState(null);
  const [preview,setPreview] = React.useState("");
  const [busy,setBusy] = React.useState(false);
  const [done,setDone] = React.useState(null);
  const [err,setErr] = React.useState("");

  function onPick(e){
    const f = e.target.files?.[0] || null;
    setImage(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  }

  async function submit(e){
    e.preventDefault();
    setBusy(true); setErr(""); setDone(null);
    try{
      const fd = new FormData();
      fd.append("type", type);
      fd.append("name", name);
      fd.append("email", email);
      if (phone)     fd.append("phone", phone);
      if (location)  fd.append("location", location);
      if (genres)    fd.append("genres", genres);
      if (price)     fd.append("price_from", price);
      if (website)   fd.append("website", website);
      if (desc)      fd.append("description", desc);
      if (actType)   fd.append("act_type", actType);
      if (style)     fd.append("style", style);
      if (amenities) fd.append("amenities", amenities);
      if (image)     fd.append("image", image);

      const r = await fetch(`${API}/api/providers/submit`, { method:"POST", body: fd });
      if(!r.ok) throw new Error(`Submit failed ${r.status}`);
      const data = await r.json();
      setDone(data);
      setName(""); setEmail(""); setPhone(""); setLocation(""); setGenres("");
      setPrice(""); setWebsite(""); setDesc(""); setActType(""); setStyle(""); setAmenities("");
      setImage(null); setPreview("");
    }catch(ex){ console.error(ex); setErr("Could not send your details. Please try again."); }
    finally{ setBusy(false); }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="neon-card max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Add My Services</h1>
        <p className="opacity-80 mb-6">List your act or venue. We review every submission before it goes live.</p>

        {done && (
          <div className="notice success mb-6">
            <div className="font-semibold">Thanks! We received your submission.</div>
            <div className="opacity-75 text-sm">Reference ID: {done.id}</div>
          </div>
        )}
        {err && <div className="notice error mb-4">{err}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="field">
              <span>Type</span>
              <select value={type} onChange={e=>setType(e.target.value)} className="input">
                <option value="act">Act</option>
                <option value="venue">Venue</option>
              </select>
            </label>
            <label className="field">
              <span>Name</span>
              <input required value={name} onChange={e=>setName(e.target.value)} className="input" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="field">
              <span>Email</span>
              <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" />
            </label>
            <label className="field">
              <span>Phone</span>
              <input value={phone} onChange={e=>setPhone(e.target.value)} className="input" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="field">
              <span>Location</span>
              <input value={location} onChange={e=>setLocation(e.target.value)} className="input" />
            </label>
            <label className="field">
              <span>Genres (comma-separated)</span>
              <input value={genres} onChange={e=>setGenres(e.target.value)} className="input" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="field">
              <span>Price From (£)</span>
              <input value={price} onChange={e=>setPrice(e.target.value)} inputMode="numeric" className="input" />
            </label>
            <label className="field">
              <span>Website</span>
              <input value={website} onChange={e=>setWebsite(e.target.value)} className="input" />
            </label>
          </div>

          <label className="field">
            <span>Description</span>
            <textarea rows={5} value={desc} onChange={e=>setDesc(e.target.value)} className="input" />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="field">
              <span>Act Type</span>
              <input value={actType} onChange={e=>setActType(e.target.value)} className="input" />
            </label>
            <label className="field">
              <span>Style (Venue)</span>
              <input value={style} onChange={e=>setStyle(e.target.value)} className="input" />
            </label>
            <label className="field">
              <span>Amenities (Venue)</span>
              <input value={amenities} onChange={e=>setAmenities(e.target.value)} className="input" />
            </label>
          </div>

          <div className="field">
            <span>Image</span>
            <input type="file" accept="image/*" onChange={onPick} className="input-file" />
            {preview && <img src={preview} alt="Preview" className="h-24 mt-2 rounded-xl border border-white/10" />}
          </div>

          <button disabled={busy} className="btn-neon">
            {busy ? "Submitting…" : "Submit for review"}
          </button>
        </form>
      </div>
    </div>
  );
}

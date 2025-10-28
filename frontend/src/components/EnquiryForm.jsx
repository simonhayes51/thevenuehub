import { useState } from "react";
const API = import.meta.env.VITE_API_BASE || "";

export default function EnquiryForm({targetType, targetId}){
  const [form,setForm] = useState({ name:"", email:"", date:"", message:"" });
  const [status,setStatus] = useState(null);
  const change = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  async function submit(e){
    e.preventDefault();
    try{
      setStatus("sending");
      await fetch(`${API}/enquiries`,{
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ ...form, [targetType+"_id"]: targetId })
      });
      setStatus("ok");
    }catch{ setStatus("err"); }
  }
  return (
    <form onSubmit={submit} className="card p-5 space-y-3">
      <div className="font-semibold">Send an enquiry</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input required className="bg-white/5 border border-line rounded-xl px-3 py-2" placeholder="Your Name"  name="name"  value={form.name} onChange={change}/>
        <input required className="bg-white/5 border border-line rounded-xl px-3 py-2" placeholder="Email"      name="email" value={form.email} onChange={change}/>
        <input className="bg-white/5 border border-line rounded-xl px-3 py-2" type="date" name="date" value={form.date} onChange={change}/>
        <input className="bg-white/5 border border-line rounded-xl px-3 py-2" placeholder="Message (optional)" name="message" value={form.message} onChange={change}/>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn">Send</button>
        {status==="ok" && <div className="text-emerald-300 text-sm">Sent. WeÊ¼ll pass it on!</div>}
        {status==="err" && <div className="text-rose-300 text-sm">CouldnÊ¼t send right now.</div>}
      </div>
    </form>
  );
}

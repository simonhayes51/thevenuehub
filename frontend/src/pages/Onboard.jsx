import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SEO from "../components/SEO.jsx";
import api from "../lib/api.js";

const schema = z.object({
  type: z.enum(["act","venue"]),
  name: z.string().min(2,"Name required"),
  location: z.string().min(2,"Location required"),
  email: z.string().email().optional(),
  price_from: z.string().optional(),
  services: z.string().optional(),
  description: z.string().optional(),
});

export default function Onboard(){
  const { register, handleSubmit, formState:{errors,isSubmitting} } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type:"act" }
  });
  async function submit(values){
    try{
      await api.providersRegister(values);
      alert("Thanks! Your profile was submitted. We’ll email you after review.");
    }catch(e){
      alert("Couldn’t submit right now.");
    }
  }
  const I = (p)=> <input className="input" {...p} />;
  const T = (p)=> <textarea className="input min-h-[120px]" {...p} />;

  return (
    <main className="container-h py-10 space-y-6">
      <SEO title="Add My Services" description="Join VenueHub as an act or a venue." />
      <h1 className="text-3xl font-semibold">Add My Services</h1>
      <form onSubmit={handleSubmit(submit)} className="card p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="space-y-1">
            <div className="text-sm text-white/70">I am a</div>
            <select className="input" {...register("type")}><option value="act">Act</option><option value="venue">Venue</option></select>
          </label>
          <label className="space-y-1">
            <div className="text-sm text-white/70">Name</div>
            <I {...register("name")}/>{errors.name && <div className="err">{errors.name.message}</div>}
          </label>
          <label className="space-y-1">
            <div className="text-sm text-white/70">Location</div>
            <I {...register("location")}/>{errors.location && <div className="err">{errors.location.message}</div>}
          </label>
          <label className="space-y-1">
            <div className="text-sm text-white/70">Contact Email</div>
            <I {...register("email")}/>
          </label>
        </div>
        <label className="space-y-1">
          <div className="text-sm text-white/70">About</div>
          <T {...register("description")}/>
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="space-y-1"><div className="text-sm text-white/70">Starting Price (£)</div><I {...register("price_from")}/></label>
          <label className="space-y-1 sm:col-span-2"><div className="text-sm text-white/70">Services / Packages</div><T {...register("services")}/></label>
        </div>
        <button className="btn" disabled={isSubmitting}>{isSubmitting? "Submitting…" : "Submit"}</button>
      </form>
    </main>
  );
}

import { useState } from "react";
import { FaPaperPlane, FaCalendar, FaUser, FaEnvelope, FaComment } from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";

const API = import.meta.env.VITE_API_BASE || "";

export default function EnquiryForm({ targetType, targetId }) {
  const [form, setForm] = useState({ name:"", email:"", date:"", message:"" });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const { success, error: showError } = useNotifications();

  const change = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      setStatus("sending");
      const res = await fetch(`${API}/enquiries`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ ...form, [`${targetType}_id`]: targetId })
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("ok");
      success("Enquiry sent successfully! We'll be in touch soon.", 8000);
      setForm({ name:"", email:"", date:"", message:"" });
    } catch (err) {
      setStatus("err");
      showError("Couldn't send enquiry. Please try again.", 5000);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
        <FaPaperPlane className="text-[#00fff9]" /> SEND ENQUIRY
      </h3>

      <div>
        <div className="relative">
          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b5cff]" />
          <input
            required
            className={`w-full pl-12 ${errors.name ? "border-[#ff2a6d]" : ""}`}
            placeholder="Your Name"
            name="name"
            value={form.name}
            onChange={change}
          />
        </div>
        {errors.name && <p className="text-[#ff2a6d] text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <div className="relative">
          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b5cff]" />
          <input
            required
            type="email"
            className={`w-full pl-12 ${errors.email ? "border-[#ff2a6d]" : ""}`}
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={change}
          />
        </div>
        {errors.email && <p className="text-[#ff2a6d] text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="relative">
        <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#fffc00]" />
        <input
          className="w-full pl-12"
          type="date"
          name="date"
          value={form.date}
          onChange={change}
        />
      </div>

      <div className="relative">
        <FaComment className="absolute left-4 top-4 text-[#9b5cff]" />
        <textarea
          className="w-full pl-12 min-h-[120px]"
          placeholder="Tell us about your event..."
          name="message"
          value={form.message}
          onChange={change}
        />
      </div>

      <button className="btn w-full" disabled={status === "sending"}>
        <FaPaperPlane />
        {status === "sending" ? "SENDING..." : "SEND ENQUIRY"}
      </button>
    </form>
  );
}

import React,{useEffect,useState} from 'react'
import api from '../api'
export default function BusinessLeads(){
  const [data,setData]=useState({credits:0,items:[]})
  const fetchLeads=async()=>{ const r=await api.get('/api/business/leads'); setData(r.data) }
  const unlock=async(id)=>{ try{ const r=await api.post(`/api/business/leads/${id}/unlock`); alert('Unlocked! Remaining credits: '+r.data.credits); fetchLeads() } catch(e){ alert(e.response?.data?.detail || 'Unable to unlock') } }
  useEffect(()=>{ fetchLeads() },[])
  return (<main className="max-w-4xl mx-auto px-4 py-8"><h2 className="text-2xl font-bold mb-2">Leads</h2><div className="text-white/70 mb-4">Credits: {data.credits}</div><div className="space-y-3">{data.items.map(it=>(<div key={it.lead_id} className="card"><div className="font-semibold">{it.customer_name} • {it.date}</div><div className="text-white/70">Email: {it.customer_email}</div><div className="text-white/70">Message: {it.message || '—'}</div>{!it.unlocked && <button className="btn mt-3" onClick={()=>unlock(it.lead_id)}>Unlock lead</button>}</div>))}</div></main>)
}
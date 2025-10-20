import React,{useState} from 'react'
import api from '../api'
export default function Join(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [display_name,setDisplayName]=useState('')
  const register=async(e)=>{ e.preventDefault(); const r=await api.post('/api/auth/register/provider',null,{params:{email,password,display_name}}); localStorage.setItem('vh_token', r.data.access_token); alert('Profile created. An admin will approve your listing.') }
  return (<main className="max-w-md mx-auto px-4 py-10"><form onSubmit={register} className="card space-y-3"><h2 className="text-2xl font-bold">List Your Act</h2><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/><input placeholder="Act / Brand Name" value={display_name} onChange={e=>setDisplayName(e.target.value)} required/><button className="btn w-full">Create Provider</button></form></main>)
}
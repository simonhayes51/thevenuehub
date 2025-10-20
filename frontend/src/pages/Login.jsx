import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import api from '../api'
export default function Login(){
  const [email,setEmail]=useState('admin@venuehub.co.uk'); const [password,setPassword]=useState('admin123'); const nav=useNavigate()
  const submit=async(e)=>{ e.preventDefault(); const r=await api.post('/api/auth/login',{email,password}); localStorage.setItem('vh_token', r.data.access_token); nav('/admin') }
  return (<main className="max-w-md mx-auto px-4 py-10"><form onSubmit={submit} className="card space-y-3"><h2 className="text-2xl font-bold">Admin Login</h2><input value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)}/><button className="btn w-full">Login</button></form></main>)
}
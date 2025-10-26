export default function ShortlistButton({id, type}){
  const key = 'vh_shortlist'
  const data = JSON.parse(localStorage.getItem(key) || '[]')
  const exists = data.some(x => x.id===id && x.type===type)
  const toggle = () => {
    let arr = JSON.parse(localStorage.getItem(key) || '[]')
    if (exists) arr = arr.filter(x => !(x.id===id && x.type===type))
    else arr.push({id, type, at: Date.now()})
    localStorage.setItem(key, JSON.stringify(arr))
    location.reload()
  }
  return <button className="btn-ghost text-sm" onClick={toggle}>{exists? 'Remove from shortlist' : 'Save to shortlist'}</button>
}

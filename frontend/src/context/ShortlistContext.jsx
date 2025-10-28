import React from "react";

const Ctx = React.createContext();
const KEY = "vh_shortlist_v1";

export function ShortlistProvider({children}){
  const [open,setOpen] = React.useState(false);
  const [items,setItems] = React.useState(()=>{
    try{ return JSON.parse(localStorage.getItem(KEY)) ?? {acts:[], venues:[]} }catch{return {acts:[],venues:[]}}
  });
  React.useEffect(()=>localStorage.setItem(KEY, JSON.stringify(items)),[items]);

  const toggleOpen = () => setOpen(v=>!v);
  const add = (type, item) => setItems(s=>{
    const list = s[type] ?? [];
    if(list.find(x=>x.id===item.id)) return s;
    return {...s, [type]: [item, ...list]};
  });
  const remove = (type, id) => setItems(s=>({...s,[type]: (s[type]??[]).filter(x=>x.id!==id)}));
  const clear = () => setItems({acts:[], venues:[]});

  return <Ctx.Provider value={{open,toggleOpen,items,add,remove,clear}}>{children}</Ctx.Provider>;
}
export function useShortlist(){ return React.useContext(Ctx) }

import React from "react";
const Ctx = React.createContext();
export function CompareProvider({children}){
  const [type,setType] = React.useState("acts");
  const [open,setOpen] = React.useState(false);
  const [picked,setPicked] = React.useState([]); // array of items
  const toggle = ()=> setOpen(v=>!v);
  const reset  = ()=> setPicked([]);
  const pick = (t,item)=>{
    setType(t);
    setPicked(cur=>{
      if(cur.find(x=>x.id===item.id)) return cur;
      if(cur.length>=3) return cur;
      return [...cur,item];
    });
    setOpen(true);
  };
  const drop = id => setPicked(x=>x.filter(i=>i.id!==id));
  return <Ctx.Provider value={{type,open,toggle,picked,reset,pick,drop}}>{children}</Ctx.Provider>;
}
export function useCompare(){ return React.useContext(Ctx) }
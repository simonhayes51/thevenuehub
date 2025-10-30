export default function Modal({open,onClose,children}){
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",backdropFilter:"blur(2px)",zIndex:60}}
         onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
           style={{maxWidth:720,margin:"6vh auto",background:"#fff",borderRadius:16,boxShadow:"0 18px 42px rgba(0,0,0,.22)",padding:22}}>
        {children}
      </div>
    </div>
  );
}

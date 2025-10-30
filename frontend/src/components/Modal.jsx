export default function Modal({open, onClose, title, children}){
  if(!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <header>
          <h3 style={{margin:0}}>{title}</h3>
          <button onClick={onClose} className="btn">Close</button>
        </header>
        <div className="body">{children}</div>
      </div>
    </div>
  );
}

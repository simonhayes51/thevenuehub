export default function Card({title,subtitle,children,onClick,footer}){
  return (
    <div className="card" style={{cursor:onClick?"pointer":"default"}} onClick={onClick}>
      <div style={{fontWeight:900, fontSize:18}}>{title}</div>
      {subtitle && <div style={{opacity:.7, marginTop:2}}>{subtitle}</div>}
      {children && <div style={{marginTop:10}}>{children}</div>}
      {footer && <div style={{marginTop:10}}>{footer}</div>}
    </div>
  );
}

export function attachButtonRipple(root=document){
  root.addEventListener('pointermove', (e)=>{
    if (!(e.target instanceof HTMLElement)) return;
    const el = e.target.closest('.btn');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left)/rect.width*100).toFixed(2)+'%';
    const y = ((e.clientY - rect.top)/rect.height*100).toFixed(2)+'%';
    el.style.setProperty('--x', x);
    el.style.setProperty('--y', y);
  }, { passive:true });
}

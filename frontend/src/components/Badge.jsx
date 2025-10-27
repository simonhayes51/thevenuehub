export default function Badge({children, tone="brand"}){
  const tones = {
    brand: "bg-brand-primary/15 text-brand-primary border-brand-primary/25",
    blue: "bg-brand-blue/15 text-brand-blue border-brand-blue/25",
    pink: "bg-brand-pink/15 text-brand-pink border-brand-pink/25",
    yellow: "bg-brand-yellow/15 text-brand-yellow border-brand-yellow/25"
  };
  return <span className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-xl border ${tones[tone]}`}>{children}</span>
}
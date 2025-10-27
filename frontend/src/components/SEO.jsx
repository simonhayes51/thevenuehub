export default function SEO({title, description, jsonLd}) {
  document.title = title ? `${title} • VenueHub` : "VenueHub";
  const desc = ensure("meta[name=\\"description\\"]","meta");
  desc.setAttribute("content", description || "Find entertainers & venues. Compare, shortlist, and enquire.");
  if(jsonLd){
    const ld = ensure("script[type=\\"application/ld+json\\"]","script");
    ld.type="application/ld+json"; ld.text = JSON.stringify(jsonLd);
  }
  return null;
}
function ensure(sel, tag){
  let el = document.head.querySelector(sel);
  if(!el){ el=document.createElement(tag); document.head.appendChild(el);}
  return el;
}
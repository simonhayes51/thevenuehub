export default function SEO({ title, description, jsonLd }) {
  if (title) document.title = `${title} • VenueHub`;

  const ensure = (selector, tagName) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement(tagName);
      document.head.appendChild(el);
    }
    return el;
  };

  // <meta name="description" content="...">
  const desc = ensure('meta[name="description"]', 'meta');
  desc.setAttribute('name', 'description');
  desc.setAttribute('content', description || 'Find entertainers & venues. Compare, shortlist, and enquire.');

  // Structured data (JSON-LD)
  if (jsonLd) {
    let script = document.head.querySelector('script[type="application/ld+json"].__vh');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.classList.add('__vh');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }

  return null; // head-only helper
}

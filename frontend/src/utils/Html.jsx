export function Html({ html }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

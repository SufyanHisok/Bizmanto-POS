/** Build an absolute URL that respects `<base href>` (needed for GitHub Pages). */
export function appUrl(path: string): string {
  const normalized = path.replace(/^\//, '');
  return new URL(normalized, document.baseURI).toString();
}

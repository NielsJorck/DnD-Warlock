// Prefixes a file from public/ with the app's base URL, so image paths in
// data/ ("/images/...") still work when the site is served from a subfolder
// such as GitHub Pages (https://<user>.github.io/<repo>/).
export function publicPath(path: string) {
  if (!path.startsWith('/')) return path
  return useRuntimeConfig().app.baseURL.replace(/\/$/, '') + path
}

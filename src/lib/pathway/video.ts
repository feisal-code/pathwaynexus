/** Only embed recognised HTTPS YouTube and Loom links, never arbitrary URLs. */
export function toEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return null;
    const host = url.hostname.toLowerCase();
    const segments = url.pathname.split("/").filter(Boolean);
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"].includes(host)) {
      const id = host.endsWith("youtu.be") ? segments[0] : url.pathname === "/watch" ? url.searchParams.get("v") : ["embed", "shorts", "live"].includes(segments[0] ?? "") ? segments[1] : null;
      return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (["loom.com", "www.loom.com"].includes(host) && ["share", "embed"].includes(segments[0] ?? "")) {
      const id = segments[1];
      return id && /^[a-f\d]{32}$/i.test(id) ? `https://www.loom.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}
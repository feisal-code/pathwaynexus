import { describe, expect, it } from "vitest";
import { toEmbedUrl } from "@/lib/pathway/video";

describe("Walkthrough video URLs", () => {
  it("supports a YouTube watch link", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });
  it("supports a shortened YouTube link", () => {
    expect(toEmbedUrl("https://youtu.be/dQw4w9WgXcQ?t=10")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });
  it("supports a Loom share link", () => {
    expect(toEmbedUrl("https://www.loom.com/share/0123456789abcdef0123456789abcdef")).toBe("https://www.loom.com/embed/0123456789abcdef0123456789abcdef");
  });
  it("uses the fallback when no URL is configured", () => {
    expect(toEmbedUrl("")).toBeNull();
  });
  it("uses the fallback for malformed and untrusted links", () => {
    for (const url of ["not a url", "https://example.com/youtube.com/watch?v=dQw4w9WgXcQ", "javascript:alert(1)", "https://youtube.com/watch?v=short"]) {
      expect(toEmbedUrl(url)).toBeNull();
    }
  });
});
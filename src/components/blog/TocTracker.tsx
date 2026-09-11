"use client";

import { useEffect } from "react";

/**
 * Marks the table-of-contents link for the section currently being read.
 *
 * The ONLY client code on an article page, and it renders nothing: the TOC
 * itself is server-rendered plain anchors that work with JavaScript off. This
 * effect is progressive enhancement — it sets `aria-current` on whichever
 * `a[data-toc-link]` matches the last H2 scrolled past, and CSS does the rest.
 *
 * A scroll listener (rAF-throttled) rather than IntersectionObserver: an
 * observer only reports headings entering a band, so while the reader is deep
 * inside a long section with no heading in the band it cannot tell which
 * section they are in — and scrolling back up leaves the wrong link lit.
 * "Last heading above the fold line" has no such gap.
 */
const FOLD_LINE_PX = 140;

export default function TocTracker() {
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".article-prose h2[id]")
    );
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a[data-toc-link]")
    );
    if (headings.length === 0 || links.length === 0) return;

    let frame = 0;
    let active: string | null = null;

    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= FOLD_LINE_PX) current = h.id;
        else break;
      }
      if (current === active) return;
      active = current;
      for (const a of links) {
        if (current && a.getAttribute("href") === `#${current}`) {
          a.setAttribute("aria-current", "true");
        } else {
          a.removeAttribute("aria-current");
        }
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}

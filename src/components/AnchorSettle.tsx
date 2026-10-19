"use client";

import { useEffect } from "react";

/** Resolve skipped section layouts before navigating to a nested anchor.
 * Placeholder heights are useful on first load, but must not move a requested
 * destination after it has been scrolled into view. Keep sections laid out
 * after the first jump so later expansion cannot undo that navigation.
 */
function navigateToAnchor(hash: string) {
  let id: string;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return false;
  }
  const target = document.getElementById(id);
  if (!target) return false;
  document.querySelector<HTMLElement>(".portfolio-home")?.setAttribute("data-anchor-navigation", "true");
  // scrollIntoView forces layout with the real section heights, not estimates.
  target.scrollIntoView({ block: "start", behavior: "instant" });
  return true;
}

export default function AnchorSettle() {
  useEffect(() => {
    const fromHash = () => navigateToAnchor(window.location.hash);
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute("href");
      if (!hash || link?.hasAttribute("download") || (link?.target && link.target !== "_self")) return;
      if (!navigateToAnchor(hash)) return;
      // Handle the jump once; Next Link and native smooth scrolling must not
      // start a second scroll using the old placeholder geometry.
      event.preventDefault();
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    };

    fromHash();
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("popstate", fromHash);
    // Signals that the navigation handlers are attached, rather than relying
    // on network-idle as a proxy for React hydration.
    document.documentElement.dataset.anchorNavigationReady = "true";
    return () => {
      delete document.documentElement.dataset.anchorNavigationReady;
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("popstate", fromHash);
    };
  }, []);

  return null;
}

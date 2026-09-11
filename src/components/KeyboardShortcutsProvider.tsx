"use client";

import { ReactNode } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  // enableSearch is OFF deliberately.
  //
  // The handler called preventDefault() on Ctrl/Cmd+K and then dispatched an
  // "open-search" CustomEvent that NOTHING listens for. Its only listener was
  // SearchDialog, which was mounted nowhere — and which has since been deleted
  // outright, because alongside being dead it carried a hardcoded results list
  // with an "author: John Doe" placeholder and a fake 300ms "API call" delay.
  //
  // The net effect of leaving the binding armed was worse than a missing
  // feature: it swallowed a shortcut the browser and several extensions bind,
  // and gave nothing back.
  //
  // The advertised row has been removed from ShortcutsDialog to match. Turn
  // this back on in the same commit that mounts a search UI over real content
  // — not before, or the shortcut starts lying again.
  useKeyboardShortcuts({
    enableSearch: false,
    enableHelp: true,
    enableNavigation: true,
  });

  return <>{children}</>;
}

export default KeyboardShortcutsProvider;

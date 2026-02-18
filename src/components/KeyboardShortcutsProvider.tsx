"use client";

import { ReactNode } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  // Enable all default shortcuts
  useKeyboardShortcuts({
    enableSearch: true,
    enableHelp: true,
    enableNavigation: true,
  });

  return <>{children}</>;
}

export default KeyboardShortcutsProvider;

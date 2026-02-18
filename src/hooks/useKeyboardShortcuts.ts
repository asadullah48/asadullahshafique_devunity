"use client";

import { useEffect } from "react";

interface KeyboardShortcutOptions {
  enableSearch?: boolean;
  enableHelp?: boolean;
  enableNavigation?: boolean;
  customShortcuts?: Array<{
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
  }>;
}

export function useKeyboardShortcuts(options: KeyboardShortcutOptions = {}) {
  const {
    enableSearch = true,
    enableHelp = true,
    enableNavigation = true,
    customShortcuts = [],
  } = options;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = e;

      // Ctrl/Cmd + K: Open search
      if (enableSearch && (ctrlKey || metaKey) && key === "k") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-search"));
        return;
      }

      // ?: Show shortcuts help (only if not in input/textarea)
      if (
        enableHelp &&
        key === "?" &&
        !ctrlKey &&
        !metaKey &&
        !isInputFocused()
      ) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("show-shortcuts"));
        return;
      }

      // g then [key]: Go to page
      if (enableNavigation && key === "g" && !ctrlKey && !metaKey) {
        const handleG = (e2: KeyboardEvent) => {
          e2.preventDefault();
          switch (e2.key.toLowerCase()) {
            case "h":
              window.location.href = "/";
              break;
            case "a":
              window.location.href = "/ai-tools";
              break;
            case "v":
              window.location.href = "/videos";
              break;
            case "b":
              window.location.href = "/backendless";
              break;
            case "p":
              window.location.href = "/privacy";
              break;
          }
          window.removeEventListener("keydown", handleG);
        };
        window.addEventListener("keydown", handleG, { once: true });
        return;
      }

      // Escape: Close modals
      if (key === "Escape") {
        window.dispatchEvent(new CustomEvent("close-modals"));
        return;
      }

      // Custom shortcuts
      customShortcuts.forEach((shortcut) => {
        if (
          key === shortcut.key &&
          (shortcut.ctrl === undefined || ctrlKey === shortcut.ctrl) &&
          (shortcut.meta === undefined || metaKey === shortcut.meta) &&
          (shortcut.shift === undefined || shiftKey === shortcut.shift) &&
          (shortcut.alt === undefined || altKey === shortcut.alt)
        ) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enableSearch,
    enableHelp,
    enableNavigation,
    customShortcuts,
  ]);
}

function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  return (
    activeElement?.tagName === "INPUT" ||
    activeElement?.tagName === "TEXTAREA" ||
    activeElement?.getAttribute("contenteditable") === "true"
  );
}

// Helper hook for individual shortcuts
export function useShortcut(
  key: string,
  action: () => void,
  options: { ctrl?: boolean; meta?: boolean; shift?: boolean; alt?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { ctrlKey, metaKey, shiftKey, altKey } = e;

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (options.ctrl === undefined || ctrlKey === options.ctrl) &&
        (options.meta === undefined || metaKey === options.meta) &&
        (options.shift === undefined || shiftKey === options.shift) &&
        (options.alt === undefined || altKey === options.alt)
      ) {
        e.preventDefault();
        action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, action, options.ctrl, options.meta, options.shift, options.alt]);
}

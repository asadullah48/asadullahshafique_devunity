"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function ShortcutsDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowShortcuts = () => setIsOpen(true);
    const handleCloseModals = () => setIsOpen(false);

    window.addEventListener("show-shortcuts", handleShowShortcuts);
    window.addEventListener("close-modals", handleCloseModals);

    return () => {
      window.removeEventListener("show-shortcuts", handleShowShortcuts);
      window.removeEventListener("close-modals", handleCloseModals);
    };
  }, []);

  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["g", "h"], description: "Go to Home" },
        { keys: ["g", "a"], description: "Go to AI Tools" },
        { keys: ["g", "v"], description: "Go to Videos" },
        { keys: ["g", "b"], description: "Go to Backendless" },
        { keys: ["g", "p"], description: "Go to Privacy" },
      ],
    },
    {
      category: "Actions",
      items: [
        { keys: ["Ctrl", "K"], description: "Open Search" },
        { keys: ["?"], description: "Show Shortcuts" },
        { keys: ["Esc"], description: "Close Modals" },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-zinc-400 mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-zinc-300">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, index) => (
                        <div key={key} className="flex items-center">
                          <Badge
                            variant="outline"
                            className="px-2 py-1 text-xs font-mono"
                          >
                            {key}
                          </Badge>
                          {index < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-zinc-500">then</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              Press <Badge variant="outline" className="px-2 py-1 text-xs">?</Badge> to open this help
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShortcutsDialog;

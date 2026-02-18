"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        theme={theme as "light" | "dark" | "system" | undefined}
        position="top-right"
        richColors
        closeButton
        duration={4000}
        expand
        visibleToasts={5}
        toastOptions={{
          classNames: {
            toast: "bg-zinc-900 border-zinc-800 text-white",
            success: "bg-green-900/30 border-green-800 text-green-300",
            error: "bg-red-900/30 border-red-800 text-red-300",
            warning: "bg-yellow-900/30 border-yellow-800 text-yellow-300",
            info: "bg-blue-900/30 border-blue-800 text-blue-300",
          },
        }}
      />
    </>
  );
}

export default ToastProvider;

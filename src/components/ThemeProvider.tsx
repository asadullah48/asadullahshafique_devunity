"use client";

import * as React from "react";
// next-themes ships its own types (dist/index.d.ts). The former
// src/types/next-themes.d.ts stub was both redundant and unusable: it
// contained only an ambient `declare module`, which cannot be imported as a
// module — hence "File ... is not a module". Its hand-written props were also
// looser than the real ones (`attribute?: string` instead of the `Attribute`
// union), so this import is strictly better typed, not merely a build fix.
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after component is mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

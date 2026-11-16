"use client";

// next-themes ships its own types (dist/index.d.ts). The former
// src/types/next-themes.d.ts stub was both redundant and unusable: it
// contained only an ambient `declare module`, which cannot be imported as a
// module — hence "File ... is not a module". Its hand-written props were also
// looser than the real ones (`attribute?: string` instead of the `Attribute`
// union), so this import is strictly better typed, not merely a build fix.
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

// Always render the provider. It used to render a bare fragment until mounted,
// then switch to <NextThemesProvider>; that type change made React unmount and
// remount the ENTIRE app after every hydration (every DOM node replaced, every
// effect run twice). next-themes is SSR-safe: its theme mismatch is absorbed by
// suppressHydrationWarning on <html> in layout.tsx.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

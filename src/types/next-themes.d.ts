declare module 'next-themes' {
  import { ReactNode } from 'react';

  export interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: string;
    attribute?: string;
    value?: Record<string, string>;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    forcedTheme?: string;
    storageKey?: string;
    themes?: string[];
  }

  export interface UseThemeProps {
    themes: string[];
    forcedTheme?: string;
    setTheme: (theme: string) => void;
    theme?: string;
    resolvedTheme?: string;
    systemTheme?: 'dark' | 'light';
  }

  export function useTheme(): UseThemeProps;
  
  export const ThemeProvider: React.FC<ThemeProviderProps>;
}

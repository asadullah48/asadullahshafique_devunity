import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Single max-width container so content never stretches edge-to-edge
    // on ultrawide displays.
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", lg: "2rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      fontFamily: {
        // Body/UI. Inter is kept for its readability at small sizes.
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Display. Space Grotesk has real character in headlines and reads
        // technical without tipping into "sci-fi font" territory.
        display: ["var(--font-display)", "var(--font-inter)", "sans-serif"],
        // Code, terminals, stat readouts, agent transcripts.
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "Cairo", "Noto Sans Arabic", "sans-serif"],
      },
      fontSize: {
        // Display scale with tracking baked in — stops per-component
        // `tracking-tight` guesswork.
        "display-sm": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-lg": ["4rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-xl": ["5rem", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        // Small uppercase labels need POSITIVE tracking to stay legible.
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // shadcn `accent` = subtle hover SURFACE. Not the brand color.
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // --- brand layer -------------------------------------------------
        // `brand` is the ONLY color allowed on interactive elements.
        //   brand      → fills, hairlines, glows, short labels (#00F2FF)
        //   brand.soft → sustained body copy; full-saturation cyan visibly
        //                vibrates at paragraph length on a near-black field
        //   brand.dim  → pressed / disabled
        brand: {
          DEFAULT: "hsl(var(--brand))",
          soft: "hsl(var(--brand-soft))",
          dim: "hsl(var(--brand-dim))",
        },
        // AMBIENT ONLY — glows, aurora, mesh gradients. Never a control.
        violet: "hsl(var(--violet))",
        // Elevation scale — replaces ad-hoc bg-[#0d0d0d] / bg-[#111111].
        surface: {
          1: "hsl(var(--surface-1))",
          2: "hsl(var(--surface-2))",
          3: "hsl(var(--surface-3))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Containers get a softer radius than the elements nested inside them.
        panel: "calc(var(--radius) + 6px)",
      },
      boxShadow: {
        // Shadows carry the background hue (220) instead of pure black —
        // black shadows on a tinted carbon surface read as dirty smudges.
        elevated: "0 12px 32px -12px hsl(220 40% 2% / 0.75)",
        panel: "0 24px 60px -20px hsl(220 40% 2% / 0.8)",
        // Cyan bloom for the primary CTA and "live" indicators.
        neon: "0 0 0 1px hsl(var(--brand) / 0.35), 0 0 24px -4px hsl(var(--brand) / 0.45)",
        "neon-lg": "0 0 0 1px hsl(var(--brand) / 0.4), 0 0 44px -6px hsl(var(--brand) / 0.55)",
        "inner-hairline": "inset 0 1px 0 0 hsl(var(--foreground) / 0.06)",
        // Glass edge refraction without the .glass-panel background — for
        // elements that need the lit rim but supply their own fill.
        glass: [
          "inset 0 1px 0 0 hsl(var(--foreground) / 0.07)",
          "inset 0 -1px 0 0 hsl(0 0% 0% / 0.35)",
          "0 16px 40px -12px hsl(220 40% 1% / 0.75)",
        ].join(", "),
      },
      // Named blur steps so glass surfaces can't drift apart component by
      // component. `backdrop-blur-glass` is the canonical panel value.
      backdropBlur: {
        glass: "var(--glass-blur)",
        chrome: "22px",
      },
      transitionTimingFunction: {
        // Weighted, spring-like easing. Replaces the default linear/ease
        // on interactive elements so presses feel physical.
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
        "spring-out": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      zIndex: {
        raised: "10",
        sticky: "30",
        nav: "40",
        overlay: "50",
        modal: "60",
        toast: "70",
        // One-shot boot overlay. Sits above everything, including toasts —
        // nothing may paint over the system-scan sequence while it runs.
        boot: "80",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-rtl")],
};
export default config;

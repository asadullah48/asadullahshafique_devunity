# Portfolio Enhancement - Install deps + build + deploy

## What was done directly in the project files:
1. Skills.tsx — added Redis, Terraform, Jaeger, Stripe, LangChain, LlamaIndex, n8n, Hugging Face
2. Navbar.tsx — wired in ThemeToggle (dark/light) + LocaleSwitcher (EN/AR)
3. LocaleContext.tsx — created at src/context/LocaleContext.tsx
4. LocaleSwitcher.tsx — created at src/components/LocaleSwitcher.tsx
5. src/i18n/en.json + ar.json — full English & Arabic translation files
6. layout.tsx — wrapped with LocaleProvider, Arabic Google Fonts added to globals.css
7. tailwind.config.ts — added tailwindcss-rtl plugin

## Your tasks:

### 1. Install new dependencies
```
npm install tailwindcss-rtl
```

### 2. Verify the context folder exists
```
ls src/context/
```

### 3. Run build to catch any TypeScript errors
```
npm run build
```

### 4. Fix any errors found (import paths, missing types, etc.)

### 5. Commit and push
```
git add -A
git commit -m "feat: add 8 skills, dark/light toggle, EN/AR i18n with RTL support"
git push
```

## How the locale switcher works:
- User clicks 🇦🇪 AR button in navbar → switches to Arabic, applies dir="rtl" to <html>
- Preference saved in localStorage, persists across sessions
- Arabic font (Cairo/Noto Sans Arabic) auto-applied
- All text keys available via useLocale() hook: const { t, isRTL } = useLocale()
- To translate a component: import { useLocale } from "@/context/LocaleContext" then use t("hero.greeting") etc.

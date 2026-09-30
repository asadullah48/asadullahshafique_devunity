import { notFound } from "next/navigation";

// Any unknown /ar/* URL. Without this route Next serves the prebuilt root
// /_not-found HTML, which was rendered for an English pathname; the client then
// hydrates under /ar/..., LocaleProvider switches the navbar to Arabic, and
// React throws hydration error #418. Calling notFound() here renders the 404 at
// request time with the real /ar pathname, so server and client agree.
export default function ArabicNotFoundCatchAll() {
  notFound();
}

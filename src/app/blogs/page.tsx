import { permanentRedirect } from "next/navigation";

// Legacy DevUnity blog list. It rendered three hardcoded posts attributed to
// people who never wrote them, with a "Create New Post" button wired to
// nothing — placeholder content under a real person's name. The real archive
// is /blog now, so this URL forwards there permanently (308) instead of
// competing with it.
export default function LegacyBlogsPage() {
  permanentRedirect("/blog");
}

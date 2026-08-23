// SERVER COMPONENT — deliberately no "use client".
//
// Nothing here is interactive: the scroll is the `animate-marquee` CSS
// keyframe and the hover-pause is the `.group/marquee` rule in globals.css,
// not a React handler. Its only consumer is page.tsx, which is itself a
// server component, so dropping the directive keeps this whole subtree —
// including the 14 react-icons brand SVGs below — out of the client bundle
// and renders it straight to HTML.
//
// If this ever needs a click handler or state, extract that leaf into its own
// client component rather than re-adding "use client" here; the icons are the
// expensive part and they must stay on the server.
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiPython,
  SiFastapi,
  SiDocker,
  SiKubernetes,
  SiTailwindcss,
  SiPostgresql,
  SiOpenai,
  SiVercel,
  SiGithub,
  SiFramer,
  SiNodedotjs,
} from "react-icons/si";
import type { IconType } from "react-icons";

const STACK: { Icon: IconType; label: string; color: string }[] = [
  { Icon: SiNextdotjs,   label: "Next.js",     color: "#ffffff" },
  { Icon: SiTypescript,  label: "TypeScript",  color: "#3178C6" },
  { Icon: SiReact,       label: "React",       color: "#61DAFB" },
  { Icon: SiPython,      label: "Python",      color: "#3776AB" },
  { Icon: SiFastapi,     label: "FastAPI",     color: "#009688" },
  { Icon: SiOpenai,      label: "OpenAI SDK",  color: "#10a37f" },
  { Icon: SiDocker,      label: "Docker",      color: "#2496ED" },
  { Icon: SiKubernetes,  label: "Kubernetes",  color: "#326CE5" },
  { Icon: SiTailwindcss, label: "Tailwind",    color: "#06B6D4" },
  { Icon: SiPostgresql,  label: "PostgreSQL",  color: "#4169E1" },
  { Icon: SiVercel,      label: "Vercel",      color: "#ffffff" },
  { Icon: SiGithub,      label: "GitHub",      color: "#ffffff" },
  { Icon: SiFramer,      label: "Framer",      color: "#0055FF" },
  { Icon: SiNodedotjs,   label: "Node.js",     color: "#5FA04E" },
];

function MarqueeRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex items-center gap-10 pr-10 flex-shrink-0"
    >
      {STACK.map(({ Icon, label, color }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Icon className="w-5 h-5 flex-shrink-0" style={{ color: `${color}b0` }} />
          <span className="text-sm font-mono whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * TechMarquee — infinite-scrolling strip of the working stack.
 * Two identical rows translate -50% for a seamless loop; the second
 * row is aria-hidden so screen readers only announce the stack once.
 * Pauses on hover (see .group/marquee rule in globals.css).
 */
export function TechMarquee() {
  return (
    <div className="group/marquee bg-background border-y border-white/5 py-5 overflow-hidden marquee-mask" dir="ltr">
      <div className="flex w-max animate-marquee">
        <MarqueeRow />
        <MarqueeRow ariaHidden />
      </div>
    </div>
  );
}

export default TechMarquee;

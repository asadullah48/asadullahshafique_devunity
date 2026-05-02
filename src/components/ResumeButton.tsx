"use client";

// HOW TO USE — pick ONE option and set RESUME_URL below:
//
// Option A — Google Drive:
//   Upload PDF → Share → "Anyone with the link" → copy share URL
//   Extract FILE_ID from: drive.google.com/file/d/FILE_ID/view
//   const RESUME_URL = "https://drive.google.com/uc?export=download&id=FILE_ID";
//
// Option B — Direct file in /public (simplest):
//   Place PDF at: public/Asadullah_Shafique_Resume.pdf
//   const RESUME_URL = "/Asadullah_Shafique_Resume.pdf";
//
// Option C — Any external host (Vercel Blob, S3, Cloudinary, etc.):
//   const RESUME_URL = "https://your-cdn.com/resume.pdf";

const RESUME_URL = "/Asadullah_Shafique_Resume.pdf";

import { FileDown } from "lucide-react";
import { useState } from "react";

export function ResumeButton({ variant = "outline" }: { variant?: "outline" | "solid" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (RESUME_URL === "/Asadullah_Shafique_Resume.pdf") {
      setStatus("loading");
      try {
        const res = await fetch(RESUME_URL, { method: "HEAD" });
        if (!res.ok) {
          e.preventDefault();
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
        }
      } catch {
        e.preventDefault();
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    }
  };

  const baseClass =
    "flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium text-sm";

  const variantClass =
    variant === "solid"
      ? "bg-green-500 hover:bg-green-400 text-black hover:scale-105"
      : "border border-white/20 hover:border-green-500/50 text-white hover:bg-white/5";

  return (
    <div className="relative inline-flex flex-col items-center gap-1">
      <a
        href={RESUME_URL}
        download="Asadullah_Shafique_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`${baseClass} ${variantClass}`}
      >
        {status === "loading" ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        {status === "error" ? "PDF not found" : "Download Resume"}
      </a>

      {status === "error" && (
        <span className="text-xs text-red-400 text-center max-w-[200px]">
          Upload resume.pdf to /public or update RESUME_URL in ResumeButton.tsx
        </span>
      )}
    </div>
  );
}

export default ResumeButton;

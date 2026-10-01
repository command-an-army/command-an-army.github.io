"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { ResponsiveBanner } from "@/components/integrations/responsive-banner";

export function InteractiveHtml({ html, ads = false }: { html: string; ads?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [targets, setTargets] = useState<{ banner: Element; native: Element } | null>(null);

  useEffect(() => {
    if (!ads || !hostRef.current) return;
    const banner = hostRef.current.querySelector('[data-ad-placement="banner"]');
    const native = hostRef.current.querySelector('[data-ad-placement="native"]');
    if (banner && native) setTargets({ banner, native });
    return () => setTargets(null);
  }, [ads, html]);

  return (
    <div ref={hostRef}
      onClick={(event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const button = target.closest("button[data-copy]");
        if (!(button instanceof HTMLButtonElement)) return;
        const value = button.dataset.copy ?? "";
        if (!value || !navigator.clipboard) return;
        void navigator.clipboard.writeText(value).then(() => {
          const previous = button.textContent || "Copy";
          button.textContent = "Copied";
          button.setAttribute("aria-label", `Copied ${value}`);
          window.setTimeout(() => {
            button.textContent = previous === "Copied" ? "Copy" : previous;
            button.setAttribute("aria-label", `Copy ${value}`);
          }, 1600);
        });
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {targets ? createPortal(<ResponsiveBanner />, targets.banner) : null}
      {targets ? createPortal(<NativeAdSlot />, targets.native) : null}
    </div>
  );
}

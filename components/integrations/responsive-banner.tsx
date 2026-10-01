"use client";

import { useSyncExternalStore } from "react";
import { assetPath } from "@/lib/urls";

type BannerSize = "mobile" | "desktop";
const noUpdates = () => () => {};
const clientSize = (): BannerSize => window.innerWidth < 768 ? "mobile" : "desktop";
const serverSize = (): null => null;

export function ResponsiveBanner() {
  // Hydrate with no iframe, then load only the current viewport's GET CODE.
  const size = useSyncExternalStore(noUpdates, clientSize, serverSize);

  return (
    <aside className="ad-banner" aria-label="Advertisement" data-banner-size={size ?? undefined}>
      <span className="ad-label">Advertisement</span>
      {size ? (
        <iframe
          title="Advertisement"
          src={assetPath(size === "mobile" ? "/ads/mobile-320x50.html" : "/ads/desktop-728x90.html")}
          width={size === "mobile" ? 320 : 728}
          height={size === "mobile" ? 50 : 90}
          scrolling="no"
          className="ad-banner-frame"
        />
      ) : null}
    </aside>
  );
}

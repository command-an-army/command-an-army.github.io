"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { InternalLink } from "@/config/types";
import { editorialChrome } from "@/lib/fixed-template/chrome";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { assetPath, routePath } from "@/lib/urls";

export function FixedTemplateHeader({ links }: { links: InternalLink[] }) {
  const pathname = usePathname() || "/";
  if (!isFixedTemplate()) return null;
  const skin = siteSkin();
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = path === "/" ? "home" : "inner";
  const currentSlug = page === "inner" ? path.split("/").filter(Boolean).at(-1) ?? "" : "";
  const nav = links
    .filter((link) => link.slug.replace(/^\/+|\/+$/g, ""))
    .map((link) => ({
      slug: link.slug.replace(/^\/+|\/+$/g, ""),
      label: link.label,
      href: routePath(link.slug),
    }));
  const chrome = editorialChrome({
    skin,
    page,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug,
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
  });
  return <div dangerouslySetInnerHTML={{ __html: chrome }} />;
}

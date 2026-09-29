import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { themes } from "@/config/themes";
import { assetPath } from "@/lib/urls";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const theme = themes[siteConfig.theme.preset] ?? themes["obsidian-red"];
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: assetPath("/"),
    display: "standalone",
    background_color: `hsl(${theme?.tokens.background ?? "0 0% 96%"})`,
    theme_color: `hsl(${theme?.tokens.primary ?? "240 6% 10%"})`,
    icons: [{ src: assetPath(siteConfig.assets.logo), sizes: "any", type: "image/webp" }],
  };
}

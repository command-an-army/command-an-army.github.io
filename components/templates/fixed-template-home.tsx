import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { visibleCorePages } from "@/content/registry";
import { InteractiveHtml } from "@/components/templates/interactive-html";
import { renderFaq, renderSections } from "@/lib/fixed-template/content-html";
import { renderFixedDocument } from "@/lib/fixed-template/render";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function supplement(home: HomePageDefinition): string {
  const sections = home.sections.filter((section) => section.id !== "quick-links");
  return `<div class="reading">${renderSections(sections)}${renderFaq(home.faq)}</div>`;
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = visibleCorePages
    .filter((page) => page.slug.replace(/^\/+|\/+$/g, ""))
    .map((page) => ({ slug: page.slug, label: page.navLabel }));
  const quickLinks = home.sections.find((section) => section.id === "quick-links")?.links ?? [];
  const entries = links.map((link) => {
    const described = quickLinks.find((item) => item.slug.replace(/^\/+|\/+$/g, "") === link.slug.replace(/^\/+|\/+$/g, ""));
    return {
      href: routePath(link.slug),
      title: described?.label || link.label,
      text: described?.description || link.label,
    };
  });
  const quick = home.sections.find((section) => section.id === "quick-links");
  const playUrl = siteConfig.game.officialUrl;
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: assetPath(siteConfig.assets.cover),
    bannerAlt: "Command An Army artwork",
    heading: home.hero.heading,
    lead: home.hero.lead,
    entries,
    supplementHtml: supplement(home),
    guideTitle: quick?.heading,
    guideIntro: quick?.intro,
    spotlight: {
      kicker: home.hero.eyebrow,
      heading: "Play, redeem codes, then field a squad",
      text: home.hero.supportingText,
      actions: [
        ...(playUrl ? [{ href: playUrl, label: "Play Command An Army on Roblox", external: true }] : []),
        { href: routePath("codes"), label: "View Working Codes", external: false },
      ],
    },
    stories: [
      { href: routePath("codes"), title: "Working codes", meta: "Sep 29, 2026" },
      { href: routePath("how-to-evolve-units"), title: "How to evolve units", meta: "Mastery 20, then the Evolution station" },
    ],
  });
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <InteractiveHtml html={rendered.rest} />
      <div className="site-container"><NativeAdSlot /></div>
    </>
  );
}

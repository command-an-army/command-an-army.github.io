import { placeFixedAds } from "@/components/integrations/fixed-ad-placements";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { InteractiveHtml } from "@/components/templates/interactive-html";
import { getRelatedPages, visibleCorePages } from "@/content/registry";
import { renderFaq, renderSections } from "@/lib/fixed-template/content-html";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { pageSchemas } from "@/lib/schema";
import { routePath } from "@/lib/urls";

function articleInner(page: SeoPageDefinition): string {
  const related = getRelatedPages(page);
  const relatedHtml = related.length
    ? `<section id="related"><h2>Keep reading</h2><ul>${related.map((item) => `<li><a href="${esc(routePath(item.slug))}">${esc(item.hero.heading)}</a></li>`).join("")}</ul></section>`
    : "";
  return `${renderSections(page.sections)}${renderFaq(page.faq)}${relatedHtml}`;
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages
    .filter((item) => item.slug.replace(/^\/+|\/+$/g, ""))
    .map((item) => ({ slug: item.slug.replace(/^\/+|\/+$/g, ""), label: item.navLabel, href: routePath(item.slug) }));
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug: page.slug,
    homeHref: "/",
    logoUrl: null,
    heading: page.hero.heading,
    lead: page.hero.lead,
    articleHtml: articleInner(page),
    category: page.navLabel,
    reviewed: page.lastReviewed,
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <InteractiveHtml html={placeFixedAds(rendered.rest, "inner")} ads />
    </>
  );
}

const banner = '<div class="ad-placement-banner" data-ad-placement="banner"></div>';
const native = '<div class="ad-placement-native" data-ad-placement="native"></div>';

function insertAfter(html: string, marker: string, content: string): string {
  const index = html.indexOf(marker);
  if (index < 0) throw new Error(`Missing fixed template ad anchor: ${marker}`);
  const end = index + marker.length;
  return `${html.slice(0, end)}${content}${html.slice(end)}`;
}

export function placeFixedAds(html: string, page: "home" | "inner"): string {
  if (page === "home") {
    const heroEnd = '</section><div class="section-title">';
    const withBanner = html.replace(heroEnd, `</section>${banner}<div class="section-title">`);
    if (withBanner === html) throw new Error("Missing fixed home hero boundary");
    const intro = withBanner.match(/<p class="guide-intro">[\s\S]*?<\/p>/)?.[0];
    if (!intro) throw new Error("Missing fixed home guide summary");
    return insertAfter(withBanner, intro, native);
  }

  const withBanner = insertAfter(html, '<div class="hero-img"></div>', banner);
  const firstIntro = withBanner.match(/<section id="[^"]+"><h2>[\s\S]*?<\/h2><p(?: class="[^"]+")?>[\s\S]*?<\/p>/)?.[0];
  if (!firstIntro) throw new Error("Missing fixed inner page introduction");
  return insertAfter(withBanner, firstIntro, native);
}

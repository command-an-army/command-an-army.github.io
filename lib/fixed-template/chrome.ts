export interface TemplateLink {
  slug: string;
  label: string;
  href: string;
}

export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function templateNavLinks(nav: TemplateLink[], page: "home" | "inner", currentSlug?: string | null): string {
  const items = nav.filter((item) => item.slug.replace(/^\/+|\/+$/g, ""));
  return items.map((item) => {
    const slug = item.slug.replace(/^\/+|\/+$/g, "");
    const active = page === "inner" && currentSlug && slug === currentSlug.replace(/^\/+|\/+$/g, "");
    return `<a class="nav-link${active ? " active" : ""}" href="${esc(item.href)}">${esc(item.label)}</a>`;
  }).join("");
}

export function brandInner(gameName: string, skin: string, page: "home" | "inner", logoUrl?: string | null): string {
  const logo = logoUrl
    ? `<img alt="" src="${esc(logoUrl)}" style="height:28px;width:28px;object-fit:cover;vertical-align:middle;margin-right:8px">`
    : "";
  if (skin === "resource") {
    const tag = page === "home" ? "<small>GAME RESOURCE CENTER</small>" : "";
    return `${logo}${esc(gameName)}${tag}`;
  }
  const parts = gameName.trim().split(/\s+/).filter(Boolean);
  const tag = skin === "horror" ? "i" : "span";
  if (parts.length < 2) return `${logo}${esc(gameName)}`;
  const last = esc(parts[parts.length - 1] ?? "");
  const rest = esc(parts.slice(0, -1).join(" "));
  return `${logo}${rest} <${tag}>${last}</${tag}>`;
}

/** Header shell only. The client nav must not import the full page template. */
export function editorialChrome(input: {
  gameName: string;
  skin: string;
  page: "home" | "inner";
  logoUrl?: string | null;
  nav: TemplateLink[];
  currentSlug?: string | null;
  homeHref: string;
}): string {
  const brand = brandInner(input.gameName, input.skin, input.page, input.logoUrl);
  const links = templateNavLinks(input.nav, input.page, input.currentSlug);
  return `<div class="topline"></div><header><div class="wrap head"><a class="logo" href="${esc(input.homeHref)}" aria-label="Back to homepage">${brand}</a><nav class="nav">${links}</nav></div></header>`;
}

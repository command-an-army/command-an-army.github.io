import type { DataTable, FaqItem, PageSection } from "@/config/types";
import { routePath } from "@/lib/urls";
import { esc } from "./render";

const LINK_PATTERN = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
const EXTERNAL_HREF = /^https:\/\/(?:www\.roblox\.com|discord\.gg|discord\.com)\/[A-Za-z0-9._~:/?#[\]@!$&'()*+,;=%-]+$/;

function renderLink(label: string, href: string): string {
  const text = esc(label);
  if (href.startsWith("/") && !href.startsWith("//")) {
    const slug = href.replace(/^\/+|\/+$/g, "");
    if (!slug || slug.includes(":") || slug.includes("..") || slug.includes(".")) return text;
    return `<a href="${esc(routePath(slug))}">${text}</a>`;
  }
  if (EXTERNAL_HREF.test(href)) {
    return `<a href="${esc(href)}" rel="noopener noreferrer">${text}</a>`;
  }
  return text;
}

export function renderInline(value: string): string {
  let html = "";
  let last = 0;
  for (const match of value.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    html += esc(value.slice(last, index));
    html += renderLink(match[1] ?? "", match[2] ?? "");
    last = index + match[0].length;
  }
  html += esc(value.slice(last));
  return html;
}

function renderTable(table: DataTable): string {
  const codeColumn = table.columns.findIndex((column) => column.trim().toLowerCase() === "code");
  const head = table.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join("");
  const body = table.rows.map((row) => {
    const cells = row.map((cell, index) => {
      const copyable = index === codeColumn && /^[A-Za-z0-9]+$/.test(cell);
      if (!copyable) return `<td>${renderInline(cell)}</td>`;
      return `<td><span class="code-value">${esc(cell)}</span> <button type="button" class="code-copy" data-copy="${esc(cell)}" aria-label="Copy ${esc(cell)}">Copy</button></td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
  const colSpan = Math.max(table.columns.length, 1);
  const empty = body
    ? ""
    : `<tr><td colspan="${colSpan}">None listed.</td></tr>`;
  return `<div class="table-scroll"><table><caption>${esc(table.caption)}</caption><thead><tr>${head}</tr></thead><tbody>${body}${empty}</tbody></table></div>`;
}

function renderSection(section: PageSection): string {
  const intro = section.intro
    ? `<p${section.id === "quick-answer" ? ' class="quick-answer"' : ""}>${renderInline(section.intro)}</p>`
    : "";
  const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${renderInline(paragraph)}</p>`).join("");
  const steps = section.steps?.length
    ? `<ol>${section.steps.map((step) => `<li><strong>${renderInline(step.heading)}</strong> ${renderInline(step.description)}</li>`).join("")}</ol>`
    : "";
  const table = section.table ? renderTable(section.table) : "";
  const subsections = (section.subsections ?? []).map((subsection) => {
    const body = subsection.paragraphs.map((paragraph) => `<p>${renderInline(paragraph)}</p>`).join("");
    const bullets = subsection.bullets?.length
      ? `<ul>${subsection.bullets.map((bullet) => `<li>${renderInline(bullet)}</li>`).join("")}</ul>`
      : "";
    const subTable = subsection.table ? renderTable(subsection.table) : "";
    return `<h3>${esc(subsection.heading)}</h3>${body}${bullets}${subTable}`;
  }).join("");
  const links = section.links?.length
    ? `<ul class="text-links">${section.links.map((link) => {
        const description = link.description ? ` <span>${renderInline(link.description)}</span>` : "";
        return `<li><a href="${esc(routePath(link.slug))}">${esc(link.label)}</a>${description}</li>`;
      }).join("")}</ul>`
    : "";
  return `<section id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${intro}${paragraphs}${steps}${table}${subsections}${links}</section>`;
}

export function renderSections(sections: PageSection[]): string {
  return sections.map((section) => renderSection(section)).join("");
}

export function renderFaq(items: FaqItem[] | undefined): string {
  if (!items?.length) return "";
  const body = items.map((item) => `<h3>${renderInline(item.question)}</h3><p>${renderInline(item.answer)}</p>`).join("");
  return `<section id="faq"><h2>Frequently Asked Questions</h2>${body}</section>`;
}

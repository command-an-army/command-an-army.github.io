"use client";

export function InteractiveHtml({ html }: { html: string }) {
  return (
    <div
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
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

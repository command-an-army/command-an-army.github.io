# Command An Army

Independent English guide for the Roblox game Command An Army. The public site is a static export for GitHub Pages at https://command-an-army.github.io/.

## Local development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run typecheck
npm run lint
npm run build:site
```

GitHub Actions deploys the `out/` folder to GitHub Pages on pushes to `main`.

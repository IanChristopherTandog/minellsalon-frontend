# Troubleshooting Guide

This page collects common problems and cross-platform fixes for developing and running the project.

## Common Issues

### Vite / Dev Server

Port in use:

- Cross-platform (recommended):

```bash
npx kill-port 5173 && npm run dev
```

- macOS / Linux (native):

```bash
kill -9 $(lsof -ti:5173) && npm run dev
```

- Windows PowerShell (native):

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
npm run dev
```

### Module / Dependency Issues

Module not found or corrupted install:

- Cross-platform (safe):

```bash
npx rimraf node_modules && npm install
```

- Windows (cmd):

```cmd
rmdir /s /q node_modules
npm install
```

If you use `bun` or `pnpm` replace `npm install` with `bun install` or `pnpm install`.

### TypeScript / Build Errors

To see TypeScript errors run the build script which shows type errors:

```bash
npm run build
```

If errors originate from third‑party types, try removing `node_modules` and reinstalling. For faster diagnostics use your editor's TypeScript server.

### React Issues

- Infinite re-render: Check `useEffect` dependency arrays and ensure you don't update state unconditionally inside effects.
- Stale state in event handlers: Use functional updates, e.g. `setState(prev => prev + 1)`.

### Tailwind / Styling

- Styles not applying: Ensure your `tailwind.config.ts` `content` paths include all `src` files (JSX/TSX). Then restart the dev server.
- Dark mode not working: Verify `darkMode: ["class"]` (or other mode you use) and that the `.dark` class is applied to `html` or top-level container.

### Environment-specific Notes

- This repository contains a `bun.lockb` file — if you're using Bun, run `bun install` and use Bun's runtime commands. Otherwise use `npm` or `pnpm`.
- Use `npx kill-port` and `npx rimraf` for one-off cross-platform utilities to avoid platform-specific shell commands.

### Clean Install (examples)

- Cross-platform (recommended):

```bash
npx rimraf node_modules bun.lockb package-lock.json
npm install
npm run dev
```

- Windows PowerShell (native):

```powershell
npm run build
npm run dev
```

If you prefer Bun or pnpm replace the install command accordingly (`bun install` / `pnpm install`).

---

If you still have issues, open an issue with the error output and the steps you took to reproduce.

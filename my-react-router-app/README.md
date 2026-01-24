# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

The production build output is placed under `build/`:
- `build/client` for static assets
- `build/server` for the SSR bundle

Static assets are served from the `build/client` directory via the Workers `ASSETS`
binding defined in `wrangler.jsonc`. Files in `public/` are copied into `build/client`
by the build.

To build and deploy directly to production:

```sh
npm run deploy
```

To deploy a preview environment (configure a preview environment in
`wrangler.jsonc` first):

```sh
npx wrangler deploy --env preview
```

To set environment variables and secrets:

```sh
# Plain vars live in wrangler.jsonc
# Secrets are stored via Wrangler
npx wrangler secret put SOME_SECRET
```

To deploy a preview URL using versioned releases:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

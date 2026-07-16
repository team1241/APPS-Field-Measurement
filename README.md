This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

This repo requires **Node.js `v24.15.0`** (see [`.nvmrc`](.nvmrc)). npm ships with Node, so installing the correct Node version also gives you a matching npm.

### Install nvm

[nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) lets you install and switch Node versions per project.

**macOS / Linux:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Restart your terminal (or reload your shell config), then confirm:

```bash
command -v nvm
```

**Windows:** use [nvm-windows](https://github.com/coreybutler/nvm-windows) or [fnm](https://github.com/Schniz/fnm), then follow the same version steps below.

### Install and use this repo's Node version

From the project root:

```bash
# Install the version in .nvmrc (v24.15.0)
nvm install

# Switch to it in the current shell
nvm use

# Optional: make it the default for new shells
nvm alias default 24.15.0
```

Verify:

```bash
node -v   # should print v24.15.0
npm -v
```

Then install dependencies:

```bash
npm install
```

## Getting Started

This app needs two processes in development: the **Convex** backend and the **Next.js** frontend.

### 1. Start the Convex backend

In one terminal, from the project root:

```bash
npx convex dev
```

On first run, this will:

- Log you into Convex (or create an account) if needed
- Create or link a development deployment
- Push functions from `convex/`
- Write `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, and related values into `.env.local`

Leave this process running. It watches `convex/` and syncs changes to your deployment.

Use `convex dev` for day-to-day development — not `convex deploy` (that targets production).

### 2. Start the Next.js app

In a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

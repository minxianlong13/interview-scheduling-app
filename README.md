## How to setup the Database

1. Copy the .env.example to .env or create your own PostgresSQL DB and add the DATABASE_URL to the .env
2. Run

```bash
npx prisma migrate dev --name intial
npx prisma generate
```

## Start the app locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The app has been deployed to https://interview-scheduling-x8pyw9g6c-minxianlong13s-projects.vercel.app/

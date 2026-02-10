# RecoverPath - Post-Discharge Readmission Prevention Platform

A mobile-first web application connecting hospitals and patients for seamless post-discharge monitoring. Track vitals, manage medications, and prevent readmissions.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 + custom UI components
- **Auth**: NextAuth.js v5 (credentials provider, role-based)
- **ORM**: Prisma 6
- **Database**: PostgreSQL on Supabase
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase database

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Once your project is ready, go to **SQL Editor** in the dashboard
3. Run `supabase/setup.sql` to create all tables and indexes
4. Run `supabase/seed.sql` to insert sample data (5 hospitals, 10 patients)

### 3. Get your connection strings

Go to **Settings > Database > Connection string** in your Supabase dashboard.

You need two URLs:
- **Transaction pooler** (port 6543) — for `DATABASE_URL`
- **Session pooler / Direct** (port 5432) — for `DIRECT_URL`

### 4. Configure environment variables

Edit `.env.local` with your real Supabase values:

```
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
AUTH_SECRET="generate-a-random-32-char-secret"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

Also update `.env` with the same `DATABASE_URL` and `DIRECT_URL` (Prisma CLI reads from `.env`).

Generate a secret: `openssl rand -base64 32`

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Alternative: Push schema via Prisma (instead of SQL script)

If you prefer Prisma to create the tables instead of the SQL script:

```bash
npx prisma db push
```

Then seed with:

```bash
npx tsx prisma/seed.ts
```

## Sample Login Credentials

Password for ALL accounts: `password123`

| Role     | Email               | Name              |
|----------|---------------------|-------------------|
| Hospital | admin@overlook.med  | Overlook Medical  |
| Hospital | admin@apollo.med    | Apollo Mumbai     |
| Hospital | admin@fortis.med    | Fortis Delhi      |
| Hospital | admin@aiims.med     | AIIMS New Delhi   |
| Hospital | admin@manipal.med   | Manipal Bangalore |
| Patient  | arjun@patient.com   | Arjun Mehta       |
| Patient  | sneha@patient.com   | Sneha Reddy       |
| Patient  | rahul@patient.com   | Rahul Gupta       |
| Patient  | priya@patient.com   | Priya Nair        |
| Patient  | amit@patient.com    | Amit Joshi        |
| Patient  | kavita@patient.com  | Kavita Desai      |
| Patient  | vikash@patient.com  | Vikash Kumar      |
| Patient  | ananya@patient.com  | Ananya Iyer       |
| Patient  | deepak@patient.com  | Deepak Sharma     |
| Patient  | ritu@patient.com    | Ritu Verma        |

## Deployment to Vercel

### Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free tier works)
- Your Supabase project already set up with tables and seed data (see above)

### Step 1: Push code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - RecoverPath app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Import project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Vercel will auto-detect it as a Next.js project

### Step 3: Configure environment variables

Before clicking Deploy, add these environment variables in the Vercel project settings:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase transaction pooler URL |
| `DIRECT_URL` | `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres` | Supabase direct connection URL |
| `AUTH_SECRET` | *(generate a random 32+ char string)* | Secret for NextAuth session encryption |
| `AUTH_URL` | `https://your-app-name.vercel.app` | Your Vercel deployment URL |
| `NEXTAUTH_URL` | `https://your-app-name.vercel.app` | Same as AUTH_URL |

**How to get each value:**

- **DATABASE_URL & DIRECT_URL**: Go to your Supabase dashboard > click **Connect** button at the top. Copy the Transaction pooler URL for `DATABASE_URL` (add `?pgbouncer=true`), and the Direct/Session URL for `DIRECT_URL`.
- **AUTH_SECRET**: Generate one by running `openssl rand -base64 32` in your terminal, or use any random string generator (must be 32+ characters).
- **AUTH_URL / NEXTAUTH_URL**: After your first deploy, Vercel gives you a URL like `https://your-app.vercel.app`. Use that. You can update these after the first deploy.

### Step 4: Deploy

1. Click **"Deploy"** in Vercel
2. Vercel will run `npm run build` which automatically runs `prisma generate` then `next build`
3. Wait for the build to complete (usually 1-2 minutes)

### Step 5: Update AUTH_URL after first deploy

1. After the first deploy, copy your Vercel deployment URL (e.g., `https://recoverpath.vercel.app`)
2. Go to Vercel **Project Settings > Environment Variables**
3. Update `AUTH_URL` and `NEXTAUTH_URL` to your actual deployment URL
4. Click **Redeploy** (Deployments tab > three dots on latest > Redeploy)

### Step 6: Set up a custom domain (optional)

1. In Vercel, go to **Project Settings > Domains**
2. Add your custom domain (e.g., `recoverpath.com`)
3. Follow the DNS configuration instructions
4. Update `AUTH_URL` and `NEXTAUTH_URL` to your custom domain

### Troubleshooting Vercel Deployment

| Issue | Solution |
|-------|----------|
| Build fails with Prisma error | Make sure `build` script is `npx prisma generate && next build` in `package.json` |
| Login not working after deploy | Verify `AUTH_URL` and `NEXTAUTH_URL` match your actual deployment URL exactly |
| Database connection error | Check that `DATABASE_URL` and `DIRECT_URL` are correct in Vercel env vars and your Supabase project is active |
| "Invalid database string" error | URL-encode special characters in your password (`!` → `%21`, `@` → `%40`, `#` → `%23`) |
| Redirect loop on login | Make sure `AUTH_URL` uses `https://` (not `http://`) for the Vercel URL |

## Features

### Hospital Portal
- Dashboard with patient overview and stats
- Patient management with search/filter
- Create discharge plans with medications
- View patient vitals and medication adherence

### Patient Portal
- Recovery dashboard with medication checklist
- View discharge records and instructions
- Log daily vitals (BP, weight, glucose, temperature) with edit/delete
- Vitals history with charts
- Daily medication tracking with day navigation
- Add your own medications with full edit/delete
- Notes on medication entries

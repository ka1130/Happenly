# Happenly 🚧 WIP

**Event management website**

## Features

- **Dashboard** with stats overview and event cards with **search/filter** functionality
- **Create Event** form with all fields (title, description, date, time, location, capacity, categories, image)
- **Edit Event** page with pre-filled form data
- **Event Detail** view with hero image, tabs (Overview, Attendees, Schedule), and registration button
- **My Events** page with tabs for created and registered events
- **Browse Events** for discovering public events
- **Settings** page for profile, notifications, and security preferences
- **Collapsible sidebar** navigation

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Next.js + Supabase

## Usage

1. Browse events
2. Go to single event page by clicking on an event card
3. Sign in to enable creating and event (Create Evemt button appears on main page and '/events/new' route shows the form)
4. Creators can update and remove their events
5. Seed events: open [http://localhost:3000/api/seed-events](http://localhost:3000/api/seed-events)
6. Authenticate (with Supabase)
7. Register for events (from a single event view)
8. Search events live
9. Filter events by category/status, sort them by date, attendees count or alphabetically
10. Collapse/reveal sidebar

(Planned): 10. User panel/settings 11. Dedicated dashboard page

---

<br />

# Next.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

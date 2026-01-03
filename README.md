# Happenly 🚧 WIP

**Event management website**

Online demo: [see on Vercel](https://happenly-nu.vercel.app/)

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

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + React Hook Form / ZOD for validation
- **Backend:** Next.js + Supabase

## Usage

1. Browse events
2. Go to single event page by clicking on an event card
3. Sign in to enable creating and event (Create Evemt button appears on main page and '/events/new' route shows the form)
4. Creators can update and remove their events
5. Seed events: `npm run seed`
6. Authenticate (with Supabase)
7. Register for events (from a single event view)
8. Search events live
9. Filter events by category/status, sort them by date, attendees count or alphabetically
10. Collapsible sidebar
11. User panel/settings

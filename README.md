# GlowBook — Salon Booking SaaS

A complete, original salon booking SaaS built with **Next.js 14 (App Router), React and Tailwind CSS**. No paid database, no API keys, no backend — all data lives in the browser's localStorage.

## What it is

Customers book salon services online in 4 steps. Salon owners manage bookings, services, staff, customers, branches and settings from an admin dashboard. The same codebase is the sellable SaaS product: one install per salon, or one install serving many branches.

## Features

### Customer side
- **Landing page `/`** — hero, how it works, services preview, pricing, testimonials, "For Salon Owners" multi-salon section, footer.
- **Booking flow `/book`** — 4 steps:
  1. Select service(s): Haircut ₹199 / 30 min, Beard Trim ₹99 / 15 min, Hair Colour ₹999 / 90 min, Facial ₹499 / 45 min, Head Massage ₹299 / 30 min, Manicure ₹399 / 40 min, Pedicure ₹449 / 40 min, Bridal Package ₹4999 / 180 min.
  2. Select staff: Aarav Sharma (Hair Expert), Rohan Verma (Beard & Style), Priya Nair (Skin & Facial), Sneha Patel (Colour Specialist), plus Any Staff.
  3. Select date (next 14 days) + time slot (10 AM – 8 PM, 30-min slots, some shown booked).
  4. Name + phone + notes, then confirm. Booking ID like `GB-123456`, live summary, success screen.
- **My Bookings `/my-bookings`** — look up by phone number, view bookings, cancel or reschedule.
- **Pricing `/pricing`** — Starter ₹499/mo, Pro ₹999/mo, Premium ₹1999/mo, with the SaaS model explained.

### Dual currency — INR + USDT
- Every price is stored in INR and shown as **₹499 (~5.67 USDT)**.
- Conversion: **1 USDT = ₹88**, fixed in `lib/store.js` as `USDT_RATE = 88`.
- Helper: `formatPrice(inr)` in `lib/store.js` returns the dual string, `toUSDT(inr)` / `formatUSDT(inr)` give the USDT value to 2 decimals, `formatPriceIn(inr, currency)` renders one currency.
- Top bar toggle: **INR + USDT / INR / USDT** (in the navbar, desktop). Default is Both — dual prices everywhere. The choice is saved in localStorage (`glowbook_currency`).
- Services, booking summary, pricing plans, admin revenue (today + month) and the customer total-spent column all show INR + USDT.

### Admin dashboard `/admin`
- Demo login: any email, click **Enter Demo Dashboard** — no real auth.
- **Overview:** today's bookings, revenue today, revenue this month (INR + USDT), total customers, occupancy, pure-CSS bar chart of the last 7 days, today's bookings list.
- **Bookings:** table with status filter (All / Confirmed / Completed / Cancelled), mark complete, cancel.
- **Services:** add / edit / delete service, price, duration, category.
- **Staff:** add / edit / delete staff, role, rating, experience, specialty.
- **Customers:** list with bookings, total spent (INR + USDT), last visit.
- **Salons:** multi-salon list — demo branches Glow Studio Delhi and Glow Studio Mumbai; add / remove branches.
- **Settings:** salon name, address, phone, email, opening hours, UPI ID. Plus reset-demo-data.

## Data

- Storage key: `glowbook_data_v1` in localStorage.
- Seeded on first load: 8 services, 4 staff, 2 salons, 12 sample bookings (last 7 days + today + tomorrow), 20 customers.
- All CRUD updates localStorage and the UI immediately. Try a demo lookup in My Bookings with `98765 43210` (Amit Kumar).

## How to run

```bash
cd salon-booking-saas
npm install
npm run dev
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset: Next.js. No environment variables needed.
4. Deploy. No database to provision — data is per-browser localStorage in this edition.

To turn it into a real multi-tenant SaaS later, replace `lib/store.js` with API routes + a database (e.g. Postgres/Neon) and add real auth — the pages and admin tabs already map 1:1 to those tables.

## Pricing model

- Starter ₹499/mo (~5.68 USDT) — 1 staff, 100 bookings/mo.
- Pro ₹999/mo (~11.35 USDT) — 5 staff, unlimited bookings.
- Premium ₹1999/mo (~22.72 USDT) — unlimited staff and branches.

## Tech

Next.js 14.2.5, React 18, Tailwind CSS 3.4. Dependencies are minimal (Next, React, Tailwind only). All code is original; no existing brand was copied.

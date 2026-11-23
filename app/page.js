"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Price, CurrencyToggle } from "../components/CurrencyProvider";
import { loadData, seedData, formatPrice } from "../lib/store";

const PLANS = [
  { name: "Starter", price: 499, desc: "For single-chair salons getting started online.", features: ["1 staff member", "Up to 100 bookings / month", "Online booking page", "SMS reminders", "Basic reports"] },
  { name: "Pro", price: 999, desc: "For growing salons that need the full toolkit.", features: ["Up to 5 staff members", "Unlimited bookings", "Staff & service manager", "Customer list & history", "Revenue reports", "UPI payment link"], popular: true },
  { name: "Premium", price: 1999, desc: "For chains and multi-branch salons.", features: ["Unlimited staff & branches", "Multi-salon dashboard", "Priority support", "Custom branding", "Advance payments & packages"] },
];

const TESTIMONIALS = [
  { name: "Ramesh Gupta", salon: "Style Hub, Jaipur", text: "Bookings doubled in the first month. Customers love picking their own time slot, and no-shows dropped because of reminders." },
  { name: "Kavita Singh", salon: "Blush Beauty, Pune", text: "I run two branches from one dashboard. The revenue report alone is worth the Pro plan." },
  { name: "Imran Khan", salon: "Cut & Style, Lucknow", text: "Setup took ten minutes. My staff now see their whole day on one screen and we never double-book." },
];

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => { setData(loadData() || seedData()); }, []);
  const services = data ? data.services.slice(0, 6) : [];
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-charcoal-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-block bg-gold-500/20 text-gold-300 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">Salon Booking SaaS — India</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mt-5 leading-tight">Book your glow.<br />Run your salon.</h1>
              <p className="text-charcoal-300 mt-4 text-lg">GlowBook lets customers book haircuts, facials and bridal packages in under a minute — and gives salon owners a live dashboard for bookings, staff and revenue.</p>
              <p className="text-sm text-gold-300 mt-3">Prices in USDT + INR — 1 USDT = ₹88. Pay in rupees or crypto, your choice.</p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link href="/book" className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-3 rounded-full">Book an Appointment</Link>
                <Link href="/admin" className="border border-white/30 hover:bg-white/10 font-semibold px-6 py-3 rounded-full">Try Admin Demo</Link>
              </div>
              <div className="flex gap-6 mt-8 text-sm">
                <div><p className="font-bold text-xl">4.9 / 5</p><p className="text-charcoal-400">Customer rating</p></div>
                <div><p className="font-bold text-xl">2,400+</p><p className="text-charcoal-400">Bookings done</p></div>
                <div><p className="font-bold text-xl">10 AM - 8 PM</p><p className="text-charcoal-400">Open daily</p></div>
              </div>
              <div className="mt-6"><CurrencyToggle /></div>
            </div>
            <div className="bg-white text-charcoal-900 rounded-3xl p-6 shadow-2xl">
              <p className="text-xs tracking-widest uppercase text-gold-600 font-semibold">Popular services</p>
              <h2 className="font-serif text-2xl font-bold mt-1">Today at Glow Studio</h2>
              <div className="mt-4 space-y-3">
                {services.map((s) => (
                  <div key={s.id} className="flex items-center justify-between border-b border-gold-100 pb-3">
                    <div><p className="font-semibold">{s.name}</p><p className="text-xs text-charcoal-500">{s.duration} min · {s.category}</p></div>
                    <Price amount={s.price} className="font-bold text-charcoal-900 whitespace-nowrap" />
                  </div>
                ))}
              </div>
              <Link href="/book" className="mt-5 block text-center bg-charcoal-900 text-white font-semibold py-3 rounded-full hover:bg-charcoal-800">See all services and book</Link>
              <p className="text-xs text-center text-charcoal-500 mt-2">No advance payment needed · Free cancellation up to 2 hours before</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-serif text-3xl font-bold text-center">How it works</h2>
          <p className="text-center text-charcoal-500 mt-2">Four steps, under a minute.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              ["1", "Pick a service", "Haircut, facial, colour, bridal — with clear prices in USDT and INR."],
              ["2", "Choose your expert", "Pick Aarav, Priya or any available staff member."],
              ["3", "Pick date & time", "Next 14 days, 10 AM to 8 PM, live slot availability."],
              ["4", "Confirm & relax", "Get a booking ID like GB-123456. Manage it anytime from My Bookings."],
            ].map(([n, t, d]) => (
              <div key={n} className="bg-white border border-gold-100 rounded-2xl p-5">
                <span className="w-9 h-9 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold">{n}</span>
                <p className="font-semibold mt-3">{t}</p><p className="text-sm text-charcoal-500 mt-1">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services preview */}
        <section className="bg-white border-y border-gold-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
            <div className="flex items-end justify-between gap-4">
              <div><h2 className="font-serif text-3xl font-bold">Services &amp; prices</h2><p className="text-charcoal-500 mt-1">Transparent pricing — USDT and INR shown together.</p></div>
              <Link href="/book" className="hidden sm:inline-block font-semibold text-gold-700 hover:underline">Book now →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {(data ? data.services : []).map((s) => (
                <div key={s.id} className="border border-gold-100 rounded-2xl p-5 hover:shadow-md transition">
                  <div className="flex justify-between gap-3"><p className="font-semibold text-lg">{s.name}</p><span className="text-xs bg-gold-50 text-gold-700 px-2 py-1 rounded-full h-fit">{s.category}</span></div>
                  <p className="text-sm text-charcoal-500 mt-1">{s.description}</p>
                  <div className="flex items-center justify-between mt-4"><Price amount={s.price} className="font-bold text-lg" /><span className="text-sm text-charcoal-500">{s.duration} min</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-serif text-3xl font-bold text-center">Pricing for salon owners</h2>
          <p className="text-center text-charcoal-500 mt-2">Monthly plans in USDT and INR — 1 USDT = ₹88. Cancel anytime.</p>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {PLANS.map((p) => (
              <div key={p.name} className={`rounded-3xl p-6 border ${p.popular ? "bg-charcoal-950 text-white border-charcoal-950 shadow-xl md:-translate-y-2" : "bg-white border-gold-100"}`}>
                {p.popular && <span className="bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
                <p className="font-serif text-xl font-bold mt-3">{p.name}</p>
                <p className={`mt-2 ${p.popular ? "text-3xl" : "text-3xl"} font-bold`}><Price amount={p.price} /></p>
                <p className={`text-sm mt-1 ${p.popular ? "text-charcoal-300" : "text-charcoal-500"}`}>per month · {p.desc}</p>
                <ul className="mt-4 space-y-2 text-sm">{p.features.map((f) => <li key={f}>• {f}</li>)}</ul>
                <Link href="/pricing" className={`mt-6 block text-center font-semibold py-3 rounded-full ${p.popular ? "bg-gold-500 hover:bg-gold-600 text-white" : "bg-charcoal-900 text-white hover:bg-charcoal-800"}`}>Choose {p.name}</Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-charcoal-500 mt-4">Example: Pro at {formatPrice(999)} per month. Starter at {formatPrice(499)}, Premium at {formatPrice(1999)}.</p>
        </section>

        {/* For owners */}
        <section id="owners" className="bg-gold-50 border-y border-gold-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold">For salon owners — one dashboard, every branch</h2>
              <p className="text-charcoal-600 mt-3">GlowBook is multi-salon ready. Run Glow Studio Delhi and Glow Studio Mumbai from the same account, each with its own staff, services and revenue.</p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal-700">
                <li>• Live bookings table with Confirm / Complete / Cancel</li>
                <li>• 7-day bookings chart and revenue in USDT + INR</li>
                <li>• Services and staff manager — add, edit, delete in seconds</li>
                <li>• Customer list with visit history and total spend</li>
                <li>• Salon settings: name, address, hours, UPI ID</li>
              </ul>
              <Link href="/admin" className="inline-block mt-6 bg-charcoal-900 text-white font-semibold px-6 py-3 rounded-full">Open the demo dashboard</Link>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gold-100">
              <p className="text-xs tracking-widest uppercase text-gold-600 font-semibold">Live demo salons</p>
              {(data ? data.salons : []).map((s) => (
                <div key={s.id} className="flex justify-between gap-3 border-b border-gold-100 py-3 last:border-0">
                  <div><p className="font-semibold">{s.name}</p><p className="text-xs text-charcoal-500">{s.address}</p></div>
                  <div className="text-right"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{s.plan}</span><p className="text-xs text-charcoal-500 mt-1">{s.bookingsThisMonth} bookings/mo</p></div>
                </div>
              ))}
              <p className="text-xs text-charcoal-500 mt-3">Add your own salon from the Admin → Salons tab.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="font-serif text-3xl font-bold text-center">Loved by salons across India</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="bg-white border border-gold-100 rounded-2xl p-6">
                <p className="text-gold-500 font-bold tracking-widest">Rated 5.0 / 5</p>
                <blockquote className="text-sm text-charcoal-700 mt-2">“{t.text}”</blockquote>
                <figcaption className="mt-4"><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-charcoal-500">{t.salon}</p></figcaption>
              </figure>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/book" className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-semibold px-8 py-3.5 rounded-full">Book your appointment now</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

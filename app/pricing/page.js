"use client";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Price } from "../../components/CurrencyProvider";
import { formatPrice, USDT_RATE } from "../../lib/store";

const PLANS = [
  { name: "Starter", price: 499, desc: "For single-chair salons getting started online.", features: ["1 staff member", "Up to 100 bookings / month", "Online booking page", "Email support", "Basic reports"], cta: "Start with Starter" },
  { name: "Pro", price: 999, desc: "For growing salons that need the full toolkit.", features: ["Up to 5 staff members", "Unlimited bookings", "Staff & service manager", "Customer list & history", "Revenue reports (USDT + INR)", "UPI payment link", "Priority support"], popular: true, cta: "Start with Pro" },
  { name: "Premium", price: 1999, desc: "For chains and multi-branch salons.", features: ["Unlimited staff & branches", "Multi-salon dashboard", "Custom branding", "Advance payments & packages", "Dedicated account manager"], cta: "Start with Premium" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-center">Simple pricing, in USDT and INR</h1>
        <p className="text-center text-charcoal-500 mt-2 max-w-2xl mx-auto">Every plan is billed monthly. Pay in USDT, or in rupees by UPI. Conversion: 1 USDT = ₹{USDT_RATE}. All prices below show both.</p>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-3xl p-7 border ${p.popular ? "bg-charcoal-950 text-white border-charcoal-950 shadow-xl md:-translate-y-2" : "bg-white border-gold-100"}`}>
              {p.popular && <span className="bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>}
              <p className="font-serif text-2xl font-bold mt-3">{p.name}</p>
              <p className="text-3xl font-bold mt-2"><Price amount={p.price} /></p>
              <p className="text-sm mt-1 opacity-70">per month · {formatPrice(p.price)} · cancel anytime</p>
              <p className={`text-sm mt-3 ${p.popular ? "text-charcoal-300" : "text-charcoal-500"}`}>{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">{p.features.map((f) => <li key={f}>• {f}</li>)}</ul>
              <Link href="/admin" className={`mt-7 block text-center font-semibold py-3 rounded-full ${p.popular ? "bg-gold-500 hover:bg-gold-600 text-white" : "bg-charcoal-900 text-white hover:bg-charcoal-800"}`}>{p.cta}</Link>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gold-100 rounded-3xl p-6 mt-10">
          <h2 className="font-serif text-2xl font-bold">How the SaaS model works</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-4 text-sm text-charcoal-600">
            <div><p className="font-semibold text-charcoal-900">1. Salon signs up</p><p className="mt-1">Pick a plan, add your salon name, staff and services. Your booking page is live in minutes.</p></div>
            <div><p className="font-semibold text-charcoal-900">2. Customers book online</p><p className="mt-1">They pick a service, staff, date and time, and pay at the salon — in USDT or INR.</p></div>
            <div><p className="font-semibold text-charcoal-900">3. You earn monthly</p><p className="mt-1">You collect the subscription every month, per salon. Premium covers unlimited branches.</p></div>
          </div>
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b border-gold-100"><th className="py-2 pr-3">Plan</th><th className="py-2 pr-3">USDT / month</th><th className="py-2 pr-3">INR / month</th><th className="py-2">Best for</th></tr></thead>
              <tbody>
                {PLANS.map((p) => (
                  <tr key={p.name} className="border-b border-gold-50"><td className="py-2.5 pr-3 font-semibold">{p.name}</td><td className="py-2.5 pr-3">{(p.price / USDT_RATE).toFixed(2)} USDT</td><td className="py-2.5 pr-3">₹{p.price.toLocaleString("en-IN")}</td><td className="py-2.5">{p.desc}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-charcoal-500 mt-3">USDT amounts are calculated at 1 USDT = ₹{USDT_RATE} and shown to 2 decimal places.</p>
        </div>

        <div className="text-center mt-10">
          <Link href="/book" className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-semibold px-8 py-3.5 rounded-full">Book a demo appointment</Link>
          <Link href="/admin" className="inline-block ml-3 border border-charcoal-200 font-semibold px-8 py-3.5 rounded-full">See the admin dashboard</Link>
        </div>
      </main><Footer />
    </div>
  );
}

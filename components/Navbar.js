"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CurrencyToggle } from "./CurrencyProvider";

export default function Navbar() {
  const pathname = usePathname();
  const link = (href, label) => (
    <Link key={href} href={href} className={`text-sm font-medium px-3 py-2 rounded-full ${pathname === href ? "bg-charcoal-900 text-white" : "text-charcoal-700 hover:bg-gold-100"}`}>{label}</Link>
  );
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gold-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-charcoal-900 text-gold-300 flex items-center justify-center font-serif font-bold text-lg">G</span>
          <span className="leading-none">
            <span className="block font-serif font-bold text-xl text-charcoal-900">GlowBook</span>
            <span className="block text-[11px] tracking-widest uppercase text-gold-600">Salon Booking</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {link("/", "Home")}
          {link("/book", "Book Now")}
          {link("/pricing", "Pricing")}
          {link("/my-bookings", "My Bookings")}
          {link("/admin", "Admin")}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden lg:block"><CurrencyToggle /></span>
          <Link href="/book" className="bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full">Book Now</Link>
          <Link href="/admin" className="hidden sm:inline-block border border-charcoal-200 text-charcoal-800 text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-charcoal-50">For Owners</Link>
        </div>
      </div>
      <nav className="md:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
        {link("/", "Home")}{link("/book", "Book Now")}{link("/pricing", "Pricing")}{link("/my-bookings", "My Bookings")}{link("/admin", "Admin")}
      </nav>
    </header>
  );
}

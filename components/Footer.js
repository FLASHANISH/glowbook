import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-charcoal-950 text-charcoal-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="font-serif font-bold text-xl text-white">GlowBook</p>
          <p className="text-sm mt-2 text-charcoal-300">Salon booking made simple for customers and powerful for salon owners.</p>
          <p className="text-sm mt-3">hello@glowbook.in<br />+91 98110 12345</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Customers</p>
          <ul className="space-y-2 text-sm"><li><Link href="/book" className="hover:text-gold-300">Book Appointment</Link></li><li><Link href="/my-bookings" className="hover:text-gold-300">My Bookings</Link></li><li><Link href="/pricing" className="hover:text-gold-300">Pricing</Link></li></ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Salon Owners</p>
          <ul className="space-y-2 text-sm"><li><Link href="/admin" className="hover:text-gold-300">Admin Dashboard</Link></li><li><Link href="/pricing" className="hover:text-gold-300">Plans</Link></li><li><Link href="/#owners" className="hover:text-gold-300">For Salon Owners</Link></li></ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Glow Studio</p>
          <p className="text-sm text-charcoal-300">12, MG Road, Connaught Place,<br />New Delhi 110001<br />Open daily: 10:00 AM - 8:00 PM</p>
        </div>
      </div>
      <div className="border-t border-charcoal-800 py-4 text-center text-xs text-charcoal-400">© 2026 GlowBook. All rights reserved. Demo data is stored locally in your browser.</div>
    </footer>
  );
}

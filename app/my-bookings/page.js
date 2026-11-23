"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Price } from "../../components/CurrencyProvider";
import { loadData, saveData, seedData } from "../../lib/store";

export default function MyBookingsPage() {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [data, setData] = useState(null);

  function lookup() {
    const digits = phone.replace(/\D/g, "").slice(-10);
    const d = loadData() || seedData();
    setData(d);
    setResults(d.bookings.filter((b) => b.phone.replace(/\D/g, "").slice(-10) === digits));
    setSearched(true);
  }
  function cancelBooking(id) {
    if (!window.confirm("Cancel this booking?")) return;
    const next = { ...data, bookings: data.bookings.map((b) => b.id === id ? { ...b, status: "Cancelled" } : b) };
    saveData(next); setData(next);
    setResults(next.bookings.filter((b) => b.phone.replace(/\D/g, "").slice(-10) === phone.replace(/\D/g, "").slice(-10)));
  }
  function rescheduleBooking(b) {
    if (!window.confirm(`Reschedule ${b.id}? You will be taken to the booking page to pick a new slot.`)) return;
    window.location.href = "/book";
  }

  return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
        <h1 className="font-serif text-3xl font-bold">My Bookings</h1>
        <p className="text-charcoal-500 mt-1">Enter the phone number you booked with to see, cancel or reschedule your appointments.</p>
        <div className="bg-white border border-gold-100 rounded-3xl p-6 mt-6">
          <label className="block text-sm font-semibold">Phone number</label>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="98765 43210" className="flex-1 border border-charcoal-200 rounded-xl px-4 py-3" />
            <button onClick={lookup} className="bg-charcoal-900 text-white font-semibold px-6 py-3 rounded-full">Find Bookings</button>
          </div>
          <p className="text-xs text-charcoal-500 mt-2">Try a demo number from the seeded data, e.g. 98765 43210 (Amit Kumar) or 98123 45678 (Rahul Singh).</p>
        </div>

        {searched && (
          <div className="mt-6">
            {results.length === 0 ? (
              <div className="bg-white border border-gold-100 rounded-3xl p-6 text-center">
                <p className="font-semibold">No bookings found for this number.</p>
                <p className="text-sm text-charcoal-500 mt-1">Check the number, or book a new appointment.</p>
                <Link href="/book" className="inline-block mt-4 bg-gold-500 text-white font-semibold px-5 py-2.5 rounded-full">Book Now</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((b) => (
                  <div key={b.id} className="bg-white border border-gold-100 rounded-3xl p-5">
                    <div className="flex flex-wrap justify-between gap-2">
                      <div><p className="font-bold">{b.serviceNames.join(", ")}</p><p className="text-sm text-charcoal-500">{b.id} · {b.staffName}</p></div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${b.status === "Confirmed" ? "bg-blue-100 text-blue-700" : b.status === "Completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.status}</span>
                    </div>
                    <p className="text-sm mt-2">{b.dateLabel} at {b.time} · {b.duration} min · <Price amount={b.total} className="font-semibold" /></p>
                    <p className="text-sm text-charcoal-500">{b.customerName} · {b.phone}</p>
                    {b.status === "Confirmed" && (
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => rescheduleBooking(b)} className="border border-charcoal-200 font-semibold text-sm px-4 py-2 rounded-full">Reschedule</button>
                        <button onClick={() => cancelBooking(b.id)} className="bg-red-50 text-red-700 font-semibold text-sm px-4 py-2 rounded-full">Cancel Booking</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main><Footer />
    </div>
  );
}

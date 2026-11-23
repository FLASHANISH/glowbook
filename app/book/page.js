"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Price } from "../../components/CurrencyProvider";
import { loadData, saveData, seedData, generateBookingId, getNext14Days, getTimeSlots, formatUSDT } from "../../lib/store";

const STEPS = ["Services", "Staff", "Date & Time", "Your Details"];

export default function BookPage() {
  const [data, setData] = useState(null);
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [staffId, setStaffId] = useState("any");
  const [dateIso, setDateIso] = useState(getNext14Days()[0].iso);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  useEffect(() => { setData(loadData() || seedData()); }, []);
  const days = useMemo(() => getNext14Days(), []);
  const slots = useMemo(() => getTimeSlots(dateIso), [dateIso]);
  const selectedDate = days.find((d) => d.iso === dateIso);

  const total = (data ? data.services : []).filter((s) => selectedServices.includes(s.id)).reduce((a, s) => a + s.price, 0);
  const duration = (data ? data.services : []).filter((s) => selectedServices.includes(s.id)).reduce((a, s) => a + s.duration, 0);
  const staffName = staffId === "any" ? "Any Staff" : (data?.staff.find((s) => s.id === staffId)?.name || "Any Staff");

  function toggleService(id) {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }
  function canNext() {
    if (step === 0) return selectedServices.length > 0;
    if (step === 1) return true;
    if (step === 2) return !!time;
    return false;
  }
  function confirmBooking() {
    if (!name.trim()) { setError("Please enter your name."); return; }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) { setError("Please enter a valid 10-digit phone number."); return; }
    setError("");
    const services = data.services.filter((s) => selectedServices.includes(s.id));
    const booking = {
      id: generateBookingId(),
      customerName: name.trim(),
      phone: "+91 " + digits.slice(-10),
      serviceIds: services.map((s) => s.id),
      serviceNames: services.map((s) => s.name),
      staffId, staffName,
      date: dateIso, dateLabel: selectedDate ? selectedDate.label : dateIso,
      time, total, duration, status: "Confirmed", notes: notes.trim(), createdAt: new Date().toISOString(),
    };
    const next = { ...data, bookings: [booking, ...data.bookings] };
    if (!next.customers.some((c) => c.phone === booking.phone)) {
      next.customers = [{ id: "cus-" + Date.now(), name: booking.customerName, phone: booking.phone, bookings: 1, totalSpent: total, lastVisit: dateIso }, ...next.customers];
    }
    saveData(next); setData(next); setDone(booking);
  }
  function reset() {
    setDone(null); setStep(0); setSelectedServices([]); setStaffId("any"); setTime(""); setName(""); setPhone(""); setNotes("");
  }

  if (!data) return <div className="min-h-screen bg-[#FDFBF7]"><Navbar /><p className="text-center py-20 text-charcoal-500">Loading services...</p></div>;

  if (done) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
          <div className="bg-white border border-gold-100 rounded-3xl p-8 text-center shadow-sm">
            <span className="w-14 h-14 rounded-full bg-green-100 text-green-700 text-2xl flex items-center justify-center mx-auto">Done</span>
            <h1 className="font-serif text-3xl font-bold mt-4">Booking confirmed</h1>
            <p className="text-charcoal-500 mt-1">We look forward to seeing you, {done.customerName}.</p>
            <div className="bg-gold-50 rounded-2xl p-5 mt-6 text-left space-y-2 text-sm">
              <p><b>Booking ID:</b> {done.id}</p>
              <p><b>Services:</b> {done.serviceNames.join(", ")}</p>
              <p><b>Staff:</b> {done.staffName}</p>
              <p><b>Date:</b> {done.dateLabel} at {done.time}</p>
              <p><b>Duration:</b> {done.duration} minutes</p>
              <p><b>Total:</b> <Price amount={done.total} className="font-bold" /></p>
              <p><b>Phone:</b> {done.phone}</p>
              {done.notes && <p><b>Notes:</b> {done.notes}</p>}
            </div>
            <p className="text-xs text-charcoal-500 mt-4">Show this booking ID at the salon. Pay at the salon by cash, UPI or card. Free cancellation up to 2 hours before your slot — see My Bookings.</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link href="/my-bookings" className="bg-charcoal-900 text-white font-semibold px-5 py-3 rounded-full">View My Bookings</Link>
              <button onClick={reset} className="border border-charcoal-200 font-semibold px-5 py-3 rounded-full">Book Another</button>
              <Link href="/" className="font-semibold px-5 py-3 rounded-full hover:bg-gold-50">Home</Link>
            </div>
          </div>
        </main><Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        <h1 className="font-serif text-3xl font-bold">Book an appointment</h1>
        <p className="text-charcoal-500 mt-1">Prices shown in USDT + INR (1 USDT = ₹88).</p>
        <div className="flex gap-2 mt-6 overflow-x-auto">
          {STEPS.map((label, i) => (
            <button key={label} onClick={() => i < step && setStep(i)} className={`flex-1 min-w-[110px] text-left px-4 py-3 rounded-2xl border text-sm font-semibold ${i === step ? "bg-charcoal-900 text-white border-charcoal-900" : i < step ? "bg-gold-100 border-gold-200 text-charcoal-800" : "bg-white border-gold-100 text-charcoal-500"}`}>
              <span className="block text-xs opacity-70">Step {i + 1}</span>{label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6 items-start">
          <div className="lg:col-span-2 bg-white border border-gold-100 rounded-3xl p-6">
            {step === 0 && (
              <div>
                <h2 className="font-semibold text-lg">Select service(s)</h2>
                <p className="text-sm text-charcoal-500">Pick one or more. Prices in USDT + INR.</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {data.services.map((s) => {
                    const active = selectedServices.includes(s.id);
                    return (
                      <button key={s.id} onClick={() => toggleService(s.id)} className={`text-left border rounded-2xl p-4 ${active ? "border-gold-500 bg-gold-50 ring-2 ring-gold-300" : "border-gold-100 hover:border-gold-300"}`}>
                        <div className="flex justify-between gap-2"><span className="font-semibold">{s.name}</span><span className="text-xs bg-gold-50 text-gold-700 px-2 py-1 rounded-full h-fit">{s.category}</span></div>
                        <p className="text-sm text-charcoal-500 mt-1">{s.description}</p>
                        <p className="mt-2 text-sm"><Price amount={s.price} className="font-bold" /> <span className="text-charcoal-500">· {s.duration} min</span></p>
                        <p className="text-xs font-semibold mt-1 text-gold-700">{active ? "Selected" : "Tap to select"}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {step === 1 && (
              <div>
                <h2 className="font-semibold text-lg">Select staff</h2>
                <p className="text-sm text-charcoal-500">Choose your expert, or let us assign the best available.</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <button onClick={() => setStaffId("any")} className={`text-left border rounded-2xl p-4 ${staffId === "any" ? "border-gold-500 bg-gold-50 ring-2 ring-gold-300" : "border-gold-100"}`}>
                    <p className="font-semibold">Any Staff</p><p className="text-sm text-charcoal-500 mt-1">First available expert for your services.</p>
                  </button>
                  {data.staff.map((s) => (
                    <button key={s.id} onClick={() => setStaffId(s.id)} className={`text-left border rounded-2xl p-4 ${staffId === s.id ? "border-gold-500 bg-gold-50 ring-2 ring-gold-300" : "border-gold-100 hover:border-gold-300"}`}>
                      <div className="flex justify-between"><p className="font-semibold">{s.name}</p><span className="text-sm font-bold text-gold-700">{s.rating} / 5</span></div>
                      <p className="text-sm text-charcoal-500 mt-1">{s.role} · {s.experience}</p>
                      <p className="text-xs text-charcoal-500">{s.specialty}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="font-semibold text-lg">Select date &amp; time</h2>
                <p className="text-sm text-charcoal-500">Open 10:00 AM - 8:00 PM, every day. Grey slots are already booked.</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-4">
                  {days.map((d) => (
                    <button key={d.iso} onClick={() => { setDateIso(d.iso); setTime(""); }} className={`rounded-2xl border py-3 px-1 text-center ${dateIso === d.iso ? "bg-charcoal-900 text-white border-charcoal-900" : "bg-white border-gold-100 hover:border-gold-300"}`}>
                      <span className="block text-xs">{d.dayName}{d.isToday ? " · Today" : ""}</span>
                      <span className="block font-bold text-lg">{d.dayNum}</span>
                    </button>
                  ))}
                </div>
                <p className="font-semibold mt-6">{selectedDate?.label}</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                  {slots.map((slot) => (
                    <button key={slot.label} disabled={slot.booked} onClick={() => setTime(slot.label)} className={`py-2.5 rounded-full text-sm font-semibold border ${slot.booked ? "bg-charcoal-50 text-charcoal-300 border-charcoal-100 line-through cursor-not-allowed" : time === slot.label ? "bg-gold-500 text-white border-gold-500" : "bg-white border-gold-200 hover:border-gold-500"}`}>{slot.label}</button>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="font-semibold text-lg">Your details</h2>
                <p className="text-sm text-charcoal-500">We use your phone number to find your bookings later.</p>
                {error && <p className="mt-3 bg-red-50 text-red-700 text-sm font-medium px-4 py-2.5 rounded-xl">{error}</p>}
                <div className="space-y-4 mt-4">
                  <label className="block"><span className="text-sm font-semibold">Full name *</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anish Kumar" className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
                  <label className="block"><span className="text-sm font-semibold">Phone (WhatsApp) *</span><input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="98765 43210" className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
                  <label className="block"><span className="text-sm font-semibold">Notes (optional)</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, preferred style, anything we should know..." rows={3} className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
                </div>
              </div>
            )}
            <div className="flex justify-between mt-7">
              <button disabled={step === 0} onClick={() => setStep(step - 1)} className="font-semibold px-5 py-3 rounded-full border border-charcoal-200 disabled:opacity-40">Back</button>
              {step < 3 ? (
                <button disabled={!canNext()} onClick={() => setStep(step + 1)} className="bg-charcoal-900 text-white font-semibold px-6 py-3 rounded-full disabled:opacity-40">Continue</button>
              ) : (
                <button onClick={confirmBooking} className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-3 rounded-full">Confirm Booking</button>
              )}
            </div>
          </div>

          <aside className="bg-white border border-gold-100 rounded-3xl p-6 lg:sticky lg:top-24">
            <h2 className="font-semibold">Booking summary</h2>
            {selectedServices.length === 0 ? <p className="text-sm text-charcoal-500 mt-2">No service selected yet.</p> : (
              <div className="mt-3 space-y-2 text-sm">
                {data.services.filter((s) => selectedServices.includes(s.id)).map((s) => (
                  <p key={s.id} className="flex justify-between gap-2"><span>{s.name} <span className="text-charcoal-400">({s.duration}m)</span></span><Price amount={s.price} className="font-semibold whitespace-nowrap" /></p>
                ))}
                <p className="flex justify-between border-t border-gold-100 pt-2"><span>Staff</span><b>{staffName}</b></p>
                <p className="flex justify-between"><span>Date</span><b>{selectedDate?.label}</b></p>
                <p className="flex justify-between"><span>Time</span><b>{time || "—"}</b></p>
                <p className="flex justify-between"><span>Total duration</span><b>{duration} min</b></p>
                <p className="flex justify-between border-t border-gold-100 pt-2 text-base"><span>Total</span><Price amount={total} className="font-bold" /></p>
                <p className="text-xs text-charcoal-500">Total: {formatUSDT(total)} — 1 USDT = ₹88.</p>
              </div>
            )}
            <p className="text-xs text-charcoal-500 mt-4">Pay at the salon. Free cancellation up to 2 hours before your slot.</p>
          </aside>
        </div>
      </main><Footer />
    </div>
  );
}

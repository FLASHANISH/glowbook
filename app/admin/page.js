"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Price } from "../../components/CurrencyProvider";
import { loadData, saveData, seedData, formatPrice, USDT_RATE, formatUSDT } from "../../lib/store";

const TABS = ["Overview", "Bookings", "Services", "Staff", "Customers", "Salons", "Settings"];

function todayIso() { return new Date().toISOString().slice(0, 10); }
function monthPrefix() { return new Date().toISOString().slice(0, 7); }

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState("Overview");
  const [filter, setFilter] = useState("All");
  const [svcForm, setSvcForm] = useState({ name: "", category: "Hair", price: "", duration: "", description: "" });
  const [editingSvc, setEditingSvc] = useState(null);
  const [staffForm, setStaffForm] = useState({ name: "", role: "", rating: "4.8", experience: "", specialty: "" });
  const [editingStaff, setEditingStaff] = useState(null);
  const [salonForm, setSalonForm] = useState({ name: "", city: "", address: "", phone: "", plan: "Starter" });

  useEffect(() => { setData(loadData() || seedData()); }, []);
  useEffect(() => { if (data) setSvcForm((f) => f); }, [data]);

  function update(next) { saveData(next); setData(next); }
  function setStatus(id, status) {
    update({ ...data, bookings: data.bookings.map((b) => b.id === id ? { ...b, status } : b) });
  }
  function saveService(e) {
    e.preventDefault();
    const price = Number(svcForm.price) || 0, duration = Number(svcForm.duration) || 30;
    if (!svcForm.name.trim() || price <= 0) return;
    if (editingSvc) {
      update({ ...data, services: data.services.map((s) => s.id === editingSvc ? { ...s, name: svcForm.name.trim(), category: svcForm.category, price, duration, description: svcForm.description } : s) });
    } else {
      update({ ...data, services: [...data.services, { id: "svc-" + Date.now(), name: svcForm.name.trim(), category: svcForm.category, price, duration, description: svcForm.description || "Salon service." }] });
    }
    setSvcForm({ name: "", category: "Hair", price: "", duration: "", description: "" }); setEditingSvc(null);
  }
  function saveStaff(e) {
    e.preventDefault();
    if (!staffForm.name.trim()) return;
    if (editingStaff) {
      update({ ...data, staff: data.staff.map((s) => s.id === editingStaff ? { ...s, name: staffForm.name.trim(), role: staffForm.role, rating: Number(staffForm.rating) || 4.8, experience: staffForm.experience, specialty: staffForm.specialty } : s) });
    } else {
      update({ ...data, staff: [...data.staff, { id: "st-" + Date.now(), name: staffForm.name.trim(), role: staffForm.role || "Stylist", rating: Number(staffForm.rating) || 4.8, experience: staffForm.experience || "2 years", specialty: staffForm.specialty || "General" }] });
    }
    setStaffForm({ name: "", role: "", rating: "4.8", experience: "", specialty: "" }); setEditingStaff(null);
  }
  function saveSalon(e) {
    e.preventDefault();
    if (!salonForm.name.trim()) return;
    update({ ...data, salons: [...data.salons, { id: "sal-" + Date.now(), name: salonForm.name.trim(), city: salonForm.city, address: salonForm.address, phone: salonForm.phone, plan: salonForm.plan, status: "Active", bookingsThisMonth: 0 }] });
    setSalonForm({ name: "", city: "", address: "", phone: "", plan: "Starter" });
  }
  function saveSettings(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    update({ ...data, settings: { ...data.settings, salonName: String(form.get("salonName") || ""), address: String(form.get("address") || ""), phone: String(form.get("phone") || ""), email: String(form.get("email") || ""), openingHours: String(form.get("openingHours") || ""), upiId: String(form.get("upiId") || "") } });
    alert("Settings saved.");
  }

  const stats = useMemo(() => {
    if (!data) return null;
    const today = todayIso(), month = monthPrefix();
    const todayBookings = data.bookings.filter((b) => b.date === today && b.status !== "Cancelled");
    const revenueToday = todayBookings.reduce((a, b) => a + b.total, 0);
    const monthBookings = data.bookings.filter((b) => b.date.startsWith(month) && b.status !== "Cancelled");
    const revenueMonth = monthBookings.reduce((a, b) => a + b.total, 0);
    const totalSlots = 20; // 10 AM - 8 PM, 30-min slots
    const occupancy = Math.min(100, Math.round((todayBookings.length / totalSlots) * 100));
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const count = data.bookings.filter((b) => b.date === iso && b.status !== "Cancelled").length;
      last7.push({ iso, label: d.toLocaleDateString("en-IN", { weekday: "short" }), count });
    }
    return { todayBookings: todayBookings.length, revenueToday, revenueMonth, customers: data.customers.length, occupancy, last7, maxDay: Math.max(1, ...last7.map((x) => x.count)) };
  }, [data]);

  if (!data) return <div className="min-h-screen"><Navbar /><p className="text-center py-20 text-charcoal-500">Loading dashboard...</p></div>;

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-14 w-full">
          <div className="bg-white border border-gold-100 rounded-3xl p-8">
            <p className="text-xs tracking-widest uppercase text-gold-600 font-semibold">GlowBook Admin</p>
            <h1 className="font-serif text-2xl font-bold mt-2">Salon owner dashboard</h1>
            <p className="text-sm text-charcoal-500 mt-1">Demo login — no real auth. Enter any email and press the button.</p>
            <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }} className="mt-5 space-y-4">
              <label className="block"><span className="text-sm font-semibold">Email</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="owner@glowstudio.in" className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
              <label className="block"><span className="text-sm font-semibold">Password</span><input type="password" placeholder="Any password works in this demo" className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
              <button className="w-full bg-charcoal-900 text-white font-semibold py-3 rounded-full">Enter Demo Dashboard</button>
            </form>
            <p className="text-xs text-charcoal-500 mt-4 text-center">Demo data is seeded locally in your browser (localStorage key glowbook_data_v1). Changes you make here appear on the booking pages too.</p>
            <Link href="/book" className="block text-center text-sm font-semibold text-gold-700 mt-3 hover:underline">Go to booking page instead →</Link>
          </div>
        </main><Footer />
      </div>
    );
  }

  const filteredBookings = filter === "All" ? data.bookings : data.bookings.filter((b) => b.status === filter);

  return (
    <div className="min-h-screen flex flex-col"><Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="font-serif text-3xl font-bold">{data.settings.salonName} — Admin</h1><p className="text-charcoal-500 text-sm">Welcome back{email ? ", " + email : ""}. Today is {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.</p></div>
          <div className="flex gap-2"><Link href="/book" className="bg-gold-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full">View Booking Page</Link><button onClick={() => setLoggedIn(false)} className="border border-charcoal-200 text-sm font-semibold px-4 py-2.5 rounded-full">Log Out</button></div>
        </div>

        <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
          {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap ${tab === t ? "bg-charcoal-900 text-white" : "bg-white border border-gold-100 text-charcoal-700"}`}>{t}</button>)}
        </div>

        {tab === "Overview" && stats && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gold-100 rounded-2xl p-5"><p className="text-sm text-charcoal-500">Today's bookings</p><p className="text-3xl font-bold mt-1">{stats.todayBookings}</p><p className="text-xs text-charcoal-500">{data.bookings.filter((b) => b.date === todayIso()).length} total incl. cancelled</p></div>
              <div className="bg-white border border-gold-100 rounded-2xl p-5"><p className="text-sm text-charcoal-500">Revenue today</p><p className="text-2xl font-bold mt-1"><Price amount={stats.revenueToday} /></p><p className="text-xs text-charcoal-500">Month: {formatPrice(stats.revenueMonth)}</p></div>
              <div className="bg-white border border-gold-100 rounded-2xl p-5"><p className="text-sm text-charcoal-500">Revenue this month</p><p className="text-2xl font-bold mt-1"><Price amount={stats.revenueMonth} /></p><p className="text-xs text-charcoal-500">{formatUSDT(stats.revenueMonth)} at 1 USDT = ₹{USDT_RATE}</p></div>
              <div className="bg-white border border-gold-100 rounded-2xl p-5"><p className="text-sm text-charcoal-500">Customers · Occupancy</p><p className="text-3xl font-bold mt-1">{stats.customers} · {stats.occupancy}%</p><p className="text-xs text-charcoal-500">Occupancy = today's bookings / 20 slots</p></div>
            </div>
            <div className="bg-white border border-gold-100 rounded-3xl p-6">
              <h2 className="font-semibold">Bookings — last 7 days</h2>
              <p className="text-xs text-charcoal-500">Pure CSS bar chart. No chart library needed.</p>
              <div className="flex items-end gap-3 h-44 mt-6">
                {stats.last7.map((d) => (
                  <div key={d.iso} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-sm font-bold">{d.count}</span>
                    <div className="w-full bg-gold-500 rounded-t-lg" style={{ height: `${Math.max(6, (d.count / stats.maxDay) * 110)}px` }} />
                    <span className="text-xs text-charcoal-500">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gold-100 rounded-3xl p-6">
              <h2 className="font-semibold">Today's bookings</h2>
              <div className="mt-3 space-y-2 text-sm">
                {data.bookings.filter((b) => b.date === todayIso()).length === 0 && <p className="text-charcoal-500">No bookings today yet.</p>}
                {data.bookings.filter((b) => b.date === todayIso()).map((b) => (
                  <p key={b.id} className="flex flex-wrap justify-between gap-2 border-b border-gold-50 pb-2"><span>{b.time} — {b.customerName} · {b.serviceNames.join(", ")} ({b.staffName})</span><span><Price amount={b.total} className="font-semibold" /> · {b.status}</span></p>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Bookings" && (
          <div className="mt-6 bg-white border border-gold-100 rounded-3xl p-6">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <h2 className="font-semibold text-lg">All bookings ({data.bookings.length})</h2>
              <div className="flex gap-2">{["All", "Confirmed", "Completed", "Cancelled"].map((f) => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filter === f ? "bg-charcoal-900 text-white" : "bg-gold-50 text-charcoal-700"}`}>{f}</button>)}</div>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm min-w-[760px]">
                <thead><tr className="text-left border-b border-gold-100 text-charcoal-500"><th className="py-2 pr-3">Booking</th><th className="py-2 pr-3">Customer</th><th className="py-2 pr-3">Service</th><th className="py-2 pr-3">Date / Time</th><th className="py-2 pr-3">Total (USDT + INR)</th><th className="py-2 pr-3">Status</th><th className="py-2">Actions</th></tr></thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gold-50">
                      <td className="py-3 pr-3 font-semibold">{b.id}</td>
                      <td className="py-3 pr-3">{b.customerName}<br /><span className="text-xs text-charcoal-500">{b.phone}</span></td>
                      <td className="py-3 pr-3">{b.serviceNames.join(", ")}<br /><span className="text-xs text-charcoal-500">{b.staffName}</span></td>
                      <td className="py-3 pr-3">{b.dateLabel}<br /><span className="text-xs text-charcoal-500">{b.time}</span></td>
                      <td className="py-3 pr-3"><Price amount={b.total} /></td>
                      <td className="py-3 pr-3"><span className={`text-xs font-bold px-2 py-1 rounded-full ${b.status === "Confirmed" ? "bg-blue-100 text-blue-700" : b.status === "Completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.status}</span></td>
                      <td className="py-3"><div className="flex gap-1.5">{b.status === "Confirmed" && <button onClick={() => setStatus(b.id, "Completed")} className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1.5 rounded-full">Complete</button>}{b.status !== "Cancelled" && <button onClick={() => setStatus(b.id, "Cancelled")} className="text-xs font-semibold bg-red-50 text-red-700 px-2.5 py-1.5 rounded-full">Cancel</button>}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && <p className="text-sm text-charcoal-500 py-6 text-center">No bookings with this status.</p>}
            </div>
          </div>
        )}

        {tab === "Services" && (
          <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
            <form onSubmit={saveService} className="bg-white border border-gold-100 rounded-3xl p-6 space-y-3">
              <h2 className="font-semibold">{editingSvc ? "Edit service" : "Add service"}</h2>
              <input value={svcForm.name} onChange={(e) => setSvcForm({ ...svcForm, name: e.target.value })} placeholder="Service name" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <select value={svcForm.category} onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value })} className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5 bg-white">{["Hair", "Grooming", "Skin", "Nails", "Relaxation", "Bridal"].map((c) => <option key={c}>{c}</option>)}</select>
              <div className="grid grid-cols-2 gap-3">
                <input value={svcForm.price} onChange={(e) => setSvcForm({ ...svcForm, price: e.target.value })} inputMode="numeric" placeholder="Price (INR)" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
                <input value={svcForm.duration} onChange={(e) => setSvcForm({ ...svcForm, duration: e.target.value })} inputMode="numeric" placeholder="Minutes" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              </div>
              {svcForm.price && <p className="text-xs text-charcoal-500">That is {formatPrice(Number(svcForm.price) || 0)} — shown to customers in USDT + INR.</p>}
              <textarea value={svcForm.description} onChange={(e) => setSvcForm({ ...svcForm, description: e.target.value })} placeholder="Description" rows={2} className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <button className="w-full bg-charcoal-900 text-white font-semibold py-3 rounded-full">{editingSvc ? "Save changes" : "Add service"}</button>
              {editingSvc && <button type="button" onClick={() => { setEditingSvc(null); setSvcForm({ name: "", category: "Hair", price: "", duration: "", description: "" }); }} className="w-full border border-charcoal-200 font-semibold py-2.5 rounded-full text-sm">Cancel edit</button>}
            </form>
            <div className="lg:col-span-2 bg-white border border-gold-100 rounded-3xl p-6">
              <h2 className="font-semibold">Services ({data.services.length})</h2>
              <div className="divide-y divide-gold-50 mt-2">
                {data.services.map((s) => (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div><p className="font-semibold">{s.name} <span className="text-xs text-charcoal-500">· {s.category} · {s.duration} min</span></p><p className="text-sm text-charcoal-500">{s.description}</p></div>
                    <div className="flex items-center gap-3"><Price amount={s.price} className="font-bold" />
                      <button onClick={() => { setEditingSvc(s.id); setSvcForm({ name: s.name, category: s.category, price: String(s.price), duration: String(s.duration), description: s.description }); }} className="text-xs font-semibold bg-gold-50 text-gold-700 px-3 py-1.5 rounded-full">Edit</button>
                      <button onClick={() => update({ ...data, services: data.services.filter((x) => x.id !== s.id) })} className="text-xs font-semibold bg-red-50 text-red-700 px-3 py-1.5 rounded-full">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Staff" && (
          <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
            <form onSubmit={saveStaff} className="bg-white border border-gold-100 rounded-3xl p-6 space-y-3">
              <h2 className="font-semibold">{editingStaff ? "Edit staff" : "Add staff"}</h2>
              <input value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} placeholder="Full name" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <input value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} placeholder="Role, e.g. Hair Expert" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <input value={staffForm.specialty} onChange={(e) => setStaffForm({ ...staffForm, specialty: e.target.value })} placeholder="Specialty" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <div className="grid grid-cols-2 gap-3">
                <input value={staffForm.rating} onChange={(e) => setStaffForm({ ...staffForm, rating: e.target.value })} placeholder="Rating (4.8)" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
                <input value={staffForm.experience} onChange={(e) => setStaffForm({ ...staffForm, experience: e.target.value })} placeholder="Experience" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              </div>
              <button className="w-full bg-charcoal-900 text-white font-semibold py-3 rounded-full">{editingStaff ? "Save changes" : "Add staff"}</button>
              {editingStaff && <button type="button" onClick={() => { setEditingStaff(null); setStaffForm({ name: "", role: "", rating: "4.8", experience: "", specialty: "" }); }} className="w-full border border-charcoal-200 font-semibold py-2.5 rounded-full text-sm">Cancel edit</button>}
            </form>
            <div className="lg:col-span-2 bg-white border border-gold-100 rounded-3xl p-6">
              <h2 className="font-semibold">Staff ({data.staff.length})</h2>
              <div className="divide-y divide-gold-50 mt-2">
                {data.staff.map((s) => (
                  <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div><p className="font-semibold">{s.name} <span className="text-gold-600">{s.rating} / 5</span></p><p className="text-sm text-charcoal-500">{s.role} · {s.experience} · {s.specialty}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingStaff(s.id); setStaffForm({ name: s.name, role: s.role, rating: String(s.rating), experience: s.experience, specialty: s.specialty }); }} className="text-xs font-semibold bg-gold-50 text-gold-700 px-3 py-1.5 rounded-full">Edit</button>
                      <button onClick={() => update({ ...data, staff: data.staff.filter((x) => x.id !== s.id) })} className="text-xs font-semibold bg-red-50 text-red-700 px-3 py-1.5 rounded-full">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Customers" && (
          <div className="mt-6 bg-white border border-gold-100 rounded-3xl p-6">
            <h2 className="font-semibold text-lg">Customers ({data.customers.length})</h2>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm min-w-[560px]">
                <thead><tr className="text-left border-b border-gold-100 text-charcoal-500"><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Phone</th><th className="py-2 pr-3">Bookings</th><th className="py-2 pr-3">Total spent</th><th className="py-2">Last visit</th></tr></thead>
                <tbody>{data.customers.map((c) => (
                  <tr key={c.id} className="border-b border-gold-50"><td className="py-2.5 pr-3 font-semibold">{c.name}</td><td className="py-2.5 pr-3">{c.phone}</td><td className="py-2.5 pr-3">{c.bookings}</td><td className="py-2.5 pr-3"><Price amount={c.totalSpent} /></td><td className="py-2.5">{c.lastVisit}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "Salons" && (
          <div className="mt-6 grid lg:grid-cols-3 gap-6 items-start">
            <form onSubmit={saveSalon} className="bg-white border border-gold-100 rounded-3xl p-6 space-y-3">
              <h2 className="font-semibold">Add a salon branch</h2>
              <input value={salonForm.name} onChange={(e) => setSalonForm({ ...salonForm, name: e.target.value })} placeholder="Salon name" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <input value={salonForm.city} onChange={(e) => setSalonForm({ ...salonForm, city: e.target.value })} placeholder="City" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <input value={salonForm.address} onChange={(e) => setSalonForm({ ...salonForm, address: e.target.value })} placeholder="Address" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <input value={salonForm.phone} onChange={(e) => setSalonForm({ ...salonForm, phone: e.target.value })} placeholder="Phone" className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5" />
              <select value={salonForm.plan} onChange={(e) => setSalonForm({ ...salonForm, plan: e.target.value })} className="w-full border border-charcoal-200 rounded-xl px-4 py-2.5 bg-white">{["Starter", "Pro", "Premium"].map((p) => <option key={p}>{p}</option>)}</select>
              <button className="w-full bg-charcoal-900 text-white font-semibold py-3 rounded-full">Add salon</button>
            </form>
            <div className="lg:col-span-2 space-y-4">
              {data.salons.map((s) => (
                <div key={s.id} className="bg-white border border-gold-100 rounded-3xl p-5 flex flex-wrap justify-between gap-3">
                  <div><p className="font-bold">{s.name}</p><p className="text-sm text-charcoal-500">{s.address} · {s.phone}</p><p className="text-xs text-charcoal-500 mt-1">{s.bookingsThisMonth} bookings this month</p></div>
                  <div className="text-right"><span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">{s.plan} · {s.status}</span><br /><button onClick={() => update({ ...data, salons: data.salons.filter((x) => x.id !== s.id) })} className="mt-2 text-xs font-semibold bg-red-50 text-red-700 px-3 py-1.5 rounded-full">Remove</button></div>
                </div>
              ))}
              <p className="text-sm text-charcoal-500">Multi-salon support: each branch keeps its own bookings and revenue on the Premium plan. This demo ships with Glow Studio Delhi and Glow Studio Mumbai.</p>
            </div>
          </div>
        )}

        {tab === "Settings" && (
          <div className="mt-6 max-w-2xl bg-white border border-gold-100 rounded-3xl p-6">
            <h2 className="font-semibold text-lg">Salon settings</h2>
            <form onSubmit={saveSettings} className="space-y-4 mt-4">
              <label className="block"><span className="text-sm font-semibold">Salon name</span><input name="salonName" defaultValue={data.settings.salonName} className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
              <label className="block"><span className="text-sm font-semibold">Address</span><input name="address" defaultValue={data.settings.address} className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block"><span className="text-sm font-semibold">Phone</span><input name="phone" defaultValue={data.settings.phone} className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
                <label className="block"><span className="text-sm font-semibold">Email</span><input name="email" defaultValue={data.settings.email} className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block"><span className="text-sm font-semibold">Opening hours</span><input name="openingHours" defaultValue={data.settings.openingHours} className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
                <label className="block"><span className="text-sm font-semibold">UPI ID</span><input name="upiId" defaultValue={data.settings.upiId} className="mt-1 w-full border border-charcoal-200 rounded-xl px-4 py-3" /></label>
              </div>
              <p className="text-xs text-charcoal-500">Currency: 1 USDT = ₹{USDT_RATE} (fixed in lib/store.js as USDT_RATE). All prices show USDT + INR across the site.</p>
              <button className="bg-charcoal-900 text-white font-semibold px-6 py-3 rounded-full">Save Settings</button>
              <button type="button" onClick={() => { if (window.confirm("Reset all demo data?")) { const fresh = seedData(); saveData(fresh); setData(fresh); } }} className="ml-3 border border-red-200 text-red-700 font-semibold px-5 py-3 rounded-full text-sm">Reset demo data</button>
            </form>
          </div>
        )}
      </main><Footer />
    </div>
  );
}

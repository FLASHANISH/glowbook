// GlowBook data store — localStorage only, no backend, no paid database.
export const STORAGE_KEY = "glowbook_data_v1";

// Dual-currency: every price is stored in INR and shown in USDT + INR (USDT main).
export const USDT_RATE = 88; // 1 USDT = Rs 88

export function toUSDT(inr) {
  return Number(inr || 0) / USDT_RATE;
}

export function formatUSDT(inr) {
  return toUSDT(inr).toFixed(2) + " USDT";
}

// "5.67 USDT (~Rs 499)" — USDT main, INR second. The standard dual-price string used across the app.
export function formatPrice(inr) {
  return formatUSDT(inr) + " (~\u20B9" + Number(inr || 0).toLocaleString("en-IN") + ")";
}

// Single-currency display, honouring the top-bar INR / USDT toggle.
// currency: "INR" shows Rs, "USDT" shows USDT only.
export function formatPriceIn(inr, currency) {
  if (currency === "USDT") return formatUSDT(inr);
  return "\u20B9" + Number(inr || 0).toLocaleString("en-IN");
}

export const DEFAULT_SERVICES = [
  { id: "svc-haircut", name: "Haircut", category: "Hair", price: 199, duration: 30, description: "Classic and modern haircut with wash and styling." },
  { id: "svc-beard", name: "Beard Trim", category: "Grooming", price: 99, duration: 15, description: "Beard shaping, trim and hot towel finish." },
  { id: "svc-colour", name: "Hair Colour", category: "Hair", price: 999, duration: 90, description: "Full hair colour with premium products and conditioning." },
  { id: "svc-facial", name: "Facial", category: "Skin", price: 499, duration: 45, description: "Deep cleansing facial for glow and hydration." },
  { id: "svc-massage", name: "Head Massage", category: "Relaxation", price: 299, duration: 30, description: "Relaxing head massage with nourishing oil." },
  { id: "svc-manicure", name: "Manicure", category: "Nails", price: 399, duration: 40, description: "Nail shaping, cuticle care and polish." },
  { id: "svc-pedicure", name: "Pedicure", category: "Nails", price: 449, duration: 40, description: "Foot care, scrub, massage and polish." },
  { id: "svc-bridal", name: "Bridal Package", category: "Bridal", price: 4999, duration: 180, description: "Complete bridal hair, makeup, facial and styling package." },
];

export const DEFAULT_STAFF = [
  { id: "st-aarav", name: "Aarav Sharma", role: "Hair Expert", rating: 4.9, experience: "8 years", specialty: "Haircut, Styling" },
  { id: "st-rohan", name: "Rohan Verma", role: "Beard & Style", rating: 4.8, experience: "6 years", specialty: "Beard, Grooming" },
  { id: "st-priya", name: "Priya Nair", role: "Skin & Facial", rating: 4.9, experience: "7 years", specialty: "Facial, Skin Care" },
  { id: "st-sneha", name: "Sneha Patel", role: "Colour Specialist", rating: 4.8, experience: "5 years", specialty: "Hair Colour, Bridal" },
];

export const DEFAULT_SALONS = [
  { id: "sal-delhi", name: "Glow Studio Delhi", city: "New Delhi", address: "12, MG Road, Connaught Place, New Delhi 110001", phone: "+91 98110 12345", plan: "Pro", status: "Active", bookingsThisMonth: 148 },
  { id: "sal-mumbai", name: "Glow Studio Mumbai", city: "Mumbai", address: "45, Linking Road, Bandra West, Mumbai 400050", phone: "+91 98200 67890", plan: "Premium", status: "Active", bookingsThisMonth: 212 },
];

const CUSTOMER_NAMES = [
  ["Amit Kumar", "98765 43210"], ["Rahul Singh", "98123 45678"], ["Vikram Mehta", "98901 23456"],
  ["Sana Sheikh", "97654 32109"], ["Ananya Gupta", "96543 21098"], ["Karan Joshi", "95432 10987"],
  ["Neha Sharma", "94321 09876"], ["Arjun Malhotra", "93210 98765"], ["Pooja Verma", "92109 87654"],
  ["Rohit Yadav", "91098 76543"], ["Kavya Reddy", "90087 65432"], ["Manish Tiwari", "89987 65432"],
  ["Ishita Bose", "88976 54321"], ["Suresh Iyer", "87865 43210"], ["Divya Nair", "86754 32109"],
  ["Nikhil Agarwal", "85643 21098"], ["Ritu Kapoor", "84532 10987"], ["Aditya Rao", "83421 09876"],
  ["Meera Das", "82310 98765"], ["Varun Khanna", "81209 87654"],
];

function isoDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
function formatDateLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function seedData() {
  const bookings = [];
  const serviceCycle = ["svc-haircut", "svc-beard", "svc-facial", "svc-colour", "svc-massage", "svc-manicure", "svc-haircut", "svc-pedicure", "svc-haircut", "svc-facial", "svc-beard", "svc-colour"];
  const staffCycle = ["st-aarav", "st-rohan", "st-priya", "st-sneha"];
  const times = ["10:00 AM", "11:30 AM", "01:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"];
  const dayOffsets = [-6, -5, -4, -3, -2, -1, -1, 0, 0, 0, 1, 1];
  const statuses = ["Completed", "Completed", "Completed", "Completed", "Completed", "Completed", "Completed", "Confirmed", "Confirmed", "Confirmed", "Confirmed", "Confirmed"];
  for (let i = 0; i < 12; i++) {
    const svc = DEFAULT_SERVICES.find((s) => s.id === serviceCycle[i]);
    const staff = DEFAULT_STAFF.find((s) => s.id === staffCycle[i % 4]);
    const [name, phone] = CUSTOMER_NAMES[i];
    bookings.push({
      id: "GB-" + String(100100 + i),
      customerName: name,
      phone: "+91 " + phone,
      serviceIds: [svc.id],
      serviceNames: [svc.name],
      staffId: staff.id,
      staffName: staff.name,
      date: isoDate(dayOffsets[i]),
      dateLabel: formatDateLabel(isoDate(dayOffsets[i])),
      time: times[i % times.length],
      total: svc.price,
      duration: svc.duration,
      status: statuses[i],
      notes: i === 3 ? "Please use mild products for sensitive skin." : "",
      createdAt: new Date().toISOString(),
    });
  }
  const customers = CUSTOMER_NAMES.map(([name, phone], i) => ({
    id: "cus-" + (i + 1),
    name,
    phone: "+91 " + phone,
    bookings: 1 + (i % 4),
    totalSpent: 499 + i * 237,
    lastVisit: isoDate(-(i % 7)),
  }));
  return {
    services: DEFAULT_SERVICES,
    staff: DEFAULT_STAFF,
    salons: DEFAULT_SALONS,
    bookings,
    customers,
    settings: {
      salonName: "Glow Studio",
      address: "12, MG Road, Connaught Place, New Delhi 110001",
      phone: "+91 98110 12345",
      email: "hello@glowbook.in",
      openingHours: "10:00 AM - 8:00 PM",
      upiId: "glowstudio@okhdfcbank",
      city: "New Delhi",
    },
  };
}

export function loadData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const seeded = seedData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  } catch (e) {
    return seedData();
  }
}

export function saveData(data) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
}

export function generateBookingId() {
  return "GB-" + Math.floor(100000 + Math.random() * 900000);
}

export function getNext14Days() {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    days.push({
      iso,
      label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      dayName: d.toLocaleDateString("en-IN", { weekday: "short" }),
      dayNum: d.getDate(),
      isToday: i === 0,
    });
  }
  return days;
}

export function getTimeSlots(dateIso) {
  // Deterministic pseudo-random booked slots so the grid looks real and stable per date.
  let seed = 0;
  for (const ch of dateIso) seed = (seed * 31 + ch.charCodeAt(0)) % 100000;
  const slots = [];
  const startHour = 10, endHour = 20;
  for (let h = startHour; h < endHour; h++) {
    for (const m of [0, 30]) {
      const hour12 = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const label = `${String(hour12).padStart(2, "0")}:${m === 0 ? "00" : "30"} ${ampm}`;
      seed = (seed * 9301 + 49297) % 233280;
      const booked = seed / 233280 < 0.22;
      slots.push({ label, booked });
    }
  }
  return slots;
}

export function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

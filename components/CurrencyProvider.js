"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { formatPrice, formatPriceIn } from "../lib/store";

const CurrencyContext = createContext({ currency: "BOTH", setCurrency: () => {} });

// currency: "BOTH" (default — shows USDT + INR, USDT main), "INR" or "USDT" (shows one as main).
export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState("BOTH");
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("glowbook_currency");
      if (saved === "INR" || saved === "USDT" || saved === "BOTH") setCurrencyState(saved);
    } catch (e) {}
  }, []);
  const setCurrency = (c) => {
    setCurrencyState(c);
    try { window.localStorage.setItem("glowbook_currency", c); } catch (e) {}
  };
  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

// Price display used across the app. Default (BOTH): "5.67 USDT (~Rs 499)" — USDT main.
// After the toggle: main currency first, the other in small muted text.
export function Price({ amount, className = "", smallClassName = "text-xs text-charcoal-500" }) {
  const { currency } = useCurrency();
  if (currency === "BOTH") return <span className={className}>{formatPrice(amount)}</span>;
  return (
    <span className={className}>
      {formatPriceIn(amount, currency)}{" "}
      <span className={smallClassName}>({currency === "INR" ? formatPriceIn(amount, "USDT") : formatPriceIn(amount, "INR")})</span>
    </span>
  );
}

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  const btn = (value, label) => (
    <button key={value} onClick={() => setCurrency(value)} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${currency === value ? "bg-charcoal-900 text-white" : "text-charcoal-600 hover:bg-gold-100"}`}>{label}</button>
  );
  return (
    <div className="flex items-center gap-0.5 bg-gold-50 border border-gold-200 rounded-full p-0.5" title="Currency display — 1 USDT = Rs 88">
      {btn("USDT", "USDT")}
      {btn("BOTH", "USDT + INR")}
      {btn("INR", "INR")}
    </div>
  );
}

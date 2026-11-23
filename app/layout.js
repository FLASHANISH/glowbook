import "./globals.css";
import { CurrencyProvider } from "../components/CurrencyProvider";

export const metadata = {
  title: "GlowBook — Salon Booking SaaS",
  description: "Book salon services online. Haircut, facial, colour, bridal and more. Simple booking for customers, powerful dashboard for salon owners.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><CurrencyProvider>{children}</CurrencyProvider></body>
    </html>
  );
}

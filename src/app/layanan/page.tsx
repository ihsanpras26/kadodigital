import type { Metadata } from "next";
import { ServicesCatalogClient } from "@/components/services/ServicesCatalogClient";

export const metadata: Metadata = {
  title: "Layanan Studio & Add-on",
  description:
    "Layanan Terima Beres, Express Same-Day, Paket Kuota Smart Kirim WhatsApp, dan Custom Ilustrasi.",
};

export default function LayananPage() {
  return <ServicesCatalogClient />;
}

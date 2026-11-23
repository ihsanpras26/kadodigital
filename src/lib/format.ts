export function formatRupiah(amount: number): string {
  if (amount === 0) return "Rp0";
  return `Rp${new Intl.NumberFormat("id-ID").format(amount)}`;
}

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/6285175390023?text=${encoded}`;
}

export const BRAND_CONTACT = {
  whatsappDisplay: "+62 851-7539-0023",
  whatsappNumber: "6285175390023",
  email: "halo@kadodigital.my.id",
  instagram: "https://instagram.com/kadodigital.my.id",
  domain: "kadodigital.my.id",
} as const;

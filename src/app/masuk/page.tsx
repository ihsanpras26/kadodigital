import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Masuk & Mulai Trial Gratis",
  description: "Masuk ke studio Kado Digital untuk menyusun kado interaktif atau undangan.",
};

export default function MasukPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SignInForm />
    </div>
  );
}

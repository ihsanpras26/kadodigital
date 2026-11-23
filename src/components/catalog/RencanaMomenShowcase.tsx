"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Check, FolderArchive, Kanban, LayoutDashboard, ListChecks } from "lucide-react";

type ModuleKey = "dashboard" | "checklist" | "timeline" | "kanban" | "drive";

const INITIAL_TASKS = [
  { id: "t1", label: "Tentukan tema Kado Digital / Undangan", cat: "Konsep", done: true },
  { id: "t2", label: "Kumpulkan 12 foto kenangan & caption", cat: "Materi", done: true },
  { id: "t3", label: "Konfirmasi daftar tamu & grup WhatsApp", cat: "Tamu", done: false },
  { id: "t4", label: "Booking venue makan malam & kue", cat: "Vendor", done: false },
];

export function RencanaMomenShowcase() {
  const [activeMod, setActiveMod] = useState<ModuleKey>("checklist");
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const percent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="rounded-[24px] border border-hairline bg-surface p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-6 lg:flex-row lg:items-center">
        <div>
          <span className="inline-flex items-center rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-ink border border-gold/40">
            Rencana Momen · Event &amp; Gift Planner
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Atur semua checklist, jadwal, dan arsip dokumen dalam satu workspace.
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Gratis uji coba · Unlock penuh selamanya{" "}
            <span className="font-bold text-emerald-brand tabular-nums">Rp79.000</span>{" "}
            (atau gratis otomatis di paket Signature &amp; Diamond).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/buat?mode=mandiri"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-semibold text-white hover:bg-emerald-hover"
          >
            Coba Gratis Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 5-Module Switcher */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { id: "dashboard" as const, label: "Dashboard Progress", icon: LayoutDashboard },
          { id: "checklist" as const, label: "Checklist Interaktif", icon: ListChecks },
          { id: "timeline" as const, label: "Kalender & Jadwal", icon: Calendar },
          { id: "kanban" as const, label: "Papan Kanban", icon: Kanban },
          { id: "drive" as const, label: "Cloud Drive Arsip", icon: FolderArchive },
        ].map((mod) => {
          const Icon = mod.icon;
          const active = activeMod === mod.id;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setActiveMod(mod.id)}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-xs font-semibold transition-colors sm:text-sm ${
                active
                  ? "bg-emerald-brand text-white"
                  : "border border-hairline bg-canvas text-ink hover:bg-subtle"
              }`}
            >
              <Icon className="h-4 w-4" />
              {mod.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
        {activeMod === "dashboard" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-hairline bg-surface p-4">
              <span className="text-xs text-muted">Progres Persiapan</span>
              <p className="mt-1 text-3xl font-bold text-emerald-brand tabular-nums">{percent}%</p>
              <p className="mt-1 text-xs text-muted tabular-nums">
                {completedCount} dari {tasks.length} tugas selesai
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-surface p-4">
              <span className="text-xs text-muted">Hitung Mundur Hari-H</span>
              <p className="mt-1 text-3xl font-bold text-ink tabular-nums">14 Hari</p>
              <p className="mt-1 text-xs text-muted">Sinkron dengan link Kado / Undangan</p>
            </div>
            <div className="rounded-xl border border-hairline bg-surface p-4">
              <span className="text-xs text-muted">Arsip Vendor &amp; Dokumen</span>
              <p className="mt-1 text-3xl font-bold text-ink tabular-nums">6 File</p>
              <p className="mt-1 text-xs text-muted">Kontrak, kuitansi, &amp; rundown aman tersimpan</p>
            </div>
          </div>
        )}

        {activeMod === "checklist" && (
          <div>
            <div className="flex items-center justify-between pb-3">
              <p className="text-sm font-semibold text-ink">
                Klik tugas di bawah untuk simulasi update progres:
              </p>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-emerald-brand tabular-nums">
                {percent}% Selesai
              </span>
            </div>
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-hairline bg-surface px-4 py-2.5 text-left transition-colors hover:border-emerald-brand"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded ${
                        task.done ? "bg-emerald-brand text-white" : "border border-control"
                      }`}
                    >
                      {task.done && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className={`text-sm ${task.done ? "text-muted line-through" : "font-medium text-ink"}`}>
                      {task.label}
                    </span>
                  </span>
                  <span className="rounded-full bg-subtle px-2.5 py-0.5 text-xs text-muted">
                    {task.cat}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeMod === "timeline" && (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { time: "Minggu 1", title: "Kunci Konsep & Foto", desc: "Pilih tema Kado Digital & siapkan 12–16 foto." },
              { time: "Minggu 2", title: "Kirim Save The Date", desc: "Sebar pengumuman tanggal & buka RSVP awal." },
              { time: "Hari-H", title: "Rilis & Lensa Momen", desc: "Link terbuka 00.00 WIB, kartu QR ditaruh di meja." },
            ].map((item) => (
              <div key={item.time} className="rounded-xl border border-hairline bg-surface p-4">
                <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-ink">
                  {item.time}
                </span>
                <h3 className="mt-2.5 text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeMod === "kanban" && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Perlu Dilakukan", items: ["Pilih musik latar", "Tulis pertanyaan kuis"] },
              { title: "Sedang Berjalan", items: ["Kurasi foto bersama", "Konfirmasi venue"] },
              { title: "Selesai", items: ["Booking kue ulang tahun", "Pilih tema Linen Letter"] },
            ].map((col) => (
              <div key={col.title} className="rounded-xl border border-hairline bg-surface p-4">
                <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
                <div className="mt-3 space-y-2">
                  {col.items.map((entry) => (
                    <div key={entry} className="rounded-lg border border-hairline bg-canvas p-3 text-xs font-medium text-ink">
                      {entry}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMod === "drive" && (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { name: "Rundown Acara Malam.pdf", size: "420 KB" },
              { name: "Invoice Dekorasi & Kue.pdf", size: "890 KB" },
              { name: "Daftar Nama Tamu VIP.csv", size: "64 KB" },
            ].map((file) => (
              <div key={file.name} className="rounded-xl border border-hairline bg-surface p-4">
                <p className="text-sm font-semibold text-ink">{file.name}</p>
                <p className="mt-1 text-xs text-muted tabular-nums">Tersimpan aman · {file.size}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

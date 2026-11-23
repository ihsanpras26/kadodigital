import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BLOG_ARTICLES } from "@/data/articles";

export const metadata: Metadata = {
  title: "Inspirasi & Panduan Merangkai Kado",
  description:
    "Artikel praktis menulis surat anniversary, ide kejutan LDR, hingga memaksimalkan Lensa Momen saat acara.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold tracking-[0.14em] text-emerald-brand uppercase">
          Inspirasi &amp; Panduan Studio
        </span>
        <h1 className="mt-2.5 text-[34px] leading-tight font-bold tracking-[-0.03em] text-ink text-balance sm:text-[46px]">
          Cerita lebih mengena ketika{" "}
          <span className="font-serif font-normal italic text-emerald-brand">jujur</span>{" "}
          dan terarah.
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted text-pretty">
          Kumpulan panduan singkat untuk menulis ucapan personal, merancang kejutan ulang tahun,
          hingga mengelola acara bersama tamu.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {BLOG_ARTICLES.map((article) => (
          <article
            key={article.slug}
            className="flex h-full flex-col rounded-[20px] border border-hairline bg-surface p-6 transition-all hover:border-control/50 hover:shadow-[var(--shadow-card-hover)] sm:p-7"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-ink">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 text-muted">
                <Clock className="h-3.5 w-3.5" />
                {article.readingTime}
              </span>
            </div>

            <h2 className="mt-4 text-xl leading-snug font-bold tracking-tight text-ink text-balance sm:text-2xl">
              <Link href={`/blog/${article.slug}`} className="hover:text-emerald-brand">
                {article.title}
              </Link>
            </h2>

            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted text-pretty">
              {article.excerpt}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4">
              <span className="text-xs text-muted">{article.publishedAt}</span>
              <Link
                href={`/blog/${article.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-brand hover:underline"
              >
                Baca selengkapnya
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

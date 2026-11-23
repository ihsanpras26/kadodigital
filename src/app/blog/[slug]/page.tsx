import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { BLOG_ARTICLES, getArticleBySlug } from "@/data/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function BlogDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-emerald-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        Semua Artikel
      </Link>

      <header className="mt-6 border-b border-hairline pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full bg-accent-soft px-3 py-1 font-semibold text-ink">
            {article.category}
          </span>
          <span className="text-muted">{article.publishedAt}</span>
          <span className="inline-flex items-center gap-1 text-muted">
            <Clock className="h-3.5 w-3.5" />
            {article.readingTime}
          </span>
        </div>

        <h1 className="mt-4 text-[30px] leading-[1.14] font-bold tracking-[-0.03em] text-ink text-balance sm:text-[42px]">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
          {article.excerpt}
        </p>
      </header>

      <div className="mt-8 space-y-8">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-base leading-[1.7] text-ink/90 text-pretty">
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Recommended Theme CTA */}
      <aside className="mt-12 rounded-[24px] border border-emerald-brand/30 bg-surface p-6 sm:p-8">
        <span className="text-xs font-semibold tracking-wider text-emerald-brand uppercase">
          Rekomendasi Tema Terkait
        </span>
        <h2 className="mt-2 text-2xl font-bold text-ink">
          Coba langsung di tema {article.recommendedThemeName}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Mainkan demo interaktifnya terlebih dahulu atau langsung mulai menyusun dengan uji coba
          gratis 2 hari.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/demo/${article.recommendedThemeSlug}`}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-semibold text-white hover:bg-emerald-hover"
          >
            Buka Demo {article.recommendedThemeName}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/katalog/${article.recommendedThemeSlug}`}
            className="inline-flex h-11 items-center rounded-full border border-control/60 bg-canvas px-5 text-sm font-semibold text-ink hover:bg-subtle"
          >
            Lihat Detail Tema
          </Link>
        </div>
      </aside>
    </article>
  );
}

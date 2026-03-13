/* eslint-disable react/no-danger */
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from "@/data/blog";
import { site } from "@/data/site";
import BlogCard from "@/components/blog/BlogCard";
import BlogArticleCta from "@/components/blog/BlogArticleCta";

type BlogPageProps = {
  params: { slug: string };
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const generateStaticParams = async () =>
  blogPosts.map((post) => ({ slug: post.slug }));

export const generateMetadata = ({ params }: BlogPageProps): Metadata => {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Blog Post",
      description: "Music education insights from Melody Monks.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [post.image],
    },
  };
};

export default function BlogDetailPage({ params }: BlogPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const relatedPosts = getRelatedPosts(post);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: [post.image],
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: "/favicon.ico",
      },
    },
    description: post.excerpt,
    keywords: post.keywords?.join(", "),
  };

  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-5xl px-6 pt-20">
        <div className="space-y-6">
          <Link href="/blog" className="text-sm text-ink-muted hover:text-ink">
            Back to blog
          </Link>
          <div className="space-y-3">
            <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-ink-muted">
              {post.category}
            </span>
            <h1 className="text-4xl font-semibold text-ink">{post.title}</h1>
            <p className="text-sm text-ink-muted">{post.excerpt}</p>
            <div className="flex flex-wrap gap-4 text-xs text-ink-muted">
              <span>By {post.author}</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            {post.keywords && post.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-[11px] text-ink-muted">
                {post.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-white/10 px-3 py-1"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 space-y-10">
        {post.sections.map((section, index) => (
          <div key={`${post.id}-${index}`} className="space-y-4">
            {section.heading ? (
              <h2 className="text-2xl font-semibold text-ink">
                {section.heading}
              </h2>
            ) : null}
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={`${post.id}-${index}-${paragraphIndex}`} className="text-sm text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </section>

      <section className="mx-auto w-full max-w-5xl px-6">
        <BlogArticleCta title={post.title} category={post.category} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-gold">
              Related Posts
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Continue learning
            </h2>
          </div>
          <Link href="/blog" className="btn-secondary px-4 py-2 text-xs">
            View all posts
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {relatedPosts.map((related) => (
            <BlogCard key={related.id} post={related} />
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/data/blog";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-soft transition hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-ink">
          {post.category}
        </span>
      </div>
      <div className="space-y-3 px-5 py-5">
        <p className="text-lg font-semibold text-ink">{post.title}</p>
        <p className="text-sm text-ink-muted">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>{post.author}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

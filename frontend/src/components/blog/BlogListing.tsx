"use client";

import { useMemo, useState } from "react";
import type { BlogCategory, BlogPost } from "@/data/blog";
import BlogCard from "./BlogCard";

type BlogListingProps = {
  posts: BlogPost[];
  categories: ReadonlyArray<BlogCategory>;
};

export default function BlogListing({ posts, categories }: BlogListingProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      const keywords = post.keywords ? post.keywords.join(" ") : "";
      const haystack = `${post.title} ${post.excerpt} ${post.author} ${keywords}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    return filtered.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [activeCategory, posts, query]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
        <div className="card-strong p-6">
          <label className="text-sm text-ink-muted">
            Search articles
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or author"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-ink outline-none focus:border-brand-gold"
            />
          </label>
        </div>
        <div className="card-strong p-6">
          <p className="text-sm font-semibold text-ink">Categories</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-muted">
            {["All", ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-3 py-1 transition ${
                  activeCategory === category
                    ? "border-brand-gold/60 bg-brand-gold/10 text-brand-gold"
                    : "border-white/10 hover:border-brand-gold/40"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="card p-6 text-sm text-ink-muted">
          No posts match your search. Try a different keyword or category.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

import BlogListing from "@/components/blog/BlogListing";
import { blogCategories, blogPosts, blogTopKeywords } from "@/data/blog";

export const metadata = {
  title: "Blog",
  description: "Music learning tips, vocal training, and performance guidance.",
  keywords: blogTopKeywords,
};

export default function BlogPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Blog</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Insights for Indian music learners
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Explore vocal training, performance tips, and student success stories.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <BlogListing posts={blogPosts} categories={blogCategories} />
      </section>
    </div>
  );
}

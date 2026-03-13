import Image from "next/image";
import ReviewsCarousel from "@/components/site/ReviewsCarousel";
import ReviewSubmissionForm from "@/components/site/ReviewSubmissionForm";
import { reviews } from "@/data/reviews";

export const metadata = {
  title: "Student Reviews",
  description: "See what students say about Melody Monks Indian Music Academy.",
};

export default function ReviewsPage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="card-strong p-10">
          <p className="text-sm font-semibold text-brand-gold">Reviews</p>
          <h1 className="mt-3 text-4xl font-semibold text-ink">
            Student reviews and testimonials
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            Hear from students across classical, Bollywood, and instrumental programs.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ReviewsCarousel reviews={reviews} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="card-strong p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={review.photo}
                    alt={review.studentName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {review.studentName}
                  </p>
                  <p className="text-xs text-ink-muted">{review.program}</p>
                </div>
              </div>
              <p className="text-sm text-ink-muted">{review.reviewText}</p>
              <p className="text-xs text-ink-muted">
                Rating: {review.rating}/5
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <ReviewSubmissionForm />
      </section>
    </div>
  );
}

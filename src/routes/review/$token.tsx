import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// @ts-ignore -- Firebase config is shipped as JS.
import { db } from "@/firebase/config";

type ReviewLink = {
  token: string;
  projectTitle: string;
  projectLogo?: string;
  projectLink?: string;
  status: string;
  used: boolean;
};

export const Route = createFileRoute("/review/$token")({
  component: ReviewPage,
});

function ReviewPage() {
  const { token } = Route.useParams();

  const [reviewLink, setReviewLink] = useState<ReviewLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clientName, setClientName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadReviewLink = async () => {
      try {
        setLoading(true);
        setError("");

        const reviewRef = doc(
          db,
          "projectReviewLinks",
          token
        );

        const reviewSnap = await getDoc(reviewRef);

        if (!reviewSnap.exists()) {
          setError(
            "This review link is invalid or no longer available."
          );
          return;
        }

        const data = reviewSnap.data();

        setReviewLink({
          token: reviewSnap.id,
          projectTitle: data["projectTitle"] || "",
          projectLogo: data["projectLogo"] || "",
          projectLink: data["projectLink"] || "",
          status: data["status"] || "awaiting_review",
          used: data["used"] || false,
        });
      } catch (err) {
        console.error("Error loading review link:", err);

        setError(
          "Unable to load this review page."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReviewLink();
  }, [token]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!reviewLink) return;

    if (!clientName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write your review.");
      return;
    }

    if (
      profilePhoto.trim() &&
      !profilePhoto.trim().startsWith("http")
    ) {
      setError(
        "Please enter a valid profile photo URL."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      /*
       * Create the review.
       *
       * The document ID is the same private token.
       * This connects the review to the exact project
       * that the admin selected.
       */
      await setDoc(doc(db, "projectReviews", token), {
        token,
        projectTitle: reviewLink.projectTitle,
        projectLogo: reviewLink.projectLogo || "",
        projectLink: reviewLink.projectLink || "",

        clientName: clientName.trim(),

        profilePhoto: profilePhoto.trim(),

        reviewText: reviewText.trim(),

        status: "pending",

        createdAt: serverTimestamp(),
      });

      /*
       * Mark the private link as used.
       *
       * This prevents the same private link
       * from being submitted again.
       */
      await updateDoc(
        doc(db, "projectReviewLinks", token),
        {
          used: true,
          status: "pending",
        }
      );

      setSubmitted(true);
    } catch (err) {
      console.error(
        "Error submitting review:",
        err
      );

      setError(
        "Something went wrong while submitting your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- LOADING ----------------

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFE6] px-6">
        <p className="text-sm text-[#17100F]/60">
          Loading review page...
        </p>
      </main>
    );
  }

  // ---------------- INVALID LINK ----------------

  if (error && !reviewLink) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFE6] px-6">
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-background p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-[#17100F]">
            Review link unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#17100F]/60">
            {error}
          </p>
        </div>
      </main>
    );
  }

  // ---------------- SUCCESS ----------------

  if (submitted || reviewLink?.used) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFE6] px-6">
        <div className="w-full max-w-md rounded-3xl border border-black/10 bg-background p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#334A35]/10 text-2xl text-[#334A35]">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-[#17100F]">
            Thank you!
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#17100F]/60">
            Your review has been submitted successfully.
          </p>

          <p className="mt-2 text-sm leading-6 text-[#17100F]/60">
            It will appear on the portfolio once it has
            been reviewed and approved.
          </p>
        </div>
      </main>
    );
  }

  // ---------------- REVIEW FORM ----------------

  return (
    <main className="min-h-screen bg-[#F5EFE6] px-5 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-2xl">

        {/* Heading */}

        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#641F32]">
            Client Review
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#17100F] sm:text-4xl">
            Share your experience
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#17100F]/60">
            Thank you for working with me. I’d love to hear
            your thoughts about the project.
          </p>
        </div>

        {/* Card */}

        <div className="rounded-3xl border border-black/10 bg-background p-6 shadow-sm sm:p-8">

          {/* Project */}

          <div className="flex items-center gap-4 border-b border-black/10 pb-6">
            {reviewLink?.projectLogo ? (
              <img
                src={reviewLink.projectLogo}
                alt={reviewLink.projectTitle}
                className="h-14 w-14 rounded-2xl object-contain"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1E9D8] text-lg font-semibold text-[#641F32]">
                {reviewLink?.projectTitle.charAt(0)}
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wider text-[#17100F]/45">
                Project
              </p>

              <h2 className="mt-1 text-lg font-semibold text-[#17100F]">
                {reviewLink?.projectTitle}
              </h2>
            </div>
          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-6"
          >

            {/* Client Name */}

            <div>
              <label
                htmlFor="clientName"
                className="mb-2 block text-sm font-medium text-[#17100F]"
              >
                Your name
              </label>

              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(event) =>
                  setClientName(event.target.value)
                }
                placeholder="Enter your name"
                className="w-full rounded-xl border border-black/10 bg-[#F5EFE6]/40 px-4 py-3 text-sm outline-none transition focus:border-[#641F32]"
              />
            </div>

            {/* Profile Photo URL */}

            <div>
              <label
                htmlFor="profilePhoto"
                className="mb-2 block text-sm font-medium text-[#17100F]"
              >
                Profile photo
                <span className="ml-2 text-xs font-normal text-[#17100F]/40">
                  Optional
                </span>
              </label>

              <input
                id="profilePhoto"
                type="url"
                value={profilePhoto}
                onChange={(event) =>
                  setProfilePhoto(event.target.value)
                }
                placeholder="Paste your profile photo URL"
                className="w-full rounded-xl border border-black/10 bg-[#F5EFE6]/40 px-4 py-3 text-sm outline-none transition focus:border-[#641F32]"
              />

              {profilePhoto.trim() && (
                <div className="mt-4">
                  <img
                    src={profilePhoto}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              )}

              <p className="mt-2 text-xs text-[#17100F]/45">
                You can paste a public profile photo URL,
                such as your LinkedIn profile image URL.
              </p>
            </div>

            {/* Review */}

            <div>
              <label
                htmlFor="reviewText"
                className="mb-2 block text-sm font-medium text-[#17100F]"
              >
                Your review
              </label>

              <textarea
                id="reviewText"
                value={reviewText}
                onChange={(event) =>
                  setReviewText(event.target.value)
                }
                placeholder="Tell me about your experience working together..."
                rows={6}
                className="w-full resize-none rounded-xl border border-black/10 bg-[#F5EFE6]/40 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#641F32]"
              />
            </div>

            {/* Error */}

            {error && (
              <p className="rounded-xl bg-[#641F32]/10 px-4 py-3 text-sm text-[#641F32]">
                {error}
              </p>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#641F32] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#511828] disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#17100F]/40">
          This is a private review link created specifically
          for this project.
        </p>
      </div>
    </main>
  );
}
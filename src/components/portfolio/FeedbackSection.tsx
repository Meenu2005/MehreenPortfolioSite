import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  addDoc,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { Star, Send, MessageSquareQuote } from "lucide-react";

// IMPORTANT:
// Apni existing Firebase file ka path yahan use karo.
// Agar tumhari auth/db kisi aur file se aa rahi hai to sirf ye import change karna hai.
// @ts-ignore -- Firebase config is shipped as JS and lacks generated typings in this project.
import { auth, db } from "@/firebase/config";

type Rating = {
  uid: string;
  rating: number;
};

type Comment = {
  id: string;
  uid: string;
  name: string;
  photoURL?: string;
  text: string;
  createdAt?: Timestamp;
};

export function FeedbackSection() {
  const [user, setUser] = useState<User | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [message, setMessage] = useState("");
  const [commentsPaused, setCommentsPaused] = useState(false);

  // -----------------------------
  // AUTH
  // -----------------------------

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setMessage("Sign-in was cancelled or could not be completed.");
    }
  };

  // -----------------------------
  // RATINGS
  // -----------------------------

useEffect(() => {
  const ratingsQuery = collection(db, "portfolioRatings");

  const unsubscribe = onSnapshot(
    ratingsQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const data: Rating[] = snapshot.docs.map((item) => {
        const itemData = item.data();

        return {
          uid: item.id,
          rating:
            typeof itemData.rating === "number"
              ? itemData.rating
              : 0,
        };
      });

      setRatings(data);
    },
    (error) => {
      console.error("Ratings fetch error:", error);
      setMessage("Ratings could not be loaded.");
    }
  );

  return unsubscribe;
}, []);

 const averageRating = useMemo(() => {
  const validRatings = ratings.filter(
    (item) => Number.isFinite(item.rating) && item.rating >= 1 && item.rating <= 5
  );

  if (validRatings.length === 0) return 0;

  const total = validRatings.reduce(
    (sum, item) => sum + item.rating,
    0
  );

  return total / validRatings.length;
}, [ratings]);

  const userRating = user
    ? ratings.find((item) => item.uid === user.uid)?.rating ?? 0
    : 0;

  const submitRating = async () => {
    if (!selectedRating) return;

    if (!user) {
      await loginWithGoogle();
      return;
    }

    try {
      setSubmittingRating(true);
      setMessage("");

      // One rating per user.
      // If user rates again, their previous rating gets updated.
     await setDoc(doc(db, "portfolioRatings", user.uid), {
  uid: user.uid,
  name: user.displayName || "Anonymous",
  email: user.email || "",
  photoURL: user.photoURL || "",
  rating: selectedRating,
  updatedAt: serverTimestamp(),
});

      setMessage("Thanks for rating my portfolio.");
    } catch (error) {
      console.error("Rating error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmittingRating(false);
    }
  };

  // -----------------------------
  // COMMENTS
  // -----------------------------

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "portfolioComments"),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const fetchedComments: Comment[] = snapshot.docs
        .map((item) => {
          const data = item.data();

          const uid =
            typeof data["uid"] === "string"
              ? data["uid"]
              : "";

          const name =
            typeof data["name"] === "string" &&
            data["name"].trim()
              ? data["name"]
              : "Anonymous";

          const photoURL =
            typeof data["photoURL"] === "string"
              ? data["photoURL"]
              : "";

          const text =
            typeof data["text"] === "string"
              ? data["text"]
              : "";

          const commentData: Comment = {
            id: item.id,
            uid,
            name,
            photoURL,
            text,
          };

          if (data["createdAt"] instanceof Timestamp) {
            commentData.createdAt = data["createdAt"];
          }

          return commentData;
        })
        .filter((item) => item.text.trim() !== "");

      fetchedComments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() ?? 0;
        const timeB = b.createdAt?.toMillis() ?? 0;

        return timeB - timeA;
      });

      setComments(fetchedComments);
    },
    (error) => {
      console.error("Comments fetch error:", error);
      setMessage("Comments could not be loaded.");
    }
  );

  return unsubscribe;
}, []);

  const submitComment = async () => {
    const cleanComment = comment.trim();

    if (!cleanComment) return;

    if (!user) {
      await loginWithGoogle();
      return;
    }

    try {
      setSubmittingComment(true);
      setMessage("");

      await addDoc(collection(db, "portfolioComments"), {
  uid: user.uid,
  name: user.displayName || "Anonymous",
  email: user.email || "",
  photoURL: user.photoURL || "",
  text: cleanComment,
  createdAt: serverTimestamp(),
});

      setComment("");
      setMessage("Your comment has been posted.");
    } catch (error) {
      console.error("Comment error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // -----------------------------
  // AUTO SCROLL COMMENTS
  // -----------------------------

  useEffect(() => {
    if (commentsPaused || comments.length < 3) return;

    const container = document.getElementById("portfolio-comments-feed");

    if (!container) return;

    const interval = window.setInterval(() => {
      container.scrollTop += 1;

      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 2
      ) {
        container.scrollTop = 0;
      }
    }, 55);

    return () => window.clearInterval(interval);
  }, [commentsPaused, comments.length]);

  return (
    <section className="border-b border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Heading */}
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Feedback / 04
          </p>

          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            A little feedback goes a long way.
          </h2>

          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            See what visitors think and leave your own thoughts about the
            portfolio.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT — RATING */}
          <div className="rounded-2xl border border-border bg-surface p-7 shadow-soft sm:p-9">

            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Portfolio rating
                </p>

                <div className="mt-3 flex items-end gap-3">
                  <span className="font-display text-6xl leading-none">
                    {averageRating ? averageRating.toFixed(1) : "—"}
                  </span>

                  <span className="pb-1 text-sm text-muted-foreground">
                    / 5
                  </span>
                </div>
              </div>

              <div className="grid size-12 place-items-center rounded-full bg-rating/12 text-rating">
                <Star className="size-5 fill-current" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1 text-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-current"
                      : ""
                  }`}
                />
              ))}
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {ratings.length}{" "}
              {ratings.length === 1 ? "rating" : "ratings"} so far
            </p>

            <div className="my-8 h-px bg-border" />

            <div>
              <p className="text-sm font-semibold">
                How would you rate this portfolio?
              </p>

              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active =
                    star <= (hoverRating || selectedRating);

                  return (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} out of 5`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className="rounded-md p-1.5 text-rating transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Star
                        className={`size-7 ${
                          active ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {userRating > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Your current rating: {userRating}/5
                </p>
              )}

              <button
                type="button"
                disabled={!selectedRating || submittingRating}
                onClick={submitRating}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lift disabled:pointer-events-none disabled:opacity-50"
              >
                <Star className="size-4" />
                {submittingRating ? "Saving..." : "Submit rating"}
              </button>
            </div>

            {message && (
              <p className="mt-5 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                {message}
              </p>
            )}
          </div>

          {/* RIGHT — COMMENTS */}
          <div className="rounded-2xl border border-border bg-surface p-7 shadow-soft sm:p-9">

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Comments & suggestions
                </p>

                <h3 className="mt-2 font-display text-3xl">
                  What people are saying
                </h3>
              </div>

              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-comment/10 text-comment">
                <MessageSquareQuote className="size-5" />
              </div>
            </div>

            {/* Comment input */}
            <div className="mt-7 rounded-xl border border-border bg-background p-4">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={
                  user
                    ? "Share your thoughts..."
                    : "Sign in to leave a comment..."
                }
                rows={3}
                className="w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground"
              />

              <div className="mt-3 flex items-center justify-between gap-4 border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">
                  {user
                    ? `Commenting as ${user.displayName || "you"}`
                    : "Google sign-in required"}
                </p>

                <button
                  type="button"
                  disabled={!comment.trim() || submittingComment}
                  onClick={submitComment}
                  className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-comment px-4 text-xs font-semibold text-comment-foreground transition-all hover:-translate-y-0.5 hover:shadow-soft disabled:pointer-events-none disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  {submittingComment ? "Posting..." : "Post"}
                </button>
              </div>
            </div>

            {/* AUTO SCROLL FEED */}
            <div
              id="portfolio-comments-feed"
              onMouseEnter={() => setCommentsPaused(true)}
              onMouseLeave={() => setCommentsPaused(false)}
              className="mt-6 h-[330px] overflow-hidden rounded-xl border border-border bg-background px-4"
            >
              {comments.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <MessageSquareQuote className="mx-auto size-8 text-muted-foreground/50" />
                    <p className="mt-3 text-sm font-medium">
                      Be the first to leave a comment.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your feedback will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {comments.map((item) => (
                    <article key={item.id} className="flex gap-3 py-5">
                      <div className="size-9 shrink-0 overflow-hidden rounded-full bg-secondary">
                        {item.photoURL ? (
                          <img
                            src={item.photoURL}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-xs font-bold text-muted-foreground">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {item.text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-3 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
              {commentsPaused
                ? "Paused"
                : "Comments update automatically"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
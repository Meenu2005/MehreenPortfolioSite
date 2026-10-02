
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
import { Star, Send } from "lucide-react";

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
      (item) =>
        Number.isFinite(item.rating) &&
        item.rating >= 1 &&
        item.rating <= 5
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

    const container = document.getElementById(
      "portfolio-comments-feed"
    );

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
    <section className="border-b border-[#28323C]/50 bg-[#101312] py-24 sm:py-32">
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#dc651b]">
            Feedback / 04
          </p>

          <h2 className="font-myfont text-5xl font-semibold leading-[0.95] text-[#E85D3F] sm:text-6xl lg:text-8xl">
            A little feedback goes a long way.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#A9ADA8] sm:text-base">
            See what visitors think and leave your own thoughts about the
            portfolio.
          </p>
        </div>

        {/* Feedback Content */}
        <div className="mx-auto mt-16 max-w-4xl">

          {/* Small Rating */}
          <div className="text-center">

            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#87917F]">
              Portfolio rating
            </p>

            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="font-myfont text-4xl font-semibold leading-none text-[#E6D2B5] sm:text-5xl">
                {averageRating ? averageRating.toFixed(1) : "—"}
              </span>

              <div className="flex items-center gap-0.5 text-[#dc651b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 sm:size-[18px] ${
                      star <= Math.round(averageRating)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs text-[#727A72]">
                {ratings.length}{" "}
                {ratings.length === 1 ? "rating" : "ratings"}
              </span>
            </div>

            {/* Your Rating */}
            <div className="mt-7">
              <p className="text-xs text-[#87917F]">
                Rate this portfolio
              </p>

              <div className="mt-2 flex justify-center gap-0.5">
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
                      className="rounded-full p-1 text-[#dc651b] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc651b]"
                    >
                      <Star
                        className={`size-5 ${
                          active ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {userRating > 0 && (
                <p className="mt-1 text-[11px] text-[#727A72]">
                  Your current rating: {userRating}/5
                </p>
              )}

              <button
                type="button"
                disabled={!selectedRating || submittingRating}
                onClick={submitRating}
                className="mt-4 inline-flex min-h-9 items-center justify-center gap-2 rounded bg-[#dc651b] px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#E85D3F] disabled:pointer-events-none disabled:opacity-40"
              >
                <Star className="size-3.5" />
                {submittingRating ? "Saving..." : "Submit rating"}
              </button>
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <p className="mt-8 text-center text-xs text-[#A9ADA8]">
              {message}
            </p>
          )}

          {/* Comments */}
          <div className="mt-20">

            <div className="text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#dc651b]">
                Comments & suggestions
              </p>

              <h3 className="mt-3 font-myfont text-3xl font-semibold text-[#E6D2B5] sm:text-4xl">
                What people are saying
              </h3>
            </div>

            {/* YouTube-style Comment Input */}
            <div className="mx-auto mt-8 max-w-3xl">
              <div className="flex items-end gap-3 border-b border-[#536052] bg-[#171B18] px-4 py-3 transition-all focus-within:border-[#dc651b] sm:rounded-xl sm:border sm:px-5 sm:py-4">

                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={
                    user
                      ? "Share your thoughts..."
                      : "Sign in to leave a comment..."
                  }
                  rows={1}
                  className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-6 text-[#FFF9F1] outline-none placeholder:text-[#727A72]"
                />

                <button
                  type="button"
                  disabled={!comment.trim() || submittingComment}
                  onClick={submitComment}
                  aria-label="Post comment"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-[#dc651b] text-white transition-all hover:scale-105 hover:bg-[#E85D3F] disabled:pointer-events-none disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </div>

              <div className="mt-2 flex justify-between px-1 text-[12px] text-[#59635C]">
                <span>
                  {user
                    ? `Commenting as ${user.displayName || "you"}`
                    : "Google sign-in required"}
                </span>

                <span>Enter to share</span>
              </div>
            </div>

            {/* Comments Feed */}
            <div
              id="portfolio-comments-feed"
              onMouseEnter={() => setCommentsPaused(true)}
              onMouseLeave={() => setCommentsPaused(false)}
              className="mx-auto mt-10 h-[330px] max-w-3xl overflow-hidden"
              style={{
                scrollbarWidth: "thin",
              }}
            >
              {comments.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <p className="text-sm font-medium text-[#E6D2B5]">
                      Be the first to leave a comment.
                    </p>

                    <p className="mt-2 text-xs text-[#727A72]">
                      Your feedback will appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {comments.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-3 border-b border-[#28323C]/40 py-5"
                    >
                      <div className="size-9 shrink-0 overflow-hidden rounded-full bg-[#641F32]">
                        {item.photoURL ? (
                          <img
                            src={item.photoURL}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-xs font-bold text-[#E6D2B5]">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#E6D2B5]">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-[#A9ADA8]">
                          {item.text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-[#59635C]">
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


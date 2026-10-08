
import { useEffect, useMemo, useRef, useState } from "react";
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
import { Star, Send, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// @ts-ignore -- Firebase config is shipped as JS and lacks generated typings in this project.
import { auth, db } from "@/firebase/config";

gsap.registerPlugin(ScrollTrigger);

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

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const headingWordsRef = useRef<HTMLSpanElement[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const ratingCardRef = useRef<HTMLDivElement | null>(null);
  const commentsCardRef = useRef<HTMLDivElement | null>(null);
  const starRefs = useRef<HTMLButtonElement[]>([]);

  // =========================================================
  // ADVANCED GSAP ANIMATION
  // =========================================================

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const content = contentRef.current;
    const ratingCard = ratingCardRef.current;
    const commentsCard = commentsCardRef.current;

    if (
      !section ||
      !heading ||
      !content ||
      !ratingCard ||
      !commentsCard
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const words = headingWordsRef.current.filter(Boolean);
      const stars = starRefs.current.filter(Boolean);

      /*
       * -----------------------------------------------
       * HEADING
       *
       * Words rise from underneath a clipped container.
       * This feels much more premium than a simple fade.
       * -----------------------------------------------
       */

      gsap.set(words, {
        yPercent: 115,
        rotateX: -18,
        transformOrigin: "50% 100%",
      });

      gsap.to(words, {
        yPercent: 0,
        rotateX: 0,
        duration: 1.15,
        stagger: 0.075,
        ease: "power4.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      /*
       * Small eyebrow movement.
       */

      const eyebrow =
        heading.querySelector<HTMLElement>(
          "[data-feedback-eyebrow]"
        );

      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          {
            x: -30,
            letterSpacing: "0.4em",
          },
          {
            x: 0,
            letterSpacing: "0.25em",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 86%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      }

      /*
       * -----------------------------------------------
       * CONTENT AREA
       *
       * Both cards enter from slightly different
       * directions, creating depth.
       * -----------------------------------------------
       */

      gsap.fromTo(
        ratingCard,
        {
          y: 80,
          rotate: -2,
          scale: 0.96,
        },
        {
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: content,
            start: "top 86%",
            toggleActions:
              "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        commentsCard,
        {
          y: 90,
          rotate: 2,
          scale: 0.96,
        },
        {
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.1,
          delay: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: content,
            start: "top 86%",
            toggleActions:
              "play none none reverse",
          },
        }
      );

      /*
       * -----------------------------------------------
       * STARS
       *
       * Each star settles into place separately.
       * -----------------------------------------------
       */

      if (stars.length > 0) {
        gsap.fromTo(
          stars,
          {
            y: 18,
            scale: 0.65,
            rotate: -15,
          },
          {
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.55,
            stagger: 0.07,
            delay: 0.3,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: ratingCard,
              start: "top 78%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      }

      /*
       * -----------------------------------------------
       * COMMENT CARDS
       *
       * New comments animate whenever Firebase
       * updates the list.
       * -----------------------------------------------
       */

      const commentCards =
        commentsCard.querySelectorAll<HTMLElement>(
          "[data-comment-card]"
        );

      if (commentCards.length > 0) {
        gsap.fromTo(
          commentCards,
          {
            y: 35,
            clipPath:
              "inset(0 0 100% 0)",
          },
          {
            y: 0,
            clipPath:
              "inset(0 0 0% 0)",
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: commentsCard,
              start: "top 82%",
              toggleActions:
                "play none none reverse",
            },
          }
        );
      }

      /*
       * -----------------------------------------------
       * VERY SUBTLE PARALLAX
       *
       * No pinning. No horizontal movement.
       * Just enough movement to create depth.
       * -----------------------------------------------
       */

      gsap.to(
        ratingCard.querySelector(
          "[data-rating-inner]"
        ),
        {
          y: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ratingCard,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      gsap.to(
        commentsCard.querySelector(
          "[data-comments-inner]"
        ),
        {
          y: -5,
          ease: "none",
          scrollTrigger: {
            trigger: commentsCard,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [comments.length]);

  // =========================================================
  // AUTH
  // =========================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider =
        new GoogleAuthProvider();

      await signInWithPopup(
        auth,
        provider
      );
    } catch (error) {
      console.error(
        "Google sign-in failed:",
        error
      );

      setMessage(
        "Sign-in was cancelled or could not be completed."
      );
    }
  };

  // =========================================================
  // RATINGS
  // =========================================================

  useEffect(() => {
    const ratingsQuery = collection(
      db,
      "portfolioRatings"
    );

    const unsubscribe = onSnapshot(
      ratingsQuery,
      (
        snapshot: QuerySnapshot<DocumentData>
      ) => {
        const data: Rating[] =
          snapshot.docs.map((item) => {
            const itemData = item.data();

            return {
              uid: item.id,
              rating:
                typeof itemData.rating ===
                "number"
                  ? itemData.rating
                  : 0,
            };
          });

        setRatings(data);
      },
      (error) => {
        console.error(
          "Ratings fetch error:",
          error
        );

        setMessage(
          "Ratings could not be loaded."
        );
      }
    );

    return unsubscribe;
  }, []);

  const averageRating = useMemo(() => {
    const validRatings =
      ratings.filter(
        (item) =>
          Number.isFinite(item.rating) &&
          item.rating >= 1 &&
          item.rating <= 5
      );

    if (validRatings.length === 0) {
      return 0;
    }

    const total = validRatings.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    return total / validRatings.length;
  }, [ratings]);

  const userRating = user
    ? ratings.find(
        (item) => item.uid === user.uid
      )?.rating ?? 0
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

      await setDoc(
        doc(
          db,
          "portfolioRatings",
          user.uid
        ),
        {
          uid: user.uid,
          name:
            user.displayName ||
            "Anonymous",
          email: user.email || "",
          photoURL:
            user.photoURL || "",
          rating: selectedRating,
          updatedAt:
            serverTimestamp(),
        }
      );

      setMessage(
        "Thanks for rating my portfolio."
      );
    } catch (error) {
      console.error(
        "Rating error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmittingRating(false);
    }
  };

  // =========================================================
  // COMMENTS
  // =========================================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(
        db,
        "portfolioComments"
      ),
      (
        snapshot: QuerySnapshot<DocumentData>
      ) => {
        const fetchedComments: Comment[] =
          snapshot.docs
            .map((item) => {
              const data = item.data();

              const uid =
                typeof data["uid"] ===
                "string"
                  ? data["uid"]
                  : "";

              const name =
                typeof data["name"] ===
                  "string" &&
                data["name"].trim()
                  ? data["name"]
                  : "Anonymous";

              const photoURL =
                typeof data[
                  "photoURL"
                ] === "string"
                  ? data["photoURL"]
                  : "";

              const text =
                typeof data["text"] ===
                "string"
                  ? data["text"]
                  : "";

              const commentData: Comment =
                {
                  id: item.id,
                  uid,
                  name,
                  photoURL,
                  text,
                };

              if (
                data["createdAt"] instanceof
                Timestamp
              ) {
                commentData.createdAt =
                  data["createdAt"];
              }

              return commentData;
            })
            .filter(
              (item) =>
                item.text.trim() !== ""
            );

        fetchedComments.sort(
          (a, b) => {
            const timeA =
              a.createdAt?.toMillis() ??
              0;

            const timeB =
              b.createdAt?.toMillis() ??
              0;

            return timeB - timeA;
          }
        );

        setComments(
          fetchedComments
        );
      },
      (error) => {
        console.error(
          "Comments fetch error:",
          error
        );

        setMessage(
          "Comments could not be loaded."
        );
      }
    );

    return unsubscribe;
  }, []);

  const submitComment = async () => {
    const cleanComment =
      comment.trim();

    if (!cleanComment) return;

    if (!user) {
      await loginWithGoogle();
      return;
    }

    try {
      setSubmittingComment(true);
      setMessage("");

      await addDoc(
        collection(
          db,
          "portfolioComments"
        ),
        {
          uid: user.uid,
          name:
            user.displayName ||
            "Anonymous",
          email:
            user.email || "",
          photoURL:
            user.photoURL || "",
          text: cleanComment,
          createdAt:
            serverTimestamp(),
        }
      );

      setComment("");

      setMessage(
        "Your comment has been posted."
      );
    } catch (error) {
      console.error(
        "Comment error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  const headingWords = [
    "A little",
    "feedback",
    "goes a long",
    "way.",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-[#28323C]/50 bg-background py-20 sm:py-24 lg:py-28"
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#dc651b]/[0.035] blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-180px] top-[35%] h-[350px] w-[350px] rounded-full bg-[#E85D3F]/[0.025] blur-[100px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">

        {/* ===================================================
            HEADING
        ==================================================== */}

        <div
          ref={headingRef}
          className="mx-auto max-w-5xl text-center"
        >
          <p
            data-feedback-eyebrow
            className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#dc651b] sm:text-xs"
          >
            Feedback / 04
          </p>

          <h2
            className="perspective-[900px] font-myfont text-[3.2rem] font-semibold leading-[0.9] tracking-[-0.045em] text-[#E85D3F] sm:text-6xl lg:text-[6.4rem]"
          >
            {headingWords.map(
              (word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="mr-[0.16em] inline-block overflow-hidden align-bottom pb-[0.08em]"
                >
                  <span
                    ref={(element) => {
                      if (element) {
                        headingWordsRef.current[
                          index
                        ] = element;
                      }
                    }}
                    className="inline-block will-change-transform"
                  >
                    {word}
                  </span>
                </span>
              )
            )}
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-[#8E958F] sm:text-base sm:leading-7">
            A quick rating or honest thought
            helps me make the work better.
          </p>
        </div>

        {/* ===================================================
            MAIN CONTENT
        ==================================================== */}

        <div
          ref={contentRef}
          className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-[0.82fr_1.18fr]"
        >

          {/* =================================================
              LEFT: RATING + COMMENT INPUT
          ================================================= */}

          <div
            ref={ratingCardRef}
            className="will-change-transform"
          >
            <div
              data-rating-inner
              className="h-full rounded-2xl border border-[#28323C]/70 bg-[#111615]/70 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-7"
            >

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#727A72]">
                    Portfolio rating
                  </p>

                  <div className="mt-3 flex items-end gap-3">
                    <span className="font-myfont text-5xl font-semibold leading-none text-[#E85D3F]">
                      {averageRating
                        ? averageRating.toFixed(
                            1
                          )
                        : "—"}
                    </span>

                    <span className="pb-1 text-xs text-[#68716B]">
                      / 5
                    </span>
                  </div>
                </div>

                <div className="grid size-11 place-items-center rounded-full border border-[#dc651b]/20 bg-[#dc651b]/[0.07]">
                  <Star className="size-5 text-[#dc651b]" />
                </div>
              </div>

              {/* Stars */}

              <div className="mt-7 border-t border-[#28323C]/60 pt-6">
                <p className="text-xs text-[#87917F]">
                  How would you rate this
                  portfolio?
                </p>

                <div className="mt-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (star) => {
                      const active =
                        star <=
                        (hoverRating ||
                          selectedRating);

                      return (
                        <button
                          key={star}
                          ref={(element) => {
                            if (element) {
                              starRefs.current[
                                star - 1
                              ] = element;
                            }
                          }}
                          type="button"
                          aria-label={`Rate ${star} out of 5`}
                          onMouseEnter={() =>
                            setHoverRating(
                              star
                            )
                          }
                          onMouseLeave={() =>
                            setHoverRating(
                              0
                            )
                          }
                          onClick={() =>
                            setSelectedRating(
                              star
                            )
                          }
                          className="rounded-full p-1 text-[#dc651b] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc651b]"
                        >
                          <Star
                            className={`size-5 ${
                              active
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-[#59635C]">
                    {ratings.length}{" "}
                    {ratings.length === 1
                      ? "rating"
                      : "ratings"}
                  </span>

                  {userRating > 0 && (
                    <span className="text-[11px] text-[#727A72]">
                      Your rating:{" "}
                      {userRating}/5
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    !selectedRating ||
                    submittingRating
                  }
                  onClick={
                    submitRating
                  }
                  className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#dc651b] px-5 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E85D3F] hover:shadow-[0_10px_30px_rgba(220,101,27,0.18)] disabled:pointer-events-none disabled:opacity-30"
                >
                  <Star className="size-3.5" />

                  {submittingRating
                    ? "Saving..."
                    : "Submit rating"}
                </button>
              </div>

              {/* Comment input */}

              <div className="mt-6 border-t border-[#28323C]/60 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Quote className="size-3.5 text-[#dc651b]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#727A72]">
                    Leave a thought
                  </p>
                </div>

                <div className="rounded-xl border border-[#28323C]/80 bg-[#0C100F]/70 p-3 transition-colors duration-300 focus-within:border-[#dc651b]/50">
                  <textarea
                    value={comment}
                    onChange={(event) =>
                      setComment(
                        event.target.value
                      )
                    }
                    placeholder={
                      user
                        ? "Share your thoughts..."
                        : "Sign in to leave a comment..."
                    }
                    rows={3}
                    className="w-full resize-none bg-transparent text-sm leading-6 text-[#FFF9F1] outline-none placeholder:text-[#59635C]"
                  />

                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={
                        !comment.trim() ||
                        submittingComment
                      }
                      onClick={
                        submitComment
                      }
                      aria-label="Post comment"
                      className="grid size-9 place-items-center rounded-full bg-[#dc651b] text-white transition-all duration-300 hover:scale-105 hover:bg-[#E85D3F] disabled:pointer-events-none disabled:opacity-30"
                    >
                      <Send className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT: COMMENTS
          ================================================= */}

          <div
            ref={commentsCardRef}
            className="will-change-transform"
          >
            <div
              data-comments-inner
              className="h-full rounded-2xl border border-[#28323C]/70 bg-[#111615]/45 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-7"
            >

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dc651b]">
                    Comments
                  </p>

                  <h3 className="mt-2 font-myfont text-2xl font-semibold text-[#E85D3F] sm:text-3xl">
                    What people are saying
                  </h3>
                </div>

                <span className="hidden text-[10px] uppercase tracking-[0.15em] text-[#59635C] sm:block">
                  {comments.length}{" "}
                  {comments.length === 1
                    ? "comment"
                    : "comments"}
                </span>
              </div>

              <div className="mt-6 max-h-[390px] overflow-y-auto pr-2 [scrollbar-color:#3a433d_transparent] [scrollbar-width:thin]">
                {comments.length === 0 ? (

                  <div className="flex min-h-[260px] items-center justify-center text-center">
                    <div>
                      <div className="mx-auto grid size-12 place-items-center rounded-full border border-[#28323C] bg-[#0C100F]">
                        <Quote className="size-4 text-[#dc651b]" />
                      </div>

                      <p className="mt-4 text-sm font-medium text-[#E85D3F]">
                        Be the first to
                        leave a comment.
                      </p>

                      <p className="mt-2 text-xs text-[#59635C]">
                        Your feedback will
                        appear here.
                      </p>
                    </div>
                  </div>

                ) : (

                  <div>
                    {comments.map(
                      (item, index) => (
                        <article
                          key={item.id}
                          data-comment-card
                          className={`group flex gap-3 py-5 ${
                            index !==
                            comments.length - 1
                              ? "border-b border-[#28323C]/50"
                              : ""
                          }`}
                        >

                          {/* Avatar */}

                          <div className="size-9 shrink-0 overflow-hidden rounded-full border border-[#28323C] bg-[#641F32]">
                            {item.photoURL ? (
                              <img
                                src={
                                  item.photoURL
                                }
                                alt=""
                                className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="grid size-full place-items-center text-xs font-bold text-[#E85D3F]">
                                {item.name
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Text */}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-semibold text-[#E85D3F]">
                                {item.name}
                              </p>

                              <span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-[#59635C]">
                                Feedback
                              </span>
                            </div>

                            <p className="mt-1.5 text-sm leading-6 text-[#A9ADA8]">
                              {item.text}
                            </p>
                          </div>

                        </article>
                      )
                    )}
                  </div>

                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            STATUS
        ==================================================== */}

        {message && (
          <p className="mt-5 text-center text-[11px] text-[#727A72]">
            {message}
          </p>
        )}

      </div>
    </section>
  );
}

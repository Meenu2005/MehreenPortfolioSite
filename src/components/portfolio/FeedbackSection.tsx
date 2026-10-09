import { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
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
import { Send, Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// @ts-ignore Firebase config is a JavaScript module.
import { auth, db } from "@/firebase/config";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#E85D3F";
const MUTED = "#87917F";
const BORDER = "#28323C";

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

/* =========================================================
   PANDA
   A cute panda peeks over the comment box, rests its paws on
   the edge, follows the user's typing, and occasionally hides.
========================================================= */

function FeedbackPanda({
  textareaRef,
  comment,
  submitted,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  comment: string;
  submitted: boolean;
}) {
  const pandaRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const leftPawRef = useRef<SVGGElement | null>(null);
  const rightPawRef = useRef<SVGGElement | null>(null);
  const leftPupilRef = useRef<SVGCircleElement | null>(null);
  const rightPupilRef = useRef<SVGCircleElement | null>(null);
  const leftEyeRef = useRef<SVGGElement | null>(null);
  const rightEyeRef = useRef<SVGGElement | null>(null);
  const mouthRef = useRef<SVGPathElement | null>(null);
  const [isNearInput, setIsNearInput] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const enter = () => setIsNearInput(true);
    const leave = () => {
      if (document.activeElement !== textarea) setIsNearInput(false);
    };

    textarea.addEventListener("mouseenter", enter);
    textarea.addEventListener("mouseleave", leave);
    textarea.addEventListener("focus", enter);
    textarea.addEventListener("blur", leave);
    return () => {
      textarea.removeEventListener("mouseenter", enter);
      textarea.removeEventListener("mouseleave", leave);
      textarea.removeEventListener("focus", enter);
      textarea.removeEventListener("blur", leave);
    };
  }, [textareaRef]);

  useEffect(() => {
    const panda = pandaRef.current;
    const head = headRef.current;
    const leftPaw = leftPawRef.current;
    const rightPaw = rightPawRef.current;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;
    const mouth = mouthRef.current;
    if (!panda || !head || !leftPaw || !rightPaw || !leftEye || !rightEye || !mouth) return;

    const ctx = gsap.context(() => {
      gsap.set(panda, { y: 20, opacity: 0 });
      gsap.set([head, leftPaw, rightPaw], { y: 7 });

      gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } })
        .to(panda, { y: 0, opacity: 1, duration: 0.65 })
        .to([head, leftPaw, rightPaw], { y: 0, duration: 0.4, stagger: 0.05 }, "-=0.35");

      gsap.to(head, {
        y: -1.5,
        rotation: 1.2,
        transformOrigin: "50% 90%",
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(leftPaw, {
        rotation: -3,
        transformOrigin: "90% 100%",
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(rightPaw, {
        rotation: 3,
        transformOrigin: "10% 100%",
        duration: 1.35,
        delay: 0.12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const eyes = gsap.timeline({ repeat: -1, repeatDelay: 0.55 });
      eyes
        .to([leftEye, rightEye], { x: -2, duration: 0.55, ease: "sine.inOut" })
        .to([leftEye, rightEye], { x: 2, duration: 0.7, ease: "sine.inOut" })
        .to([leftEye, rightEye], { x: 0, duration: 0.45, ease: "sine.inOut" })
        .to([leftEye, rightEye], {
          scaleY: 0.12,
          transformOrigin: "50% 50%",
          duration: 0.1,
          repeat: 1,
          yoyo: true,
        }, "+=0.25");

      gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 2.3 })
        .to(panda, { y: 18, duration: 0.42, ease: "power2.in" })
        .to(panda, { y: 0, duration: 0.62, ease: "back.out(1.7)" });

      gsap.set(mouth, { attr: { d: "M 92 67 Q 100 74 108 67" } });
    }, panda);

    return () => ctx.revert();
  }, [textareaRef]);

  useEffect(() => {
    const panda = pandaRef.current;
    const leftPupil = leftPupilRef.current;
    const rightPupil = rightPupilRef.current;
    const head = headRef.current;
    if (!panda || !leftPupil || !rightPupil || !head) return;

    gsap.to(panda, { y: isNearInput ? -3 : 0, duration: 0.35, ease: "back.out(1.5)", overwrite: "auto" });
    gsap.to([leftPupil, rightPupil], { x: isNearInput ? 1.5 : 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    gsap.to(head, { rotation: isNearInput ? -1.5 : 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
  }, [isNearInput]);

  useEffect(() => {
    const pupils = [leftPupilRef.current, rightPupilRef.current].filter(Boolean) as SVGCircleElement[];
    if (!pupils.length) return;
    const direction = comment.length === 0 ? 0 : comment.length % 4 === 0 ? 2 : comment.length % 2 === 0 ? -1.2 : 0.7;
    gsap.to(pupils, { x: direction, duration: 0.2, ease: "power2.out", overwrite: "auto" });
  }, [comment]);

  useEffect(() => {
    if (!submitted) return;
    const panda = pandaRef.current;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;
    const mouth = mouthRef.current;
    if (!panda || !leftEye || !rightEye || !mouth) return;

    gsap.fromTo(panda, { y: -8 }, { y: 0, duration: 0.65, ease: "bounce.out", overwrite: "auto" });
    gsap.to([leftEye, rightEye], { scaleY: 0.12, transformOrigin: "50% 50%", duration: 0.1, repeat: 1, yoyo: true, overwrite: "auto" });
    gsap.to(mouth, { attr: { d: "M 91 66 Q 100 76 109 66" }, duration: 0.2 });
  }, [submitted]);

  return (
    <div
      ref={pandaRef}
      aria-hidden="true"
      className="pointer-events-none absolute -top-[47px] left-1/2 z-[1] h-[88px] w-[148px] -translate-x-1/2 sm:-top-[51px] sm:h-[96px] sm:w-[162px]"
    >
      <svg viewBox="0 0 200 105" className="h-full w-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ears and round white head, like the supplied panda reference. */}
        <circle cx="57" cy="24" r="21" fill="#E85D3F" />
        <circle cx="143" cy="24" r="21" fill="#E85D3F" />
        <path d="M35 82C35 45 56 13 100 13C144 13 165 45 165 82L151 91H49L35 82Z" fill="#FFFEFC" stroke="#E85D3F" strokeWidth="3" />

        <g ref={headRef}>
          {/* Panda eye patches */}
          <path d="M65 37C54 37 48 47 51 60C53 70 61 75 69 68C75 62 80 50 76 42C74 39 70 37 65 37Z" fill="#E85D3F" />
          <path d="M135 37C146 37 152 47 149 60C147 70 139 75 131 68C125 62 120 50 124 42C126 39 130 37 135 37Z" fill="#E85D3F" />
          <g ref={leftEyeRef}>
            <circle cx="65" cy="51" r="6.4" fill="#FFFEFC" />
            <circle ref={leftPupilRef} cx="66" cy="51" r="3.5" fill="#E85D3F" />
            <circle cx="67" cy="49.5" r="1.25" fill="#FFFFFF" />
          </g>
          <g ref={rightEyeRef}>
            <circle cx="135" cy="51" r="6.4" fill="#FFFEFC" />
            <circle ref={rightPupilRef} cx="134" cy="51" r="3.5" fill="#E85D3F" />
            <circle cx="135" cy="49.5" r="1.25" fill="#FFFFFF" />
          </g>
          <ellipse cx="100" cy="58" rx="12" ry="8" fill="#E85D3F" />
          <path d="M100 65V70M100 70C96 75 91 75 88 72M100 70C104 75 109 75 112 72" stroke="#E85D3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="79" cy="68" rx="6" ry="3.5" fill="#F2A4B9" opacity="0.5" />
          <ellipse cx="121" cy="68" rx="6" ry="3.5" fill="#F2A4B9" opacity="0.5" />
        </g>

        {/* The textbox sits in front of the lower face, making the panda peek over it. */}
        <g ref={leftPawRef}>
          <path d="M48 75C39 74 32 79 31 87C30 94 36 98 44 97L64 97C71 97 76 92 74 85C72 78 63 75 48 75Z" fill="#E85D3F" />
          <path d="M43 91C44 95 48 97 52 97M54 91C55 95 59 97 63 96" stroke="#E85D3F" strokeWidth="1.6" strokeLinecap="round" />
        </g>
        <g ref={rightPawRef}>
          <path d="M152 75C161 74 168 79 169 87C170 94 164 98 156 97L136 97C129 97 124 92 126 85C128 78 137 75 152 75Z" fill="#E85D3F" />
          <path d="M157 91C156 95 152 97 148 97M146 91C145 95 141 97 137 96" stroke="#E85D3F" strokeWidth="1.6" strokeLinecap="round" />
        </g>
        <path ref={mouthRef} d="M 92 67 Q 100 74 108 67" stroke="#E85D3F" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* =========================================================
   FEEDBACK SECTION
========================================================= */

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
  const [submitted, setSubmitted] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const headingLettersRef = useRef<HTMLSpanElement[]>([]);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const ratingAreaRef = useRef<HTMLDivElement | null>(null);
  const commentsAreaRef = useRef<HTMLDivElement | null>(null);
  const starRefs = useRef<HTMLButtonElement[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /* =======================================================
     HEADING + SECTION ANIMATIONS
  ======================================================= */

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const content = contentRef.current;
    const ratingArea = ratingAreaRef.current;
    const commentsArea = commentsAreaRef.current;

    if (!section || !heading || !content || !ratingArea || !commentsArea) {
      return;
    }

    const ctx = gsap.context(() => {
      const letters = headingLettersRef.current.filter(Boolean);
      const stars = starRefs.current.filter(Boolean);

      // Every letter settles into its own original position.
      gsap.set(letters, {
        y: 22,
        opacity: 0,
        rotateX: -22,
        transformOrigin: "50% 100%",
      });

      gsap.to(letters, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.7,
        stagger: {
          each: 0.025,
          from: "start",
        },
        ease: "back.out(1.45)",
        scrollTrigger: {
          trigger: heading,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      // Each letter softly settles down, then lifts back into its own place.
      gsap.to(letters, {
        y: 3,
        duration: 0.42,
        stagger: {
          each: 0.035,
          from: "start",
        },
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.18,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: heading,
          start: "top 82%",
          toggleActions: "play pause pause pause",
        },
      });

      const eyebrow = heading.querySelector<HTMLElement>(
        "[data-feedback-eyebrow]",
      );

      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      gsap.fromTo(
        ratingArea,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: content,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        commentsArea,
        { x: 20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          delay: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: content,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      if (stars.length) {
        gsap.fromTo(
          stars,
          { y: 8, scale: 0.8, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ratingArea,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Animate new comments without rebuilding the whole section animation.
  useEffect(() => {
    const area = commentsAreaRef.current;
    if (!area || comments.length === 0) return;

    const cards = area.querySelectorAll<HTMLElement>("[data-comment-card]");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    }, area);

    return () => ctx.revert();
  }, [comments.length]);

  /* =======================================================
     AUTH
  ======================================================= */

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage("");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setMessage("Sign-in was cancelled or could not be completed.");
    }
  };

  /* =======================================================
     RATINGS
  ======================================================= */

  useEffect(() => {
    return onSnapshot(
      collection(db, "portfolioRatings"),
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
      },
    );
  }, []);

  const averageRating = useMemo(() => {
    const validRatings = ratings.filter(
      (item) =>
        Number.isFinite(item.rating) &&
        item.rating >= 1 &&
        item.rating <= 5,
    );

    if (!validRatings.length) return 0;

    const total = validRatings.reduce(
      (sum, item) => sum + item.rating,
      0,
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

      setMessage("Thanks for your rating!");
    } catch (error) {
      console.error("Rating error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmittingRating(false);
    }
  };

  /* =======================================================
     COMMENTS
  ======================================================= */

  useEffect(() => {
    return onSnapshot(
      collection(db, "portfolioComments"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const fetchedComments: Comment[] = snapshot.docs
          .map((item) => {
            const data = item.data();

            const uid =
              typeof data.uid === "string" ? data.uid : "";

            const name =
              typeof data.name === "string" && data.name.trim()
                ? data.name
                : "Anonymous";

            const photoURL =
              typeof data.photoURL === "string"
                ? data.photoURL
                : "";

            const text =
              typeof data.text === "string" ? data.text : "";

            const commentData: Comment = {
              id: item.id,
              uid,
              name,
              photoURL,
              text,
            };

            if (data.createdAt instanceof Timestamp) {
              commentData.createdAt = data.createdAt;
            }

            return commentData;
          })
          .filter((item) => item.text.trim() !== "");

        fetchedComments.sort(
          (a, b) =>
            (b.createdAt?.toMillis() ?? 0) -
            (a.createdAt?.toMillis() ?? 0),
        );

        setComments(fetchedComments);
      },
      (error) => {
        console.error("Comments fetch error:", error);
        setMessage("Comments could not be loaded.");
      },
    );
  }, []);

  const submitComment = async () => {
    const cleanComment = comment.trim();
    if (!cleanComment || submittingComment) return;

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
      setSubmitted(true);
      setMessage("Comment posted!");

      window.setTimeout(() => {
        setSubmitted(false);
      }, 1200);
    } catch (error) {
      console.error("Comment error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  /* =======================================================
     HEADING LETTERS
  ======================================================= */

  const headingWords = ["A little", "feedback", "goes a long", "way."];

  let letterIndex = 0;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      ref={sectionRef}
      className="relative  bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="font-myfont text-[2.7rem] font-semibold leading-[1.1] tracking-[-0.045em] text-[#E85D3F] sm:text-6xl lg:text-[5.5rem]">
            {headingWords.map((word, wordIndex) => (
              <span
                key={`${word}-${wordIndex}`}
                className="mr-[0.22em] inline-block whitespace-nowrap align-baseline"
              >
                {word.split("").map((letter, index) => {
                  const currentIndex = letterIndex++;

                  return (
                    <span
                      key={`${wordIndex}-${index}`}
                      ref={(element) => {
                        if (element) {
                          headingLettersRef.current[currentIndex] =
                            element;
                        }
                      }}
                      className="inline-block will-change-transform"
                    >
                      {letter}
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>
        </div>

        {/* Rating + Comments */}
        <div
          ref={contentRef}
          className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-6"
        >
          {/* Rating and comment input */}
          <div
            ref={ratingAreaRef}
            className="min-w-0 rounded-3xl  bg-surface-card p-5 sm:p-7"
          >
            <div className="flex items-center justify-between ">
            

              <div className="pb-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-3.5 ${
                        star <= Math.round(averageRating)
                          ? "fill-[#dc651b] text-[#dc651b]"
                          : "text-[#4D554F]"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#59635C]">
                  {ratings.length} {ratings.length === 1 ? "rating" : "ratings"}
                </p>
              </div>
                <span className=" text-6xl font-semibold leading-none tracking-[-0.05em] text-[#E85D3F] sm:text-3xl">
                {averageRating ? averageRating.toFixed(1) : "—"}
              </span>
            </div>

            <div className="mt-5 h-px w-full bg-[#28323C]/70" />

            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || selectedRating);

                return (
                  <button
                    key={star}
                    ref={(element) => {
                      if (element) starRefs.current[star - 1] = element;
                    }}
                    type="button"
                    aria-label={`Rate ${star} out of 5`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onFocus={() => setHoverRating(star)}
                    onBlur={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(star)}
                    className="rounded-full p-1 text-[#dc651b] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc651b]"
                  >
                    <Star
                      className={`size-5 ${active ? "fill-current" : ""}`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-1 flex items-center justify-between gap-2">
              {/* <span className="text-[10px] text-[#87917F]">
                {selectedRating ? `${selectedRating}/5` : "Select stars"} 
              </span> */}

              {/* {userRating > 0 && (
                <span className="text-[10px] text-[#727A72]">
                  Your rating: {userRating}/5
                </span>
              )} */}
            </div>

            <button
              type="button"
              disabled={!selectedRating || submittingRating}
              onClick={submitRating}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#dc651b] transition-all duration-300 hover:gap-3 disabled:pointer-events-none disabled:opacity-30"
            >
              {submittingRating ? "Saving..." : "Submit rating"}
              <span aria-hidden="true">→</span>
            </button>

            {/* Panda peeking over the comment box */}
            <div className="mt-8  pt-7 justify-between sm:flex sm:items-center sm:gap-4">
              <label
                htmlFor="feedback-comment"
                className="mb-3 block text-xs font-semibold tracking-wide text-[#E85D3F]"
              >
                {/* Your comment */}
              </label>

              <div className="relative pt-9">
                <FeedbackPanda
                  textareaRef={textareaRef}
                  comment={comment}
                  submitted={submitted}
                />

                <div className="relative z-[2] overflow-hidden rounded-2xl  bg-surface-input shadow-sm transition-colors duration-300 focus-within:border-[#E85D3F]/80 focus-within:ring-2 focus-within:ring-[#E85D3F]/10">
                  <textarea
                    id="feedback-comment"
                    ref={textareaRef}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        (event.ctrlKey || event.metaKey) &&
                        event.key === "Enter"
                      ) {
                        event.preventDefault();
                        void submitComment();
                      }
                    }}
                    placeholder={
                      user
                        ? "Write something..."
                        : "Sign in to leave a comment..."
                    }
                    rows={4}
                    maxLength={1000}
                    className="min-h-[112px] w-full resize-y bg-transparent px-4 py-4 pr-12 text-sm leading-6 text-[#E85D3F] caret-[#E85D3F] outline-none placeholder:text-[#87917F]/80 sm:px-5"
                  />

                  <button
                    type="button"
                    disabled={!comment.trim() || submittingComment}
                    onClick={submitComment}
                    aria-label="Post comment"
                    title="Post comment"
                    className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-xl bg-[#E85D3F] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d84d31] disabled:pointer-events-none disabled:opacity-35"
                  >
                    <Send className="size-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-right text-[10px] tabular-nums text-[#87917F]/80">
                {comment.length}/1000
              </p>
            </div>
          </div>

          {/* Comments */}
          <div
            ref={commentsAreaRef}
            className="min-w-0 rounded-3xl  bg-surface-card p-5 sm:p-7"
          >
            <div className="flex items-end justify-between gap-4">
              <h3 className="font-semibold leading-none tracking-[-0.04em] text-[#E85D3F] sm:text-xl">
                Comments
              </h3>

              <span className="text-6xl font-semibold leading-none tracking-[-0.05em] text-[#E85D3F] sm:text-3xl">
                {comments.length}
              </span>
            </div>

            <div className="mt-6 h-px w-full bg-[#28323C]" />

            {comments.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center py-10 text-center">
                <p className="text-sm text-[#87917F]">
                  No comments yet. Be the first.
                </p>
              </div>
            ) : (
              <div>
                {comments.map((item) => (
                  <article
                    key={item.id}
                    data-comment-card
                    className="py-5 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="size-10 shrink-0 overflow-hidden rounded-full border border-[#28323C]/70 bg-[#641F32]">
                        {item.photoURL ? (
                          <img
                            src={item.photoURL}
                            alt=""
                            loading="lazy"
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-xs font-bold text-[#E85D3F]">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item.name}
                        </p>

                        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-foreground/75">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 text-xs text-[#E85D3F]"
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
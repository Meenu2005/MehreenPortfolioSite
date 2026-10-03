
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageSquare,
  Star,
  Users,
  Send,
  Shield,
 
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

// @ts-ignore -- Firebase config is shipped as JS.
import { auth, db } from "@/firebase/config";

import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type QuerySnapshot,
  Timestamp,
} from "firebase/firestore";

import { projects } from "@/data/portfolio";

const ADMIN_EMAIL = "mehreenrao220117@gmail.com";

type CommentItem = {
  id: string;
  uid: string;
  name: string;
  email?: string;
  text: string;
  createdAt?: Timestamp;
};

type RatingItem = {
  id: string;
  uid: string;
  rating: number;
  name?: string;
  email?: string;
  photoURL?: string;
};

type ChatMessage = {
  id: string;
  userId: string;
  name: string;
  email: string;
  photoURL: string;
  text: string;
  sender: "user" | "admin";
  createdAt?: Timestamp;
};

type Conversation = {
  userId: string;
  name: string;
  email: string;
  photoURL: string;
  messages: ChatMessage[];
};
type ReviewLink = {
  id: string;
  token: string;
  projectTitle: string;
  projectLogo?: string;
  projectLink?: string;
  status: "awaiting_review" | "pending" | "approved" | "rejected";
  used: boolean;
  clientName?: string;
  profilePhoto?: string;
  reviewText?: string;
  createdAt?: Timestamp;
};
type ProjectReview = {
  id: string;
  token: string;
  projectTitle: string;
  projectLogo?: string;
  clientName: string;
  profilePhoto: string;
  reviewText: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Timestamp;
};
export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [activeSection, setActiveSection] = useState<
  "comments" | "ratings" | "chats" | "reviews"
>("comments");

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const [reviewLinks, setReviewLinks] = useState<ReviewLink[]>([]);
const [selectedProjectTitle, setSelectedProjectTitle] = useState(
  projects[0].title
);
const [generatedLink, setGeneratedLink] = useState("");
const [linkCopied, setLinkCopied] = useState(false);
const [generatingReviewLink, setGeneratingReviewLink] = useState(false);

  const [projectReviews, setProjectReviews] = useState<ProjectReview[]>([]);

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
  }, []);
 /* ---------------- Admin ---------------- */
  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  useEffect(() => {
  if (!isAdmin) return;

  const unsubscribe = onSnapshot(
    collection(db, "projectReviewLinks"),
    (snapshot) => {
     const links: ReviewLink[] = snapshot.docs.map((item) => {
  const data = item.data();

  return {
    id: item.id,
    token: item.id,
    projectTitle: data["projectTitle"] || "",
    projectLogo: data["projectLogo"] || "",
    projectLink: data["projectLink"] || "",
    status: data["status"] || "awaiting_review",
    used: data["used"] || false,
    clientName: data["clientName"] || "",
    profilePhoto: data["profilePhoto"] || "",
    reviewText: data["reviewText"] || "",
    createdAt: data["createdAt"],
  };
});

      links.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });

      setReviewLinks(links);
    }
  );

  return unsubscribe;
  }, [isAdmin]);
  

  useEffect(() => {
  if (!isAdmin) return;

  const unsubscribe = onSnapshot(
    collection(db, "projectReviews"),
    (snapshot) => {
      const reviews: ProjectReview[] = snapshot.docs.map((item) => {
        const data = item.data();

        return {
          id: item.id,
          token: data["token"] || item.id,
          projectTitle: data["projectTitle"] || "",
          projectLogo: data["projectLogo"] || "",
          clientName: data["clientName"] || "",
          profilePhoto: data["profilePhoto"] || "",
          reviewText: data["reviewText"] || "",
          status: data["status"] || "pending",
          createdAt: data["createdAt"],
        };
      });

      reviews.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;

        return bTime - aTime;
      });

      setProjectReviews(reviews);
    },
    (error) => {
      console.error("Error loading project reviews:", error);
    }
  );

  return unsubscribe;
}, [isAdmin]);
  /* ---------------- COMMENTS ---------------- */

  useEffect(() => {
    if (!isAdmin) return;

    return onSnapshot(
      collection(db, "portfolioComments"),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data: CommentItem[] = snapshot.docs
          .map((item) => {
            const value = item.data();

            const comment: CommentItem = {
              id: item.id,
              uid:
                typeof value["uid"] === "string"
                  ? value["uid"]
                  : "",
              name:
                typeof value["name"] === "string"
                  ? value["name"]
                  : "Anonymous",
              text:
                typeof value["text"] === "string"
                  ? value["text"]
                  : "",
            };

            if (typeof value["email"] === "string") {
              comment.email = value["email"];
            }

            if (value["createdAt"] instanceof Timestamp) {
              comment.createdAt = value["createdAt"];
            }

            return comment;
          })
          .filter((item) => item.text.trim());

        data.sort(
          (a, b) =>
            (b.createdAt?.toMillis() ?? 0) -
            (a.createdAt?.toMillis() ?? 0)
        );

        setComments(data);
      }
    );
  }, [isAdmin]);

  /* ---------------- RATINGS ---------------- */

useEffect(() => {
  if (!isAdmin) return;

  return onSnapshot(
    collection(db, "portfolioRatings"),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const ratingData: RatingItem[] = snapshot.docs.map((item) => {
        const data = item.data();

        const ratingItem: RatingItem = {
          id: item.id,
          uid: item.id,
          rating:
            typeof data["rating"] === "number"
              ? data["rating"]
              : 0,
        };

        if (typeof data["name"] === "string") {
          ratingItem.name = data["name"];
        }

        if (typeof data["email"] === "string") {
          ratingItem.email = data["email"];
        }

        return ratingItem;
      });

      setRatings(ratingData);
    }
  );
}, [isAdmin]);

 const generateReviewLink = async () => {
  if (!user) return;

  const selectedProject = projects.find(
    (project) => project.title === selectedProjectTitle
  );

  if (!selectedProject) return;

  try {
    setGeneratingReviewLink(true);
    setLinkCopied(false);

    const token = crypto.randomUUID().replaceAll("-", "");

    await setDoc(doc(db, "projectReviewLinks", token), {
      token,
      projectTitle: selectedProject.title,
      projectLogo: selectedProject.logo || "",
      projectLink: selectedProject.link || "",
      status: "awaiting_review",
      used: false,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
    });

    const reviewUrl = `${window.location.origin}/review/${token}`;

    setGeneratedLink(reviewUrl);
  } catch (error) {
    console.error("Error generating review link:", error);
    alert("Could not generate review link.");
  } finally {
    setGeneratingReviewLink(false);
  }
};

  const copyReviewLink = async () => {
  if (!generatedLink) return;

  try {
    await navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);

    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  } catch (error) {
    console.error("Could not copy link:", error);
  }
  };
  
  const updateReviewStatus = async (
  reviewId: string,
  status: "approved" | "rejected"
) => {
  try {
    await updateDoc(doc(db, "projectReviews", reviewId), {
      status,
      reviewedAt: serverTimestamp(),
      reviewedBy: user?.email || "",
    });

    // Also update the private link status
    const review = projectReviews.find(
      (item) => item.id === reviewId
    );

    if (review) {
      await updateDoc(
        doc(db, "projectReviewLinks", review.token),
        {
          status,
        }
      );
    }
  } catch (error) {
    console.error("Error updating review status:", error);
    alert("Could not update review.");
  }
};
  /* ---------------- CHAT MESSAGES ---------------- */

  useEffect(() => {
    if (!isAdmin) return;

    const messagesQuery = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(
      messagesQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const chatData: ChatMessage[] = snapshot.docs.map((item) => {
          const value = item.data();

          const message: ChatMessage = {
            id: item.id,
            userId:
              typeof value["userId"] === "string"
                ? value["userId"]
                : "",
            name:
              typeof value["name"] === "string"
                ? value["name"]
                : "Visitor",
            email:
              typeof value["email"] === "string"
                ? value["email"]
                : "",
            photoURL:
              typeof value["photoURL"] === "string"
                ? value["photoURL"]
                : "",
            text:
              typeof value["text"] === "string"
                ? value["text"]
                : "",
            sender:
              value["sender"] === "admin"
                ? "admin"
                : "user",
          };

          if (value["createdAt"] instanceof Timestamp) {
            message.createdAt = value["createdAt"];
          }

          return message;
        });

        setMessages(chatData);
      },
      (error) => {
        console.error("Failed to load admin messages:", error);
      }
    );
  }, [isAdmin]);

  /* ---------------- CONVERSATIONS ---------------- */

  const conversations = useMemo<Conversation[]>(() => {
    const map = new Map<string, Conversation>();

    for (const message of messages) {
      if (!message.userId) continue;

      if (!map.has(message.userId)) {
        map.set(message.userId, {
          userId: message.userId,
          name: message.name || "Visitor",
          email: message.email || "",
          photoURL: message.photoURL || "",
          messages: [],
        });
      }

      map.get(message.userId)!.messages.push(message);
    }

    return Array.from(map.values()).sort((a, b) => {
      const aLast =
        a.messages[a.messages.length - 1]?.createdAt?.toMillis() ?? 0;

      const bLast =
        b.messages[b.messages.length - 1]?.createdAt?.toMillis() ?? 0;

      return bLast - aLast;
    });
  }, [messages]);
// Select first conversation automatically.
useEffect(() => {
  if (selectedUserId) return;

  const firstConversation = conversations[0];

  if (firstConversation) {
    setSelectedUserId(firstConversation.userId);
  }
}, [conversations, selectedUserId]);
  const selectedConversation = conversations.find(
    (conversation) => conversation.userId === selectedUserId
  );
  

  /* ---------------- AVERAGE ---------------- */

  const averageRating = useMemo(() => {
    if (!ratings.length) return 0;

    const total = ratings.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    return total / ratings.length;
  }, [ratings]);

  /* ---------------- REPLY ---------------- */

  const sendReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reply.trim() || !selectedConversation || !user) return;

    try {
      setSendingReply(true);

      await addDoc(collection(db, "messages"), {
        userId: selectedConversation.userId,
        name: selectedConversation.name,
        email: selectedConversation.email,
        photoURL: user.photoURL || "",
        text: reply.trim(),
        sender: "admin",
        adminEmail: user.email,
        createdAt: serverTimestamp(),
        read: true,
      });

      setReply("");
    } catch (error) {
      console.error("Failed to send admin reply:", error);
    } finally {
      setSendingReply(false);
    }
  };

  /* ---------------- AUTH LOADING ---------------- */

  if (!authChecked) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center">
        Loading...
      </main>
    );
  }

  /* ---------------- NOT ADMIN ---------------- */

  if (!user || !isAdmin) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-5">
        <div className="w-full rounded-xl border border-border bg-card p-8 text-center shadow-lift">
          <Shield className="mx-auto size-10 text-primary" />

          <h1 className="mt-5 font-display text-2xl font-semibold">
            Admin access only
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Please sign in with the administrator Google account.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Back to portfolio
          </Link>
        </div>
      </main>
    );
  }

  /* ---------------- ADMIN ---------------- */

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">

      <div className="mb-8">
        <p className="text-sm font-medium text-primary">
          Portfolio administration
        </p>

        <h1 className="mt-1 font-display text-3xl font-semibold">
          Welcome back, Mehreen.
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your comments, ratings and conversations from one place.
        </p>
      </div>

      {/* Section tabs */}

      <div className="mb-6 flex flex-wrap gap-2 rounded-lg border border-border bg-card p-2">

        <button
          type="button"
          onClick={() => setActiveSection("comments")}
          className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium ${
            activeSection === "comments"
              ? "bg-comment text-white"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <MessageSquare className="size-4" />
          Comments
          <span className="opacity-70">
            {comments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("ratings")}
          className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium ${
            activeSection === "ratings"
              ? "bg-rating text-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Star className="size-4" />
          Ratings
          <span className="opacity-70">
            {ratings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("chats")}
          className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium ${
            activeSection === "chats"
              ? "bg-connect text-white"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Users className="size-4" />
          Chats
          <span className="opacity-70">
            {conversations.length}
          </span>
        </button>
<button
  type="button"
  onClick={() => setActiveSection("reviews")}
  className={`...`}
>
  Project Reviews
</button>
      </div>

      {/* COMMENTS */}

      {activeSection === "comments" && (
        <section className="rounded-xl border border-border bg-card shadow-soft">
          <div className="border-b border-border p-6">
            <h2 className="font-display text-xl font-semibold">
              Comments
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Recent visitor feedback.
            </p>
          </div>

          <div className="divide-y divide-border">
            {comments.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No comments yet.
              </p>
            ) : (
              comments.map((comment) => (
                <article
                  key={comment.id}
                  className="p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {comment.name}
                      </p>

                      {comment.email && (
                        <p className="text-xs text-muted-foreground">
                          {comment.email}
                        </p>
                      )}
                    </div>

                    {comment.createdAt && (
                      <time className="text-xs text-muted-foreground">
                        {comment.createdAt
                          .toDate()
                          .toLocaleString()}
                      </time>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {comment.text}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {/* RATINGS */}

      {activeSection === "ratings" && (
        <section className="rounded-xl border border-border bg-card shadow-soft">

          <div className="border-b border-border p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">

              <div>
                <h2 className="font-display text-xl font-semibold">
                  Ratings
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  All ratings submitted by visitors.
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold text-rating">
                  {averageRating.toFixed(1)}
                  <span className="text-base text-muted-foreground">
                    /5
                  </span>
                </p>

                <p className="text-xs text-muted-foreground">
                  {ratings.length} total rating
                  {ratings.length === 1 ? "" : "s"}
                </p>
              </div>

            </div>
          </div>

          <div className="divide-y divide-border">
            {ratings.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">
                No ratings yet.
              </p>
            ) : (
              ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {rating.name || "Visitor"}
                    </p>

                    {rating.email && (
                      <p className="text-xs text-muted-foreground">
                        {rating.email}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`size-4 ${
                          index < rating.rating
                            ? "fill-rating text-rating"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* CHATS */}

      {activeSection === "chats" && (
        <section className="grid min-h-[600px] overflow-hidden rounded-xl border border-border bg-card shadow-soft md:grid-cols-[280px_1fr]">

          {/* Conversation list */}

          <aside className="border-b border-border md:border-b-0 md:border-r">
            <div className="border-b border-border p-5">
              <h2 className="font-display text-lg font-semibold">
                Conversations
              </h2>
            </div>

            <div className="max-h-[550px] overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  No conversations yet.
                </p>
              ) : (
                conversations.map((conversation) => {
                  const lastMessage =
                    conversation.messages[
                      conversation.messages.length - 1
                    ];

                  return (
                    <button
                      key={conversation.userId}
                      type="button"
                      onClick={() =>
                        setSelectedUserId(conversation.userId)
                      }
                      className={`w-full border-b border-border p-4 text-left transition ${
                        selectedUserId === conversation.userId
                          ? "bg-muted"
                          : "hover:bg-muted/60"
                      }`}
                    >
                      <p className="truncate text-sm font-semibold">
                        {conversation.name || "Visitor"}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {conversation.email}
                      </p>

                      {lastMessage && (
                        <p className="mt-2 truncate text-xs text-muted-foreground">
                          {lastMessage.text}
                        </p>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Selected chat */}

          <div className="flex min-h-[600px] flex-col">

            {selectedConversation ? (
              <>
                <header className="border-b border-border p-5">
                  <p className="font-semibold">
                    {selectedConversation.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.email}
                  </p>
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto bg-chat p-5 sm:p-7">

                  {selectedConversation.messages.map((message) => {
                    const isAdminMessage =
                      message.sender === "admin";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isAdminMessage
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-md rounded-lg px-4 py-3 ${
                            isAdminMessage
                              ? "bg-connect text-foreground"
                              : "border border-border bg-surface"
                          }`}
                        >
                          <p className="text-sm leading-6">
                            {message.text}
                          </p>

                          <p className="mt-2 text-[11px] opacity-60">
                            {isAdminMessage
                              ? "You"
                              : message.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                </div>

                <form
                  onSubmit={sendReply}
                  className="flex gap-3 border-t border-border bg-surface p-4"
                >
                  <textarea
                    rows={2}
                    value={reply}
                    onChange={(event) =>
                      setReply(event.target.value)
                    }
                    placeholder="Write a reply..."
                    className="min-h-12 flex-1 resize-none rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />

                  <button
                    type="submit"
                    disabled={sendingReply || !reply.trim()}
                    className="self-end rounded-md bg-connect px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <MessageSquare className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-3 font-medium">
                    Select a conversation
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a visitor from the left.
                  </p>
                </div>
              </div>
            )}

          </div>
        </section>
      )}
      {activeSection === "reviews" && (
  <section className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold">
        Project Reviews
      </h2>

      <p className="mt-1 text-sm opacity-70">
        Generate a private review link for a specific client project.
      </p>
    </div>

    {/* Generate Link */}
    <div className="rounded-2xl border border-black/10 bg-background/50 p-6">
      <h3 className="text-lg font-semibold">
        Generate Private Review Link
      </h3>

      <p className="mt-1 text-sm opacity-65">
        Choose the project and create a unique link to send directly
        to your client.
      </p>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Project
          </label>

          <select
            value={selectedProjectTitle}
            onChange={(e) => {
              setSelectedProjectTitle(e.target.value);
              setGeneratedLink("");
              setLinkCopied(false);
            }}
            className="w-full rounded-xl border border-black/10 bg-background px-4 py-3 outline-none"
          >
            {projects.map((project) => (
              <option key={project.title} value={project.title}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={generateReviewLink}
          disabled={generatingReviewLink}
          className="rounded-xl bg-[#641F32] px-5 py-3 font-medium text-white transition disabled:opacity-50"
        >
          {generatingReviewLink
            ? "Generating..."
            : "Generate Link"}
        </button>
      </div>

      {generatedLink && (
        <div className="mt-5 rounded-xl border border-black/10 bg-background/[0.03] p-4">
          <p className="mb-2 text-sm font-medium">
            Private review link
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={generatedLink}
              readOnly
              className="min-w-0 flex-1 rounded-lg border border-black/10 bg-background px-3 py-2 text-sm"
            />

            <button
              type="button"
              onClick={copyReviewLink}
              className="rounded-lg bg-[#17100F] px-4 py-2 text-sm font-medium text-white"
            >
              {linkCopied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <p className="mt-3 text-xs opacity-60">
            Send this link only to the client of the selected project.
          </p>
        </div>
      )}
    </div>

     {/* Existing Links */}
    <div className="rounded-2xl border border-black/10 bg-background/50 p-6">
      <h3 className="text-lg font-semibold">
        Generated Links
      </h3>

      {reviewLinks.length === 0 ? (
        <p className="mt-4 text-sm opacity-60">
          No review links generated yet.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {reviewLinks.map((link) => (
            <div
              key={link.id}
              className="rounded-xl border border-black/10 bg-background p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">
                    {link.projectTitle}
                  </p>

                  <p className="mt-1 text-xs opacity-50">
                    {link.status === "awaiting_review"
                      ? "Waiting for client"
                      : link.status === "pending"
                        ? "Review submitted"
                        : link.status === "approved"
                          ? "Approved"
                          : "Rejected"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const url = `${window.location.origin}/review/${link.token}`;

                    await navigator.clipboard.writeText(url);
                    alert("Link copied!");
                  }}
                  className="rounded-lg border border-black/10 px-3 py-2 text-sm"
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Client Reviews */}
    <div className="rounded-2xl border border-black/10 bg-background/50 p-6">
      <div>
        <h3 className="text-lg font-semibold">
          Client Reviews
        </h3>

        <p className="mt-1 text-sm opacity-60">
          Review client submissions before they appear on your portfolio.
        </p>
      </div>

      {projectReviews.length === 0 ? (
        <p className="mt-5 text-sm opacity-60">
          No client reviews submitted yet.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {projectReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-black/10 bg-background p-5"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                
                {/* Client photo */}
                {review.profilePhoto ? (
                  <img
                    src={review.profilePhoto}
                    alt={review.clientName}
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#F1E9D8] text-lg font-semibold text-[#641F32]">
                    {review.clientName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold">
                        {review.clientName}
                      </p>

                      <p className="mt-1 text-xs opacity-50">
                        {review.projectTitle}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        review.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : review.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {review.status === "pending"
                        ? "Pending"
                        : review.status === "approved"
                          ? "Approved"
                          : "Rejected"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    “{review.reviewText}”
                  </p>

                  {/* Approve / Reject */}
                  {review.status === "pending" && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateReviewStatus(
                            review.id,
                            "approved"
                          )
                        }
                        className="rounded-lg bg-[#334A35] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateReviewStatus(
                            review.id,
                            "rejected"
                          )
                        }
                        className="rounded-lg bg-[#641F32] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
)}
    </main>
  );
}
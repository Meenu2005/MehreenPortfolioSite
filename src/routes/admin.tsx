
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
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type DocumentData,
  type QuerySnapshot,
  Timestamp,
} from "firebase/firestore";

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

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [activeSection, setActiveSection] = useState<
    "comments" | "ratings" | "chats"
  >("comments");

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
  }, []);

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

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

  /* ---------------- CHAT MESSAGES ---------------- */

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
    </main>
  );
}
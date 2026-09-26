
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, LockKeyhole, Send } from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { LinkButton, ActionButton } from "@/components/portfolio/Button";

// @ts-ignore -- Firebase config is shipped as JS and lacks generated typings in this project.
import { signInWithGoogle } from "@/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

// @ts-ignore -- Firebase config is shipped as JS and lacks generated typings in this project.
import { auth, db } from "@/firebase/config";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { portfolio } from "@/data/portfolio";


export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: `Let's Connect — ${portfolio.name}` },
      {
        name: "description",
        content:
          "Start a direct conversation about frontend development and project opportunities.",
      },
      {
        property: "og:title",
        content: `Let's Connect — ${portfolio.name}`,
      },
      {
        property: "og:description",
        content:
          "Start a direct conversation about a project or opportunity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConnectPage,
});

function ConnectPage() {
  const [draft, setDraft] = useState("");
  const [showGate, setShowGate] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  // Used to automatically scroll to the latest message
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let unsubscribeMessages: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // User logged out
      if (!user) {
        setMessages([]);

        if (unsubscribeMessages) {
          unsubscribeMessages();
          unsubscribeMessages = undefined;
        }

        return;
      }

      // User logged in → listen to their messages
      const messagesQuery = query(
        collection(db, "messages"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "asc")
      );

      unsubscribeMessages = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const messageList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log("Messages received:", messageList);

          setMessages(messageList);
        },
        (error) => {
          console.error("Failed to load messages:", error);
        }
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, []);

  // Automatically scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, showGate]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.trim()) return;

    try {
      let user = auth.currentUser;

      // Agar user logged in nahi hai
      if (!user) {
        setShowGate(true);

        user = await signInWithGoogle();

        setShowGate(false);
      }

      // Message Firestore mein save karo
      await addDoc(collection(db, "messages"), {
        userId: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        text: draft.trim(),
        sender: "user",
        createdAt: serverTimestamp(),
        read: false,
      });

      console.log("Message saved successfully!");

      setDraft("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setShowGate(false);
    }
  };

  return (
    <div
      className="px-5 py-8 sm:px-8 sm:py-12"
      style={{
        width: "100%",
      }}
    >
      <div className="mb-5">
        <LinkButton to="/" tone="quiet">
          <ArrowLeft className="size-4" />
          Back home
        </LinkButton>
      </div>

      <section
        className="overflow-hidden rounded-lg border border-border bg-card shadow-lift"
        style={{
          width: "100%",
        }}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="relative grid size-11 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              MR
              <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-connect" />
            </span>

            <div>
              <h1 className="font-display text-xl font-semibold">
                {portfolio.name}
              </h1>

              <p className="text-xs text-muted-foreground">
                Usually replies within a day
              </p>
            </div>
          </div>

          <span className="hidden items-center gap-2 text-xs font-semibold text-connect sm:flex">
            <span className="size-1.5 rounded-full bg-connect" />
            Available
          </span>
        </header>

        {/* Messages Area */}
        <div
          className="h-[20rem] overflow-y-auto bg-chat p-5 sm:p-8"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          {/* Initial message */}
          <div className="max-w-md rounded-lg rounded-bl-sm border border-connect/25 bg-surface/90 p-5 shadow-soft">
            <p className="font-semibold">
              Hi — thanks for stopping by.
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Share what you are working on, and this conversation will
              continue here once secure sign-in is enabled.
            </p>

            <p className="mt-3 text-right text-xs text-muted-foreground">
              Now
            </p>
          </div>

          {/* User messages */}
        {messages.map((message) => {
  const isUserMessage = message.sender === "user";

  return (
    <div
      key={message.id}
      className={`mt-4 max-w-md rounded-lg p-4 ${
        isUserMessage
          ? "ml-auto rounded-br-sm bg-connect"
          : "mr-auto rounded-bl-sm border border-connect/25 bg-surface/90"
      }`}
      style={
        isUserMessage
          ? {
              background: "#D3E1D0",
              color: "#263126",
            }
          : undefined
      }
    >
      <p className="text-sm">{message.text}</p>

      <p
        className={`mt-2 text-xs opacity-70 ${
          isUserMessage ? "text-right" : "text-left"
        }`}
      >
        {isUserMessage ? "You" : portfolio.name}
      </p>
    </div>
  );
})}

          {/* Sign-in gate */}
          {showGate && (
            <div className="mx-auto my-6 max-w-md rounded-lg border border-primary/25 bg-primary/5 p-5 text-center">
              <LockKeyhole className="mx-auto size-5 text-primary" />

              <p className="mt-3 font-semibold">
                Google sign-in comes next
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your draft is still here. Secure messaging will be connected
                in the backend milestone.
              </p>
            </div>
          )}

          {/* Invisible element used for automatic scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Message Input */}
        <form
          onSubmit={submit}
          className="flex items-end gap-3 border-t border-border bg-surface p-4 sm:p-5"
        >
          <label className="sr-only" htmlFor="message">
            Write a message
          </label>

          <textarea
            id="message"
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message…"
            className="min-h-12 flex-1 resize-none rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />

          <ActionButton
            type="submit"
            tone="connect"
            aria-label="Send message"
          >
            <Send className="size-4" />
            <span className="hidden sm:inline">Send</span>
          </ActionButton>
        </form>
      </section>
    </div>
  );
}

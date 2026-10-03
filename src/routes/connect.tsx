
import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, Send, Undo2 } from "lucide-react";
import { Linkedin, Mail } from "lucide-react";
import { FaRedditAlien } from "react-icons/fa";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { ActionButton } from "@/components/portfolio/Button";

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
import avatarIdle from "@/assets/loader/avatar-idle.png";

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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let unsubscribeMessages: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setMessages([]);

        if (unsubscribeMessages) {
          unsubscribeMessages();
          unsubscribeMessages = undefined;
        }

        return;
      }

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

      if (!user) {
        setShowGate(true);

        user = await signInWithGoogle();

        setShowGate(false);
      }

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

      setDraft("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setShowGate(false);
    }
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-[#F5EFE6]">
      {/* Social Icons */}
      <div
        className="
          fixed
          left-10
          top-1/2
          z-50
          flex
          -translate-y-1/2
          flex-col
          items-center
          gap-4
          sm:left-14
        "
        aria-label="Social links"
      >
        <a
          href="https://www.reddit.com/user/meenu-code/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-[#87917F]
            transition-colors
            hover:text-theme-text
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#E85D3F]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#101312]
          "
          aria-label="Reddit"
        >
          <FaRedditAlien size={36} />
        </a>

        <a
          href="https://www.linkedin.com/in/mehreenrao"
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-[#87917F]
            transition-colors
            hover:text-theme-text
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#E85D3F]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#101312]
          "
          aria-label="LinkedIn"
        >
          <Linkedin size={36} />
        </a>

        <a
          href="mailto:mehreenrao220117@gmail.com"
          className="
            text-[#87917F]
            transition-colors
            hover:text-theme-text
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#E85D3F]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#101312]
          "
          aria-label="Email"
        >
          <Mail size={36} />
        </a>
      </div>

      {/* Chat Header */}
      <header className="z-40 h-[76px] shrink-0 border-b border-[#334A35]/60 bg-surface-card">
        <div
          className="
            flex
            h-full
            w-full
            max-w-4xl
            items-center
            pl-10
            pr-5
            sm:pl-14
            sm:pr-7
          "
        >
          <div className="flex w-full items-center gap-3">
            {/* Back button */}
            <Link
              to="/work"
              aria-label="Back to work"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                text-theme-text
                transition-colors
                hover:text-[#E85D3F]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E85D3F]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#171B18]
              "
            >
              <Undo2 size={24} strokeWidth={2} />
            </Link>

            {/* Mehreen avatar */}
            <div className="relative shrink-0">
              <div className="grid size-11 place-items-center overflow-hidden rounded-full bg-[#641F32]">
                <img
                  src={avatarIdle}
                  alt={portfolio.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              <span
                className="
                  absolute
                  bottom-0
                  right-0
                  size-3
                  rounded-full
                  border-2
                  border-[#171B18]
                  bg-[#dc651b]
                "
                aria-label="Online"
              />
            </div>

            {/* Name + status */}
            <div className="min-w-0">
              <h1 className="text-base font-semibold leading-5 text-theme-text">
                {portfolio.name}
              </h1>

              <p className="mt-0.5 text-sm leading-5 text-[#87917F]">
                Online · Usually replies within a day
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat */}
      <section className="flex min-h-0 flex-1 justify-center">
        <div className="flex min-h-0 w-full max-w-4xl flex-col">
          {/* Messages — ONLY THIS AREA SCROLLS */}
          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-7 sm:py-8"
            style={{
              scrollbarWidth: "thin",
            }}
          >
            {/* Center conversation content */}
            <div className="mx-auto w-full max-w-[800px]">
              {/* Intro message */}
              <div className="flex items-end gap-2">
                <div className="hidden size-7 shrink-0 overflow-hidden rounded-full bg-[#641F32] sm:block">
                  <img
                    src={avatarIdle}
                    alt=""
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div className="relative max-w-[82%] sm:max-w-md">
                  <div className="text-theme-text chat-blob chat-blob-me px-5 py-3.5">
                    <p className="text-[14px] leading-6 ">
                      Hey, glad you’re here!
                    </p>

                    <p className="mt-1.5 text-[13px] leading-5 ">
                      I’m always open to talking about frontend development,
                      new projects, ideas, or simply having a good conversation.
                    </p>

                    <div className="mt-1 text-right text-[10px] text-[#9B9288]">
                      Now
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign in message */}
              {showGate && (
                <div className="my-5 flex justify-center">
                  <div className="flex max-w-sm items-center gap-3 rounded-2xl border border-[#A9485D]/50 bg-[#641F32]/20 px-4 py-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#641F32]/40">
                      <LockKeyhole className="size-4 text-[#FFB89A]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#F5EFE6]">
                        One quick sign-in
                      </p>

                      <p className="mt-0.5 text-[11px] leading-4 text-[#B8B1A8]">
                        Sign in with Google to send your message securely.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => {
                const isUserMessage = message.sender === "user";

                return (
                  <div
                    key={message.id}
                    className={`mt-4 flex ${
                      isUserMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative max-w-[82%] sm:max-w-md ${
                        isUserMessage
                          ? "chat-blob chat-blob-user px-5 py-3"
                          : "chat-blob chat-blob-me px-5 py-3"
                      }`}
                    >
                      <p
                        className={`text-[14px] leading-6 ${
                          isUserMessage
                            ? "text-chat-user-text"
                            : "text-theme-text"
                        }`}
                      >
                        {message.text}
                      </p>

                      <div
                        className={`mt-1 flex items-center gap-1.5 text-[10px] ${
                          isUserMessage
                            ? "justify-end text-chat-user-muted"
                            : "justify-start text-[#9B9288]"
                        }`}
                      >
                        <span>
                          {isUserMessage ? "You" : portfolio.name}
                        </span>

                        {isUserMessage && <span>✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message composer — ALWAYS AT BOTTOM */}
          <div className="z-30 shrink-0 border-t border-border bg-background px-4 py-4 sm:px-7">
            <form
              onSubmit={submit}
              className="
                mx-auto
                flex
                w-full
                max-w-[800px]
                items-end
                gap-2
                rounded-[22px]
                border
                border-[#536052]
                bg-[#202720]
                p-2
                shadow-[0_8px_30px_rgba(0,0,0,0.22)]
                transition-all
                focus-within:border-[#dc651b]
                focus-within:bg-[#252D25]
                focus-within:shadow-[0_8px_35px_rgba(100,31,50,0.16)]
              "
            >
              <label className="sr-only" htmlFor="message">
                Write a message
              </label>

              <textarea
                id="message"
                rows={1}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();

                    if (draft.trim()) {
                      event.currentTarget.form?.requestSubmit();
                    }
                  }
                }}
                placeholder="Write your message here..."
                className="
                  max-h-32
                  min-h-11
                  flex-1
                  resize-none
                  bg-transparent
                  px-3
                  py-2.5
                  text-sm
                  text-[#FFF9F1]
                  outline-none
                  placeholder:text-[#AAAFA6]
                "
              />

              <ActionButton
                type="submit"
                aria-label="Send message"
                className="
                  grid
                  size-11
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-[#dc651b]
                  p-0
                  text-white
                  shadow-md
                  transition-transform
                  hover:scale-105
                  hover:bg-[#C15C70]
                  active:scale-95
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E6D2B5]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#202720]
                "
              >
                <Send className="size-4" />
                <span className="sr-only">Send</span>
              </ActionButton>
            </form>

            <p className="mx-auto mt-2 max-w-[800px] text-center text-xs leading-5 text-[#727A72]">
              Messages are private and connected to your Google account.
            </p>
          </div>
        </div>
      </section>

      {/* Organic message bubble styles */}
      <style>{`
        .chat-blob {
          position: relative;
          isolation: isolate;
          border-radius: 25px 27px 24px 30px;
        }

        /* Mehreen / incoming message */
        .chat-blob-me {
          background: var(--surface-card);
          border: 1px solid var(--border);
          border-bottom-left-radius: 9px;
          box-shadow: 0 7px 22px rgba(0, 0, 0, 0.16);
        }

        /* User message */
        .chat-blob-user {
          background: var(--chat-user);
          border: 1px solid var(--chat-user-border);
          border-bottom-right-radius: 9px;
          box-shadow: 0 7px 22px rgba(0, 0, 0, 0.12);
        }

        /* More organic variations */
        .chat-blob-me:nth-child(3n) {
          border-radius: 29px 23px 28px 18px;
        }

        .chat-blob-user:nth-child(3n) {
          border-radius: 23px 30px 18px 27px;
        }

        @media (max-width: 640px) {
          .chat-blob {
            border-radius: 22px 24px 21px 26px;
          }

          .chat-blob-me {
            border-bottom-left-radius: 8px;
          }

          .chat-blob-user {
            border-bottom-right-radius: 8px;
          }
        }
      `}</style>
    </main>
  );
}


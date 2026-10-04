
import { createFileRoute, Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, LockKeyhole, Send, Undo2 } from "lucide-react";
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
    <main className="flex h-screen flex-col overflow-hidden bg-background text-theme-text">
      {/* Header / Nav */}
      <header className="z-40 h-[76px] shrink-0 border-b border-border bg-surface-card">
        <div
          className="
            mx-auto
            flex
            h-full
            w-full
            max-w-5xl
            items-center
            justify-between
            gap-4
            px-4
            sm:px-7
            lg:px-10
          "
        >
          {/* Left side */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Back button */}
            <Link
              to="/work"
              aria-label="Back to work"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                text-[#E85D3F]
                transition-colors
                hover:text-[#A9485D]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E85D3F]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              "
            >
              <Undo2 size={22} strokeWidth={2} />
            </Link>

            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="
                  grid
                  size-10
                  place-items-center
                  overflow-hidden
                  rounded-full
                  bg-[#641F32]
                  sm:size-11
                "
              >
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
                  size-2.5
                  rounded-full
                  border-2
                  border-surface-card
                  bg-[#dc651b]
                  sm:size-3
                "
                aria-label="Online"
              />
            </div>

            {/* Name + status */}
            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold leading-5 text-[#E85D3F] sm:text-base">
                {portfolio.name}
              </h1>

              <p className="truncate text-[11px] leading-5 text-[#87917F] sm:text-sm">
                Online · Usually replies within a day
              </p>
            </div>
          </div>

          {/* Social navigation */}
          <nav
            aria-label="Social links"
            className="
              flex
              shrink-0
              items-center
              gap-3
              sm:gap-4
            "
          >
            {/* GitHub */}
            <a
              href="https://github.com/Meenu2005"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="
                text-[#87917F]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:text-[#E85D3F]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E85D3F]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              "
            >
              <Github className="size-5 sm:size-[22px]" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/mehreenrao"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="
                text-[#87917F]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:text-[#E85D3F]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E85D3F]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              "
            >
              <Linkedin className="size-5 sm:size-[22px]" />
            </a>

            {/* Email */}
            <a
              href="mailto:mehreenrao220117@gmail.com"
              aria-label="Email"
              className="
                text-[#87917F]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:text-[#E85D3F]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E85D3F]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              "
            >
              <Mail className="size-5 sm:size-[22px]" />
            </a>
          </nav>
        </div>
      </header>

      {/* Chat */}
      <section className="relative flex min-h-0 flex-1 justify-center overflow-hidden">
        {/* WhatsApp-style subtle doodle background */}
        <div className="chat-doodle-bg" aria-hidden="true" />

        <div className="relative z-10 flex min-h-0 w-full max-w-5xl flex-col">
          {/* Messages — ONLY THIS AREA SCROLLS */}
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-4
              py-5
              sm:px-7
              sm:py-8
              lg:px-10
            "
            style={{
              scrollbarWidth: "thin",
            }}
          >
            <div className="mx-auto w-full max-w-[800px]">
              {/* Intro message */}
              <div className="flex items-end gap-2">
                {/* Avatar on desktop/tablet */}
                <div
                  className="
                    hidden
                    size-7
                    shrink-0
                    overflow-hidden
                    rounded-full
                    bg-[#641F32]
                    sm:block
                  "
                >
                  <img
                    src={avatarIdle}
                    alt=""
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div className="relative max-w-[88%] sm:max-w-md">
                  <div className="chat-blob chat-blob-me px-4 py-3 sm:px-5 sm:py-3.5">
                    <p className="text-[14px] leading-6 text-[var(--chat-me-text)]">
                      Hey, glad you’re here!
                    </p>

                    <p className="mt-1.5 text-[13px] leading-5 text-[var(--chat-me-text)]">
                      I’m always open to talking about frontend development,
                      new projects, ideas, or simply having a good conversation.
                    </p>

                    <div className="mt-1 text-right text-[10px] text-chat-user-muted">
                      Now
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign in message */}
              {showGate && (
                <div className="my-5 flex justify-center px-2">
                  <div
                    className="
                      flex
                      max-w-sm
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-[#A9485D]/50
                      bg-[#641F32]/20
                      px-4
                      py-3
                    "
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#641F32]/40">
                      <LockKeyhole className="size-4 text-[#FFB89A]" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-theme-text">
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
                      className={`
                        relative
                        max-w-[88%]
                        sm:max-w-md
                        ${
                          isUserMessage
                            ? "chat-blob chat-blob-user px-4 py-3 sm:px-5"
                            : "chat-blob chat-blob-me px-4 py-3 sm:px-5"
                        }
                      `}
                    >
<div
                        className={`
                          mt-1
                          flex
                          items-center
                          gap-1.5
                          text-[10px]
                          ${
                            isUserMessage
                              ? "justify-end text-white/70"
                              : "justify-start text-chat-user-muted"
                          }
                        `}
                      >
                       

                       
                     
                       <span>
                          {isUserMessage ? "You" : portfolio.name}
                        </span>
                         </div>
                      <p
                        className={`
                          text-[14px]
                          leading-6
                          ${
                           isUserMessage
  ? "text-white"
  : "text-[var(--chat-me-text)]"
                          }
                        `}
                      >
                        {message.text}
                      </p>

                      
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Composer */}
          <div
            className="
              z-30
              shrink-0
              border-t
              border-border
              bg-background
              px-4
              py-3
              sm:px-7
              sm:py-4
              lg:px-10
            "
          >
            <form
              onSubmit={submit}
              className="
                mx-auto
                flex
                w-full
                max-w-[800px]
                items-end
                gap-2
                rounded-[20px]
                border
                border-border
                bg-surface-input
                p-2
                shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                transition-all
                focus-within:border-[#E85D3F]
                focus-within:shadow-[0_8px_35px_rgba(232,93,63,0.12)]
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
                  min-w-0
                  flex-1
                  resize-none
                  bg-transparent
                  px-3
                  py-2.5
                  text-sm
                  text-theme-text
                  outline-none
                  placeholder:text-[#87917F]
                "
              />

              <ActionButton
                type="submit"
                aria-label="Send message"
                className="
                  grid
                  size-10
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-[#E85D3F]
                  p-0
                  text-white
                  shadow-md
                  transition-transform
                  hover:scale-105
                  hover:bg-[#C95038]
                  active:scale-95
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E6D2B5]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-surface-input
                  sm:size-11
                "
              >
                <Send className="size-4" />
                <span className="sr-only">Send</span>
              </ActionButton>
            </form>

            <p className="mx-auto mt-2 max-w-[800px] text-center text-[10px] leading-5 text-[#727A72] sm:text-xs">
              Messages are private and connected to your Google account.
            </p>
          </div>
        </div>
      </section>

      {/* Organic chat bubbles */}
      <style>{`
        /* WhatsApp-style subtle doodle background */
        .chat-doodle-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  background-color: var(--background);
  background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23E85D3F' stroke-width='1.5' opacity='.36'%3E%3Cpath d='M22 24h12v8H22z'/%3E%3Cpath d='M25 27l6 0M25 30l4 0'/%3E%3Cpath d='M72 18l3 7 7 3-7 3-3 7-3-7-7-3 7-3z'/%3E%3Ccircle cx='135' cy='27' r='8'/%3E%3Cpath d='M130 27h10M135 22v10'/%3E%3Cpath d='M42 72l6-6 6 6-6 6z'/%3E%3Cpath d='M18 108c5-7 12-7 17 0-5 7-12 7-17 0z'/%3E%3Cpath d='M85 67l8 8m0-8-8 8'/%3E%3Cpath d='M122 72h15M129 65v15'/%3E%3Cpath d='M148 105c0-6 5-10 10-10s10 4 10 10c0 5-4 9-10 9s-10-4-10-9z'/%3E%3Cpath d='M31 145l5-8 5 8-5 8z'/%3E%3Cpath d='M77 126l10 0-5 9z'/%3E%3Cpath d='M105 143c4-4 9-4 13 0-4 4-9 4-13 0z'/%3E%3Cpath d='M143 145l7-7 7 7-7 7z'/%3E%3Cpath d='M55 105l4-4 4 4-4 4z'/%3E%3C/g%3E%3Cg fill='%23E85D3F' opacity='.15'%3E%3Ccircle cx='16' cy='52' r='2'/%3E%3Ccircle cx='62' cy='38' r='2'/%3E%3Ccircle cx='112' cy='48' r='2'/%3E%3Ccircle cx='160' cy='70' r='2'/%3E%3Ccircle cx='70' cy='94' r='2'/%3E%3Ccircle cx='25' cy='135' r='2'/%3E%3Ccircle cx='120' cy='118' r='2'/%3E%3Ccircle cx='165' cy='155' r='2'/%3E%3C/g%3E%3C/svg%3E");

  background-repeat: repeat;
  background-size: 100px 100px;
}

        @media (prefers-reduced-motion: reduce) {
          .chat-doodle-bg {
            background-attachment: initial;
          }
        }

        .chat-blob {
          position: relative;
          isolation: isolate;
          border-radius: 24px 24px 24px 24px;
        }

        /* My / Mehreen message */
        .chat-blob-me {
        
   background: var(--chat-me);
  border: 1px solid var(--chat-me-border);
 
  box-shadow: 0 7px 22px rgba(0, 0, 0, 0.12);
        }

        /* Visitor message */
        .chat-blob-user {
          background: #E85D3F;
          border: 1px solid #E85D3F;
         
          box-shadow: 0 7px 22px rgba(0, 0, 0, 0.14);
        }

        .chat-blob-me:nth-child(3n) {
           border-radius: 24px 24px 24px 24px;
        }

        .chat-blob-user:nth-child(3n) {
          border-radius: 24px 24px 24px 24px;
        }

        @media (max-width: 640px) {
          .chat-blob {
            border-radius: 21px 23px 20px 25px;
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

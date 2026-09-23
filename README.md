# MehreenPortfolio

I want you to build my personal portfolio website in React.js using the attached HTML prototype as the main visual and structural reference.

IMPORTANT:

The attached HTML is a hand-designed prototype. Do NOT simply copy the HTML into React. Use it to understand the layout, page structure, wording, button placement, sections, and overall concept, then rebuild it properly as a clean, responsive React application.

TECH STACK:

- React.js

- Vite

- JavaScript or TypeScript

- CSS / Tailwind CSS

- Firebase Authentication

- Firebase Firestore

- Firebase Storage if needed

- Firebase Cloud Functions if needed for email notifications

- Use reusable React components

- Keep the code clean and easy to maintain

==================================================

1. DESIGN DIRECTION

==================================================

The website should feel:

- Modern

- Premium

- Creative

- Personal

- Slightly futuristic / "2050"

- Minimal but visually interesting

- Professional enough for recruiters and clients

- NOT overly cyberpunk

- NOT overloaded with neon effects

- NOT like a generic AI-generated portfolio

Use the attached HTML prototype as the primary reference for the layout.

Preserve the important visual ideas from the prototype:

- Main portfolio/home page

- Profile/photo area

- About Me section

- Work/projects section

- Rating section

- Comments section

- Let's Connect section

- Messaging/chat concept

- Navigation and button positioning

- Overall hand-drawn prototype's information hierarchy

You can improve spacing, typography, responsiveness, animations and visual polish, but do not completely redesign the concept.

==================================================

2. COLOR SYSTEM

==================================================

I want a sophisticated mixed color palette.

Do NOT use every color everywhere.

Use the colors strategically depending on the purpose of the element.

Primary palette:

Espresso:

#17100F

Burgundy:

#641F32

Dusty Wine:

#A9485D

Champagne:

#E6D2B5

Warm White:

#F5EFE6

Graphite:

#0C1117

Arctic Blue:

#A9D8FF

Soft Peach:

#FFB89A

Frost:

#EAF6FF

Slate:

#28323C

Almost Black:

#101711

Dark Moss:

#334A35

Cream:

#F1E9D8

Vermilion:

#E85D3F

Sage Gray:

#87917F

Also use these interaction colors:

RED

BLUE

GREEN

CREAM

The overall design should NOT look like a rainbow.

Use a mostly neutral foundation such as:

- Espresso

- Graphite

- Almost Black

- Warm White

- Cream

- Champagne

Then introduce accent colors selectively.

Suggested interaction language:

RED / VERMILION:

Comments, notifications, important actions

BLUE / ARCTIC BLUE:

Post, project actions, links, secondary interactive elements

GREEN / DARK MOSS:

Let's Connect, messaging, availability, positive states

CREAM / CHAMPAGNE:

Cards, highlights, soft backgrounds

BURGUNDY / DUSTY WINE:

Brand accents, headings, selected states

SOFT PEACH:

Small decorative highlights

SAGE GRAY:

Secondary text and subtle UI

Do not make every button a different random color.

The colors should feel like one coherent design system.

==================================================

3. FUTURISTIC VISUAL STYLE

==================================================

Give the website a subtle futuristic 2050 feeling.

Use:

- Smooth transitions

- Subtle gradients

- Soft glow

- Glass-like cards where appropriate

- Fine borders

- Large modern typography

- Micro-interactions

- Hover effects

- Smooth scrolling

- Slight image movement/parallax where appropriate

- Animated project cards

- Modern navigation

- Subtle background patterns/grid

- Elegant cursor interactions if they improve UX

Do NOT overuse:

- Neon

- Huge shadows

- Excessive blur

- Excessive animations

- Cyberpunk styling

- Random gradients

The result should feel like a premium modern designer/developer portfolio.

==================================================

4. PROFILE / HERO

==================================================

Use the profile image included in the provided prototype/reference.

Create a strong hero section around the profile image.

Keep the concept from the prototype:

"My picture" / profile area

and the main portfolio introduction.

Make the profile image look polished:

- Rounded or carefully shaped container

- Subtle border

- Soft shadow/glow

- Responsive

- Professional

Do not distort the image.

==================================================

5. ABOUT ME

==================================================

Create an About Me section based on the structure shown in the prototype.

Include:

- Short introduction

- Skills

- Education / learning

- Work experience

- Relevant client work

- Technologies

Keep the text easy to scan.

Do not fill the website with unnecessary paragraphs.

==================================================

6. PROJECTS / WORK

==================================================

Create a modern projects section.

The prototype contains the concept of showing work/projects.

Make projects reusable through data instead of hardcoding every card.

Example structure:

projects = [

  {

    title: "...",

    description: "...",

    image: "...",

    technologies: [...],

    liveUrl: "...",

    githubUrl: "...",

    category: "..."

  }

]

Create beautiful project cards.

Each card should have:

- Project preview/image

- Project title

- Short description

- Technologies

- View Project button

- Optional GitHub button

- Hover interaction

Use different subtle accent colors for project cards while keeping the overall palette consistent.

Do not invent fake projects or fake client information.

Create placeholder data where information is not provided.

Make it easy for me to add new projects later.

==================================================

7. RATING SYSTEM

==================================================

I want visitors to be able to rate my portfolio/work.

IMPORTANT:

The rating/comment functionality should require authentication.

The user does NOT need to see a Google login immediately when opening the website.

Instead:

User opens website

↓

Browses normally

↓

User clicks Rating OR Comment OR Let's Connect

↓

Check Firebase authentication

↓

If user is NOT authenticated:

show "Continue with Google"

↓

Google authentication

↓

Continue with the action they originally selected

After the user has authenticated once, do NOT ask them to log in again for the other features.

Example:

User clicks Rating

→ Google login

→ Rating opens

Later:

User clicks Comment

→ directly opens comment system

Later:

User clicks Let's Connect

→ directly opens chat

No repeated Google login.

==================================================

8. GOOGLE AUTHENTICATION

==================================================

Use Firebase Authentication with Google Sign-In.

After successful authentication, obtain the authenticated user's:

- Firebase UID

- Name

- Email

- Profile photo if available

Do NOT store passwords.

Create a reusable authentication context/hook.

Example:

AuthContext

useAuth()

ProtectedAction component

The authentication system should be reusable for:

- Rating

- Comments

- Messaging

==================================================

9. COMMENTS

==================================================

Create a comments section.

A visitor can:

- View comments

- Write a comment

- Submit a comment

If unauthenticated:

→ show Google authentication

→ after successful login continue to the comment box

Store comments in Firestore.

Suggested structure:

comments

  commentId

    userId

    name

    email

    photoURL

    text

    createdAt

Show:

- User profile image

- User name

- Comment

- Date/time

Use Firestore security rules so users cannot modify other users' comments.

==================================================

10. RATING

==================================================

Create a 1–5 star rating system.

If user is not authenticated:

→ Google login

→ return to rating

Store:

ratings

  ratingId

    userId

    name

    rating

    createdAt

Prevent the same authenticated user from submitting unlimited ratings.

Show:

- Average rating

- Number of ratings

- Individual ratings if appropriate

Use yellow/champagne tones for stars.

==================================================

11. LET'S CONNECT / MESSAGING

==================================================

This is an important feature.

I do NOT want a traditional contact form.

"Let's Connect" should open a real messaging/chat interface.

Flow:

User clicks "Let's Connect"

↓

Check authentication

↓

If not logged in:

Continue with Google

↓

After authentication:

open chat

↓

User sends message

↓

Message saved to Firestore

↓

I can reply from an admin interface

Create a real-time 1-to-1 messaging system.

Suggested Firestore structure:

conversations

  conversationId

    userId

    createdAt

    updatedAt

    lastMessage

messages

  messageId

    conversationId

    senderId

    text

    createdAt

    read

Use Firestore real-time listeners so new messages appear without refreshing.

==================================================

12. ADMIN CHAT

==================================================

Create an admin/inbox interface for me.

I should be able to:

- See conversations

- See user name/email

- See latest message

- Open a conversation

- Reply

- See unread messages

- Mark messages as read

Protect the admin area.

Do not expose admin functionality to normal users.

Use Firebase security rules properly.

==================================================

13. EMAIL NOTIFICATION

==================================================

When I reply to a user's message, send an email notification to the authenticated user's email.

Example:

Subject:

"You have a new reply"

Email:

Hi [Name],

You have a new reply to your message.

[View Conversation]

The "View Conversation" button should take the user back to my portfolio website and open their conversation/chat.

Do NOT send email directly from the React frontend using private credentials.

Use a secure backend/serverless function such as Firebase Cloud Functions and an email provider.

Keep all private API keys and credentials server-side.

==================================================

14. RESPONSIVE DESIGN

==================================================

The website must work beautifully on:

- Desktop

- Laptop

- Tablet

- Mobile

The prototype is only a visual reference, so improve responsiveness where necessary.

On mobile:

- Navigation should be clean

- Project cards should stack properly

- Chat should feel like a real mobile chat

- Buttons should remain easy to tap

- Profile image should resize correctly

==================================================

15. ANIMATIONS

==================================================

Use tasteful animations.

Examples:

- Page/section reveal

- Fade + slight movement

- Project card hover

- Button hover

- Image hover

- Smooth scrolling

- Chat message appearance

- Rating interaction

- Subtle background movement

Animations should feel premium, not distracting.

Respect prefers-reduced-motion.

==================================================

16. CODE ARCHITECTURE

==================================================

Use reusable components.

Suggested structure:

src/

  components/

    Navbar/

    Hero/

    About/

    Projects/

    ProjectCard/

    Rating/

    Comments/

    Connect/

    Chat/

    Footer/

  pages/

    Home/

    Admin/

    Chat/

  context/

    AuthContext/

  firebase/

    config.js

    auth.js

    firestore.js

  hooks/

    useAuth.js

    useChat.js

  data/

    projects.js

  styles/

Keep Firebase logic separate from UI components.

Do not put the entire application inside App.jsx.

==================================================

17. IMPORTANT DEVELOPMENT RULES

==================================================

1. First analyze the attached HTML prototype.

2. Recreate the prototype in React.

3. Make sure the basic UI works before adding Firebase.

4. Do not remove important sections from the prototype.

5. Do not invent personal information.

6. Keep project information data-driven.

7. Keep authentication reusable.

8. Keep Firestore operations separate from UI.

9. Use secure Firebase rules.

10. Never expose private API keys.

11. Do not create fake reviews/messages.

12. Make the website responsive.

13. Keep the code understandable for a developer who is still learning React.

14. Do not unnecessarily install dozens of packages.

15. Do not change the main concept of the attached prototype.

==================================================

18. DEVELOPMENT ORDER

==================================================

Build in this order:

PHASE 1:

Prototype → React/Vite

PHASE 2:

Colors + typography + responsive design

PHASE 3:

Projects section + project data structure

PHASE 4:

Animations and visual polish

PHASE 5:

Firebase Authentication + Google Sign-In

PHASE 6:

Rating

PHASE 7:

Comments

PHASE 8:

Real-time Let's Connect chat

PHASE 9:

Admin inbox

PHASE 10:

Email notifications

PHASE 11:

Firebase security rules

PHASE 12:

Final responsive testing and deployment preparation

Do not skip directly to the backend before the frontend prototype is working.

Start by inspecting the attached HTML prototype and then create the React/Vite project.
==================================================

12. OWNER / ADMIN DASHBOARD

==================================================

I also want a completely separate private Owner/Admin Dashboard for myself.

This dashboard must NOT be visible or accessible to normal portfolio visitors.

The purpose of the dashboard is to manage all user interactions from one place.

ADMIN LOGIN:

- Create a protected admin route such as /admin

- Only my specific Firebase UID should be allowed to access the admin dashboard

- Do NOT rely only on hiding the URL

- Protect the admin route with Firebase Authentication and Firestore Security Rules

- Normal users must never be able to access admin data

ADMIN DASHBOARD SHOULD INCLUDE:

1. MESSAGE INBOX

Show all users who have contacted me.

Each conversation row should show:

- User profile photo

- User name

- Email

- Last message

- Last message time

- Unread message indicator

Example:

-----------------------------------------

👤 User Name

   "I wanted to ask about a website..."

   2 min ago                         ●

-----------------------------------------

Clicking a conversation opens the complete chat.

--------------------------------------------------

2. CHAT / REPLY SCREEN

When I open a conversation, show:

- User profile

- User name

- User email

- Full message history

- Message timestamps

- Read/unread status

- Reply input

- Send button

Example:

User:

"Hi, I want to discuss a website project."

Me:

"Sure! Tell me a little more about the project."

The conversation should update in real time using Firestore.

--------------------------------------------------

3. UNREAD MESSAGES

Show:

- Total unread messages

- Unread conversations

- Visual notification badge

Example:

Messages  ● 3

When I open/read a conversation, mark the appropriate messages as read.

--------------------------------------------------

4. DASHBOARD OVERVIEW

Create a simple dashboard home with useful statistics:

Messages

[ 12 ]

Unread

[ 3 ]

Comments

[ 24 ]

Ratings

[ 18 ]

Average Rating

[ 4.8 ★ ]

Keep this clean and minimal.

Do NOT make it look like a generic business admin template.

The dashboard should visually match the main portfolio design.

--------------------------------------------------

5. COMMENTS MANAGEMENT

Create an admin section where I can see comments submitted by visitors.

Show:

- User profile image

- Name

- Email

- Comment

- Date/time

Allow me to delete inappropriate comments.

Normal users must not be able to delete other users' comments.

--------------------------------------------------

6. RATINGS MANAGEMENT

Create an admin section where I can see:

- Overall average rating

- Total ratings

- Individual ratings

- User name

- Rating

- Date

Use the same yellow/champagne rating style.

--------------------------------------------------

7. CONVERSATION SEARCH

Allow me to search conversations by:

- Name

- Email

- Message text

--------------------------------------------------

8. ADMIN NAVIGATION

Create a private admin sidebar/navigation:

Dashboard

Messages

Comments

Ratings

Projects

Settings

Logout

The main portfolio should have its own completely separate public navigation.

--------------------------------------------------

9. ADMIN RESPONSIVENESS

The dashboard must also work on mobile.

On mobile:

- Sidebar can become a drawer

- Conversations can become a list

- Chat can open full-screen

- Reply box should remain fixed at the bottom

==================================================

13. ADMIN SECURITY

==================================================

This is extremely important.

The Admin Dashboard contains private user information.

Use Firebase Security Rules.

Only my Firebase authenticated UID should be allowed to read/write admin data.

Do NOT use:

if (user.email === "...")

as the only security mechanism.

The actual Firebase Security Rules must enforce the authorization.

Store my admin UID in a secure configuration/environment variable where appropriate, and design the Firestore rules so normal users cannot access:

- Other users' conversations

- Admin dashboard data

- Other users' private information

- Other users' messages

Users should only be able to access their own conversation.

==================================================

14. EMAIL NOTIFICATIONS

==================================================

When I reply to a user's message from the Admin Dashboard:

1. Save my reply to Firestore.

2. Trigger a secure server-side Cloud Function.

3. Send an email notification to the user's authenticated email.

4. Include a "View Conversation" button.

5. The button should open my portfolio website.

6. If the user is already authenticated, open their conversation directly.

7. If their authentication session has expired, ask them to sign in with Google and then return them to their conversation.

Do NOT expose email-service private keys in the React frontend.

==================================================

15. OWNER EXPERIENCE

==================================================

The workflow for me should be:

Visitor:

Portfolio

↓

Let's Connect

↓

Google Sign-In

↓

Chat

↓

Visitor sends message

↓

Firestore

↓

My Admin Dashboard

↓

New message notification

↓

I open conversation

↓

I reply

↓

Firestore updates in real time

↓

Email notification sent to visitor

↓

Visitor clicks "View Conversation"

↓

Portfolio chat opens

↓

Conversation continues

The entire experience should feel like a small professional messaging platform rather than a simple contact form.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2ebad886-09d9-46cb-8dca-9f3ac21ce438).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

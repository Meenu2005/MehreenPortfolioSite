import zayvoHero from "@/assets/caseStudy/zayvomedia/hero.png";
import zayvoshowreel from "@/assets/caseStudy/zayvomedia/showreel.png";
import zayvotestimonial from "@/assets/caseStudy/zayvomedia/testimonial.png";
import zayvoconnect from "@/assets/caseStudy/zayvomedia/connect.png";
import zayvowork from "@/assets/caseStudy/zayvomedia/work.png";
import zayvoservice from "@/assets/caseStudy/zayvomedia/service.png";
import forumhero from "@/assets/caseStudy/forumotion/forumhero.png";
import code from "@/assets/caseStudy/forumotion/code.png";
import category from "@/assets/caseStudy/forumotion/category.png";
import footer from "@/assets/caseStudy/forumotion/footer.png";
import softrohero from "@/assets/caseStudy/softro/hero.png";
import softrotrust from "@/assets/caseStudy/softro/trust.png";
import softroservices from "@/assets/caseStudy/softro/services.png";
import database from "@/assets/caseStudy/findit/database.png";
import login from "@/assets/caseStudy/findit/login.png";
import post from "@/assets/caseStudy/findit/post.png";
import profile from "@/assets/caseStudy/findit/profile.png";
import posting from "@/assets/caseStudy/findit/posts.png";
import { profileEnd } from "console";
export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  intro: string;

  overview: {
    client: string;
    type: string;
    role: string;
    technologies: string[];
  };

  challenge: string;
  approach: string;

  keyPoints: {
    title: string;
    description: string;
    image?: string;
  }[];

  result: string;

  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];

  liveUrl?: string;
  githubUrl?: string;
};


export const caseStudies: CaseStudy[] = [
  {
    slug: "zayvo-media",
    title: "Zayvo Media",
    category: "Client Work",
    intro:
      "A premium website built for a short-form video editing agency to showcase its work, communicate its brand identity, and build trust with potential clients.",

    overview: {
      client: "Zayvo Media",
      type: "Client Website",
      role: "Frontend Developer",
      technologies: [
        "HTML",
        "CSS",
        "TypeScript",
        "Netlify",
      ],
    },

    challenge:
      "Zayvo Media needed a website for its video editing agency where potential clients could explore its work and feel confident in the brand. The website also needed a distinct visual identity with custom colors and trustworthy messaging. During development, the amount of video content created a performance challenge because loading multiple full videos at once could make the page slower.",

    approach:
      "I translated the client's requirements into a dark, distinctive visual experience focused on showcasing video work while keeping the interface clean and trustworthy. I worked iteratively with the client, sharing progress throughout development and refining the design and implementation based on feedback.",

    keyPoints: [
      {
        title: "Hero Carousel",
        description:
          "I built the hero section around a carousel experience so the agency could immediately introduce its visual identity and showcase its work.",
        image: zayvoHero,
      },
      {
        title: "Video Performance",
        description:
          "To avoid loading multiple full videos during the initial page load, I implemented lightweight 5-second previews. The selected full video loads only when the visitor clicks on it.",
        image: zayvoshowreel,
      },
      {
        title: "Testimonials",
        description:
          "I implemented the testimonial section according to the client's provided design direction and integrated it into the overall visual language of the website.",
        image: zayvotestimonial,
      },
      {
        title: "Client Connection",
        description:
          "I built the client connection section to provide visitors with a clear way to get in touch with the agency.",
        image: zayvoconnect,
      },
    ],

    result:
      "The completed website was deployed to Netlify and connected to the client's custom domain, giving Zayvo Media a live platform to present its work and connect with potential clients.",

    images: [
      {
        src: zayvoHero,
        alt: "Zayvo Media website hero section",
        caption: "Hero and brand introduction",
      },
      {
        src: zayvowork,
        alt: "Zayvo Media showreel section",
        caption: "client work",
      },
      {
        src: zayvoservice,
        alt: "Zayvo Media testimonials section",
        caption: "Client service",
      },

    ],

    liveUrl: "https://zayvomedia.com",
  },


  {
    slug: "forumotion-ashen-isles",
    title: "Empire Of Ashes",
    category: "Client Work",
    intro:
      "A custom forum theme designed and developed for a roleplay community using the Forumotion platform, with a dark and atmospheric visual direction.",

    overview: {
      client: "Empire Of Ashes",
      type: "Forum Theme",
      role: "Frontend / Forum Theme Developer",
      technologies: [
        "HTML",
        "CSS",
        "Forumotion",
        "PHPBB",
      ],
    },

    challenge:
      "The client wanted a complete custom forum experience rather than a standard forum appearance. The project also needed to work within the existing Forumotion platform and its structure while creating a dark, muted, and grim atmosphere suited to the roleplay universe.",

    approach:
      "I first understood the Forumotion platform and its existing structure, then developed and maintained the visual theme through HTML and CSS. The client provided the general creative direction while giving me room to shape the final interface.",

    keyPoints: [
      {
        title: "Custom Visual Direction",
        description:
          "I translated the client's broad dark and muted visual requirements into a cohesive forum interface while handling the creative direction of the theme.",
        image: forumhero,
      },

      {
        title: "HTML & CSS Customization",
        description:
          "I handled the frontend customization through HTML and CSS while maintaining the existing platform functionality.",
        image: code,
      },
    ],

    result:
      "The final result was a fully customized Forumotion roleplay forum with a distinctive dark visual identity built around the project's fictional world.",

    images: [
      {
        src: category,
        alt: "Ashen Isles forum category",
        caption: "Custom forum categories",
      },

      {
        src: footer,
        alt: "Ashen Isles forum interface",
        caption: "Custom forum interface",
      },
    ],

    liveUrl: "https://ashenislesrp.ahlamontada.com/",
  },


  {
    slug: "softro-solutions",
    title: "Softro Solutions",
    category: "Client Work",
    intro:
      "A professional business website for a company providing online development and design services, focused on communicating trust, credibility, and a clear brand identity.",

    overview: {
      client: "Softro Solutions",
      type: "Business Website",
      role: "Frontend Developer",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "Netlify",
      ],
    },

    challenge:
      "Softro Solutions already had its own visual direction and wanted that identity translated into a polished website. The website needed to communicate trust through its messaging, numbers, client reviews, and overall presentation.",

    approach:
      "I translated the existing brand direction into the website's interface while focusing on a clear and trustworthy presentation. I implemented the website sections, visual hierarchy, and client-focused content while keeping the experience responsive and suitable for the company's online services.",

    keyPoints: [
      {
        title: "Brand Translation",
        description:
          "I translated the company's existing visual direction into a consistent web interface while maintaining its overall identity.",
        image: softrohero,
      },
      {
        title: "Trust-Focused Sections",
        description:
          "The website uses clear messaging, business statistics, and client reviews to communicate credibility and build confidence with visitors.",
        image: softrotrust,
      },

    ],

    result:
      "The completed website provided Softro Solutions with a polished online presence for presenting its development and design services, and was deployed for the client.",

    images: [
      {
        src: softroservices,
        alt: "Softro Solutions website services section",
        caption: "Website services and brand presentation",
      },
      {
        src: softrotrust,
        alt: "Softro Solutions trust section",
        caption: "Trust and business statistics",
      },

    ],

    liveUrl: "https://softrosolutions.com",
  },


  {
    slug: "findit",
    title: "FindIt",
    category: "Full-Stack Project",
    intro:
      "A full-stack campus lost-and-found application designed to help students report lost or found items and connect them with the relevant information.",

    overview: {
      client: "Personal Project",
      type: "Full-Stack Application",
      role: "Full-Stack Developer",
      technologies: [
        "React",
        "Node.js",
        "Express",
        "PostgreSQL",
        "Neon",
      ],
    },

    challenge:
      "I wanted to build a practical application around a specific campus problem: students often need a simple way to report lost or found items and keep track of relevant information. The application also needed persistent user and post data rather than relying on temporary frontend state.",

    approach:
      "I designed and implemented the application as a full-stack project, connecting the frontend to a PostgreSQL database and building the main authentication, profile, and lost-and-found posting flows.",

    keyPoints: [
      {
        title: "Authentication",
        description:
          "The application includes a login system using email, roll number, and password, with user information stored and matched during authentication.",
        image: login,
      },
      {
        title: "Lost & Found Posts",
        description:
          "Users can create and manage lost or found posts while storing information about what was posted, who posted it, when it was posted, and its category.",
        image: post,
      },
      {
        title: "User Profiles",
        description:
          "Profiles store information such as user ID, name, roll number, department, and number of posts, with profile editing functionality.",
        image: profile,
      },
      {
        title: "PostgreSQL Database",
        description:
          "I used PostgreSQL through Neon to persist user and post data and connect records to the users who created them.",
        image: database,
      },
    ],

    result:
      "The result is a working full-stack application that demonstrates authentication, persistent relational data, user profiles, and a complete lost-and-found posting flow.",

    images: [

      {
        src: posting,
        alt: "FindIt lost and found posts",
        caption: "Lost and found posts",
      },


    ],

    githubUrl:
      "https://github.com/Meenu2005/FindIt",
  },
];


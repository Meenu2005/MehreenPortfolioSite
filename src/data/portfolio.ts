export type Project = {
  title: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  accent: "blue" | "wine" | "moss";
  link: string;
  logo?: string;
};
import zayvoLogo from "@/assets/zayvo.png";
import softro from "@/assets/softro.png";
import findit from "@/assets/findit.png";
import forum from "@/assets/forum.png";
export const portfolio = {
  name: "Mehreen Rao",
  role: "Make your work look as good online as it does in real life.",
  specialty: " experience in React",
  intro:
    "Websites for agencies, creators, brands, and businesses, designed and developed around your work, your audience, and your goals.",
  availability: "Available for selected projects",
  education: "BCS - SSUET",
  skills: ["React", "TypeScript", "Responsive UI", "Accessible Design "],
  experience: [
    "Freelance Frontend Developer — 2+ years",
    "Built custom websites for agencies, brands, and businesses",
    "Handled development, responsive UI, forms, integrations, and deployment",
  ],
  clientWork: "Zayvo Media, Short form video editing agency",
  technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
};

export const projects: [Project, ...Project[]] = [
  {
    title: "Zayvo Media",
    category: "Client work",
    logo: zayvoLogo,
    description:
      "A premium website built for a short-form video editing agency to showcase its work, services, and brand.",
    problem:
      "Zayvo needed a professional digital presence that could communicate its services clearly while matching its premium, modern brand identity.",
    solution:
      "Designed and developed a responsive website with custom layouts, interactive sections, video showcases, animations, and a production deployment with custom domain and SSL.",
    technologies: ["HTML", "CSS", "TypeScript", "Netlify"],
    accent: "blue",
    link: "https://zayvomedia.com",
  },

  {
    title: "Softro Solutions",
    category: "Client work",
    logo: softro,
    description:
      "A complete business website designed and developed from the initial structure through production.",
    problem:
      "The business needed a professional online presence that clearly presented its services and worked smoothly across desktop and mobile.",
    solution:
      "Built the website from UX structure to deployment with responsive layouts, custom interactions, contact integration, and cross-device optimization.",
    technologies: ["HTML", "CSS", "JavaScript", "Netlify"],
    accent: "wine",
    link: "https://softrosolutions.com",
  },

  {
    title: "Forumotion Community Platform",
    category: "Client work",
    logo: forum,
    description:
      "A customized community forum experience built around the client's requirements and visual direction.",
    problem:
      "The client needed a more customized forum experience with a distinct visual identity, responsive layouts, and easier navigation.",
    solution:
      "Customized the platform with tailored CSS, responsive layouts, navigation improvements, and iterative design updates based on client feedback.",
    technologies: ["HTML", "CSS", "JavaScript", "Forumotion"],
    accent: "moss",
    link: "https://ashenislesrp.ahlamontada.com/",
  },

  {
    title: "FindIt",
    category: "Full-stack project",
    logo: findit,
    description:
      "A full-stack lost and found platform for posting, discovering, and managing lost or found items.",
    problem:
      "Users needed a simple way to publish lost or found items, search listings, and manage their posts.",
    solution:
      "Built a React frontend with an Express REST API, PostgreSQL database, authentication, protected routes, filtering, and image uploads.",
    technologies: ["React", "Node.js", "Express", "PostgreSQL"],
    accent: "blue",
    link: "https://www.linkedin.com/posts/mehreenrao_react-reactjs-nodejs-activity-7487411766977806336-Wwtn?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE5KlEABxqO13meJeDSUTOdWs21rcm0UPCE",
  },
];
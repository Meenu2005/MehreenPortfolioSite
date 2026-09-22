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
};

export const portfolio = {
  name: "YOUR NAME",
  role: "Frontend Developer",
  specialty: "with experience in React",
  intro:
    "Add a concise introduction about the interfaces you build, the people you help, and what makes your approach distinct.",
  availability: "Available for selected projects",
  education: "Add your education or current learning path",
  skills: ["React", "TypeScript", "Responsive UI", "Accessible Design"],
  experience: [
    "Add your current or most recent role",
    "Add a meaningful freelance or client engagement",
    "Add a result you are proud of",
  ],
  clientWork: "Add the kind of client work you take on",
  technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
};

export const projects: [Project, ...Project[]] = [
  {
    title: "Project title",
    category: "Featured project",
    description: "Add a short, outcome-focused summary of this project.",
    problem: "Describe the real problem this project addressed.",
    solution: "Explain your approach and the result without inventing metrics.",
    technologies: ["React", "TypeScript", "CSS"],
    accent: "blue",
  },
  {
    title: "Project title",
    category: "Client work",
    description: "Replace this with a concise description of your client work.",
    problem: "Describe the client or user need.",
    solution: "Summarize the experience you designed and built.",
    technologies: ["React", "Vite", "Firebase"],
    accent: "wine",
  },
  {
    title: "Project title",
    category: "Personal exploration",
    description: "Use this space for an experiment that shows how you think.",
    problem: "Describe the idea or technical challenge.",
    solution: "Share the interaction, visual, or engineering approach.",
    technologies: ["JavaScript", "UI Design", "Animation"],
    accent: "moss",
  },
];
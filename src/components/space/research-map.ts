/** A map of the portfolio, rather than a simulation or performance metric. */
export const RESEARCH_LAYERS = [
  {
    label: "Build",
    title: "Software is the foundation.",
    description: "I started by building software. Turning an idea into a working system still grounds every research question I take on.",
    evidence: "Explore the systems I've built",
    href: "#projects",
    caption: "Foundation · software engineering",
  },
  {
    label: "Compute",
    title: "Go deeper into the machine.",
    description: "My focus moved down the stack: GPU computing, efficient transformers and computer vision. The question is how to make intelligence practical to run.",
    evidence: "Explore my research directions",
    href: "#focus",
    caption: "Current direction · AI & GPU systems",
  },
  {
    label: "Collaborate",
    title: "Intelligence has to work together.",
    description: "At Kent State's ATR Lab, I contribute to robotics research. Our RO-MAN work connects local models, shared knowledge and human feedback for multi-robot search and rescue.",
    evidence: "Read the research",
    href: "#research",
    caption: "Research · human–robot collaboration",
  },
  {
    label: "Explore",
    title: "A direction beyond the horizon.",
    description: "Graduate research in AI systems is the next step. Longer term, I want to bring that engineering to space technology and exploration.",
    evidence: "More about my journey",
    href: "#about",
    caption: "Long-term ambition · space exploration",
  },
] as const;
export type ResearchLayer = 0 | 1 | 2 | 3;

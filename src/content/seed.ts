/**
 * Initial content, compiled from the CV and GitHub.
 *
 * `npm run db:seed` copies this into Neon. Until DATABASE_URL is set the public
 * site renders straight from this file, so the portfolio works out of the box.
 * After seeding, edit everything from /admin instead of here.
 */
import type {
  Achievement,
  Education,
  Experience,
  FocusArea,
  Profile,
  Project,
  Publication,
  Skill,
} from "@/lib/db/schema";

type Seed<T> = Omit<T, "id" | "createdAt" | "sortOrder" | "visible"> &
  Partial<Pick<T & { visible: boolean }, "visible">>;

export const seedProfile: Omit<Profile, "id" | "updatedAt"> = {
  name: "Sarwad Hasan Siddiqui",
  headline:
    "CS researcher at KUET working on GPU-accelerated AI systems: efficient transformers, computer vision and the infrastructure that makes models fast, small and reliable.",
  roles: [
    "AI Systems Researcher",
    "GPU & HPC · CUDA",
    "Efficient Transformers",
    "Computer Vision & Multimodal AI",
    "Software Engineer @ Logarithm Studio",
  ],
  bio: "I'm a Computer Science & Engineering undergraduate at KUET building intelligent, high-performance systems where AI, GPU computing and software engineering meet. My work started in general software development and has moved steadily down the stack: AI systems, CUDA and HPC, sparse and tensor computation, efficient transformers, model compression and computer vision. I like taking a technically difficult idea, whether a model architecture, an optimisation or a GPU workload, and turning it into a system that can be measured and reproduced. Recent work spans Medora, a consent-governed bilingual health platform; reproducing and beating an ICASSP challenge baseline for cross-lingual face–voice verification; explainability for Vision Transformers; and a drift-aware risk model for quantitative finance. I'm building toward graduate research in AI systems, and eventually toward applying that engineering to space technology and exploration.",
  location: "Khulna, Bangladesh",
  email: "sarwad015@gmail.com",
  avatarUrl: "/images/sarwad.jpg",
  resumeUrl: "/Sarwad-Hasan-Siddiqui-CV.pdf",
  availability:
    "Open to research collaborations, research internships and graduate opportunities",
  socials: [
    { label: "GitHub", url: "https://github.com/Rockstatata" },
    { label: "LinkedIn", url: "https://linkedin.com/in/sarwad-hasan-siddiqui" },
    {
      label: "Google Scholar",
      url: "https://scholar.google.com/citations?user=l_J2QaYAAAAJ&hl=en",
    },
    { label: "LeetCode", url: "https://leetcode.com/u/Rockstatata/" },
    { label: "X", url: "https://x.com/Shspianto" },
    { label: "Email", url: "mailto:sarwad015@gmail.com" },
  ],
  stats: [
    { label: "Papers & submissions", value: "5" },
    { label: "CGPA · Dean's List ×2", value: "3.77" },
    { label: "Competition podiums", value: "6" },
    { label: "Systems shipped", value: "20+" },
  ],
};

export const seedFocusAreas: Seed<FocusArea>[] = [
  {
    title: "GPU & HPC systems",
    status: "Core direction",
    summary:
      "CUDA, high-performance computing and performance engineering: profiling real workloads, understanding memory hierarchies and making models run faster per watt and per dollar. From hand-written OpenGL/GLSL ray tracing to GPU training pipelines.",
    keywords: ["CUDA", "HPC", "GPU profiling", "OpenGL / GLSL", "Big data"],
  },
  {
    title: "Efficient AI & transformers",
    status: "Active study",
    summary:
      "Making transformers smaller, faster and cheaper to deploy: sparse and tensor computation, parameter-efficient fine-tuning (LoRA / QLoRA), model compression and inference optimisation.",
    keywords: [
      "Sparse & tensor computing",
      "LoRA / QLoRA",
      "Compression",
      "Inference",
    ],
  },
  {
    title: "Computer vision & multimodal learning",
    status: "Active · ICASSP 2027 Grand Challenge",
    summary:
      "Cross-lingual face–voice verification for the FLAG 2027 challenge, and explainability for Vision Transformers, extending F2HF (FFN-weighted head filtering) toward a journal paper.",
    keywords: [
      "ViT explainability",
      "Face–voice verification",
      "OCR",
      "Speech",
    ],
  },
  {
    title: "Human–robot interaction",
    status: "RO-MAN 2026 · ICRA 2027 under review",
    summary:
      "Language-to-action models for manipulation and teleoperated imitation learning on physical arms, with work published at IEEE RO-MAN and submitted to ICRA 2027.",
    keywords: ["HRI", "LLM → action", "Imitation learning", "ROS 2"],
  },
  {
    title: "Trustworthy AI for Bangladesh",
    status: "Published · Medora",
    summary:
      "AI that is safe to deploy in low-resource settings: consent-governed healthcare records, Bangla legal retrieval and Bengali medical dialogue, where policy boundaries matter as much as model quality.",
    keywords: ["Healthcare AI", "Bangla NLP", "Retrieval", "Governance"],
  },
  {
    title: "Quantitative finance & ML",
    status: "Undergraduate thesis",
    summary:
      "DriftRisk-LoRA: reproducible financial data engineering and drift-aware risk modelling that combines market data with macro text such as FOMC statements.",
    keywords: [
      "Concept drift",
      "Risk modelling",
      "Financial NLP",
      "Backtesting",
    ],
  },
];

export const seedProjects: Seed<Project>[] = [
  {
    slug: "medora",
    title: "Medora",
    tagline: "Consent-aware, AI-native bilingual healthcare platform",
    description:
      "Bilingual, consent-governed research software for patient-held health records, human-reviewed clinical drafts, specialty navigation and appointment coordination in Bangladesh. Medora puts a deterministic policy boundary around assistive AI instead of treating a prompt as an access-control mechanism: every request passes a policy chokepoint that checks actor, relation, consent and scope before any data moves.",
    highlights: [
      "Purpose-, provider-, scope- and time-bound patient consent with a full access audit trail",
      "Source-linked AI summaries and review-gated prescription extraction",
      "Deterministic emergency red flags and specialty navigation with manual fallback",
      "Idempotent appointment booking with transactional outbox events",
      "Prescription OCR benchmarked across TrOCR, PaddleOCR, GLM-OCR and Qwen-VL",
    ],
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Supabase", "LLMs", "PWA"],
    category: "AI / ML",
    repoUrl: "https://github.com/CSE-3200-System-Project/Medora",
    liveUrl: "https://medorahealth.vercel.app",
    imageUrl: "/images/projects/medora.webp",
    year: "2026",
    context: "Published research · 100+ commits",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "flag-2027",
    title: "FLAG 2027 · Face–Voice Association",
    tagline:
      "Cross-lingual face–voice verification for an ICASSP 2027 Grand Challenge",
    description:
      "FLAG 2027 (Face–voice Association across LAnguages and Gender) asks whether a voice and a face belong to the same person, training only on English and testing on unheard Bangla speakers. I rebuilt the official FOP baseline as a verified reproduction package, with architecture and gradient parity against upstream, deterministic training, organiser-pair manifests and an independent ROC/EER implementation, then iterated on it. The current candidate scores 36.32% development EER against the published 36.92% baseline, with checkpoints and submissions hash-verified.",
    highlights: [
      "Dev EER 36.32% vs 36.92% published baseline (CodaBench submission 958820)",
      "6.9-point improvement over the first faithful reproduction run",
      "Architecture and gradient parity checks against upstream FOP",
      "Gap report diagnosing the remaining English gender-constrained cell",
    ],
    tech: [
      "PyTorch",
      "CUDA",
      "VGGFace",
      "ECAPA-TDNN",
      "Multimodal learning",
      "EER",
    ],
    category: "Research",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "ICASSP 2027 Grand Challenge",
    isPrivate: true,
    featured: false,
  },
  {
    slug: "f2hf-vit-explanations",
    title: "F2HF · Explaining Vision Transformers",
    tagline:
      "Extending FFN-weighted head filtering for ViT explanations toward a journal paper",
    description:
      "F2HF (ICCIT 2025, KUET) improves Vision Transformer explanations by weighting attention heads with a static importance signal taken from each block's feed-forward network. I'm working on the journal extension: deriving the method from Beyond Intuition, auditing paper-versus-code discrepancies, measuring the head-importance signal, and setting up ImageNet segmentation and perturbation evaluations across ViT-B and ViT-L.",
    highlights: [
      "Full derivation and code map from Beyond Intuition (TMLR 2023) to F2HF",
      "Recorded paper-vs-code discrepancies instead of silently fixing them",
      "Segmentation and patch-perturbation evaluation following Chefer et al.",
    ],
    tech: ["PyTorch", "Vision Transformers", "Explainability", "ImageNet"],
    category: "Research",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "Journal extension · KUET",
    isPrivate: true,
    featured: false,
  },
  {
    slug: "driftrisk-lora",
    title: "DriftRisk-LoRA",
    tagline: "Drift-aware financial risk modelling, my undergraduate thesis",
    description:
      "A thesis project on risk modelling under concept drift in financial markets. The reproducible data pipeline is complete: versioned market snapshots, a quality-gated macro-text corpus of FOMC statements, minutes and releases, and an asset-level text layer with entity resolution, alongside scaffolds for temporal splitting, drift detection, losses and backtesting.",
    highlights: [
      "Reproducible, snapshot-versioned financial data engineering",
      "Quality-gated FOMC macro-text corpus",
      "Config-driven CLI with tests from day one",
    ],
    tech: ["Python", "PyTorch", "LoRA", "Financial NLP", "pytest"],
    category: "Research",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "Undergraduate thesis",
    isPrivate: true,
    featured: false,
  },
  {
    slug: "bangla-long-form-asr",
    title: "Bangla Long-form ASR & Diarization",
    tagline: "Who spoke when, and what they said, in hours of Bengali audio",
    description:
      "Competition work for DL Sprint 4 on long-form Bengali speech: automatic speech recognition over long recordings and speaker diarization, iterating Pyannote 3 pipelines on GPU notebooks.",
    highlights: [
      "Long-form Bengali ASR pipelines",
      "Speaker diarization with Pyannote 3",
    ],
    tech: ["PyTorch", "Pyannote", "ASR", "Speech", "CUDA"],
    category: "Research",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "DL Sprint 4",
    isPrivate: true,
    featured: false,
  },
  {
    slug: "agun-panjika",
    title: "Agun Panjika",
    tagline: "One fire history across sensors and seasons for Bangladesh",
    description:
      "Built for the NASA Space Apps Challenge 2026 with Team KUETaguns. MODIS (≈1 km pixels) and VIIRS (375 m pixels) see the same fires with different sensitivity, so naively joining their counts creates a false jump. Agun Panjika harmonises both onto a common weekly VIIRS scale from 2001 onward and turns it into a bilingual fire calendar, sensor comparison, seasonal alerts and a two-week early-warning outlook for forest officers, communities, researchers and newsrooms.",
    highlights: [
      "Harmonised MODIS/VIIRS history with calibrated 80% bands and a tested NOAA-20/21 continuity bridge",
      "Fire calendar, sensor comparison, district choropleths and cross-border analysis for the Chittagong Hill Tracts",
      "Two-week fire-weather outlook with bilingual RSS and CAP 1.2 alert feeds",
      "English/Bangla, offline-cached, with an interactive Three.js 'Soft Earth' globe",
    ],
    tech: [
      "Python",
      "React",
      "TypeScript",
      "Vite",
      "D3",
      "Three.js",
      "NASA FIRMS",
      "NASA POWER",
    ],
    category: "Space & Science",
    repoUrl: "https://github.com/Rockstatata/Agun-Panjika",
    liveUrl: "",
    imageUrl: "/images/projects/agun-panjika.webp",
    year: "2026",
    context: "NASA Space Apps Challenge 2026",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "interlink",
    title: "Interlink",
    tagline: "An AI agent that automates daily life and professional workflows",
    description:
      "Interlink is an AI automation platform built at Logarithm Studio. It connects to the tools people already use and turns natural-language intent into multi-step actions, so daily chores and professional workflows run seamlessly in the background. I work across the React Native app and the TypeScript backend.",
    highlights: [
      "Cross-platform React Native client",
      "TypeScript backend with tool integrations via Composio",
      "Agentic workflow orchestration over third-party apps",
    ],
    tech: ["React Native", "TypeScript", "Node.js", "Composio", "LLMs"],
    category: "AI / ML",
    repoUrl: "https://github.com/Logarithm-Studio/Interlink-backend",
    liveUrl: "",
    imageUrl: "/images/projects/interlink.webp",
    year: "2026",
    context: "Logarithm Studio · core engineer",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "jagoo-bahee",
    title: "Jagoo Bahee",
    tagline:
      "A censorship-resistant community platform that survives a blackout",
    description:
      "A federated forum that degrades gracefully from full internet, through ISP-level blocking, to a complete national blackout, and keeps working at every step. Every mutation is a self-authenticating signed envelope whose validity does not depend on any server, so the same content can travel over HTTP, gRPC, LoRa, Bluetooth or a QR code and still be verified on arrival. Built by team Protidhwoni (প্রতিধ্বনি) with Tasmir Hossain Zihad and Rezuan Mustafa Hasan; it took the runners-up position at the July Hackathon 2026, organised by the July Revolutionary Alliance.",
    highlights: [
      "Runners-up, July Hackathon 2026",
      "Signed envelopes verified identically across HTTP, gRPC federation, local mesh and Reticulum",
      "Anonymous forum track with blind credentials, epoch nullifiers and proof-of-work anti-abuse",
      "Separate identified broadcast and offline person-to-person messaging track",
      "Three independent implementations (TypeScript, Rust, Python) compared byte-for-byte in CI",
    ],
    tech: ["React Native", "TypeScript", "Rust", "Python", "gRPC", "LoRa"],
    category: "Mobile",
    repoUrl: "https://github.com/tasmirz/jagoo-bahee",
    liveUrl: "",
    imageUrl: "/images/projects/jagoo-bahee.webp",
    year: "2026",
    context: "July Hackathon 2026 · Runners-up",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "dhara",
    title: "Dhara",
    tagline:
      "Bangla legal retrieval that maps citizen questions to the exact law section",
    description:
      "Dhara takes a plain-Bangla citizen question and returns the exact law section (ধারা) with its official citation. The research claim: a lexical gap separates colloquial citizen phrasing from formal legal Bangla, and around 60% of the answers citizens need live in English-only Acts. The corpus covers 39,484 chunks across 1,227 Acts from the bdlaws portal.",
    highlights: [
      "Fine-tuned BGE-m3 + LoRA reached Recall@10 of 0.50, up from a 0.067 BM25 floor",
      "+8.3 points on the hardest English-target slice, the gap the thesis predicts",
      "Sequence tagger for ACT / PARTY entities at 0.857 / 0.627 F1",
      "Dated decision log, ablations and significance tests for every number",
    ],
    tech: [
      "Python",
      "PyTorch",
      "BGE-m3",
      "LoRA",
      "NLP",
      "Information Retrieval",
    ],
    category: "AI / ML",
    repoUrl: "https://github.com/Rockstatata/Dhara",
    liveUrl: "",
    imageUrl: "/images/projects/dhara.webp",
    year: "2026",
    context: "NLP research",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "voyager-2",
    title: "Voyager-2",
    tagline:
      "A from-scratch OpenGL solar system that flies Voyager 2's real trajectory",
    description:
      "A 3D solar system explorer built on modern OpenGL 3.3 Core and C++20. 26 textured bodies, including every major moon, are placed from dense NASA/JPL Horizons state vectors, and the Voyager 2 probe can be flown manually or replayed historically through its Jupiter, Saturn, Uranus and Neptune flybys out to the heliopause.",
    highlights: [
      "Double-precision floating origin with logarithmic depth for solar-system scale",
      "Shadow maps, LOD, frustum culling and an optional ray-traced view",
      "Inspect mode walking through 18 Voyager components, Golden Record included",
      "Scripted capture tours and a benchmark harness for regression checks",
    ],
    tech: ["C++20", "OpenGL", "GLSL", "GLFW", "glm", "NASA JPL Horizons"],
    category: "GPU & Graphics",
    repoUrl: "https://github.com/Rockstatata/Voyager-2",
    liveUrl: "",
    imageUrl: "/images/projects/voyager-2.webp",
    year: "2026",
    context: "GPU rendering · OpenGL",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "chorui",
    title: "Chorui",
    tagline: "Money that moves atomically, exactly once, and stays auditable",
    description:
      "A closed-loop simulated BDT money platform built to prove that every taka moves atomically and exactly once under retries, concurrency and application failure. Amounts are integers in poisha, every transfer is an immutable balanced journal entry, and live reconciliation runs after normal traffic and deliberate failures.",
    highlights: [
      "Atomic one-to-one and group transfers (up to 20 recipients, all-or-nothing)",
      "Database-backed idempotency and pessimistic row locking against overspend",
      "Double-entry ledger with live reconciliation and deterministic step-up rules",
      "Three stateless FastAPI replicas behind nginx, deployed on Azure",
    ],
    tech: ["FastAPI", "PostgreSQL", "Next.js", "Docker", "nginx", "Azure"],
    category: "Web",
    repoUrl: "https://github.com/Rockstatata/pstu-hackathon",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "PSTU Hackathon",
    isPrivate: false,
    featured: false,
  },
  {
    slug: "astroworld",
    title: "ASTROWORLD",
    tagline: "NASA's data as an immersive cosmic experience",
    description:
      "A full-stack astronomy platform that turns NASA's data repositories into an explorable universe: 17+ NASA API integrations, a Stellarium-powered 3D sky, the Murph AI assistant, research discovery, space weather alerts, personal dashboards, events, news and a gallery.",
    highlights: [
      "17+ NASA API integrations including APOD, DONKI space weather and NEO feeds",
      "3D sky visualisation powered by the Stellarium web engine",
      "Murph, an AI assistant with conversation persistence and export",
    ],
    tech: ["React 19", "TypeScript", "Django 5.2", "PostgreSQL", "LLMs"],
    category: "Space & Science",
    repoUrl: "https://github.com/Rockstatata/ASTROWORLD",
    liveUrl: "https://astroworld-seven.vercel.app",
    imageUrl: "/images/projects/astroworld.webp",
    year: "2026",
    context: "",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "astroscript",
    title: "AstroScript",
    tagline: "A space-themed programming language with its own compiler",
    description:
      "A space-themed programming language with a custom compiler built using Flex, Bison and C++: lexer, parser, symbol-table semantic analysis and three-address-code generation, plus a Next.js web playground and documentation site.",
    highlights: [
      "Flex lexer and Bison grammar with semantic analysis",
      "Three-address-code intermediate representation",
      "Browser playground and language docs built with Next.js",
    ],
    tech: ["C++", "Flex", "Bison", "Next.js"],
    category: "Systems",
    repoUrl: "https://github.com/Rockstatata/AstroScript",
    liveUrl: "https://astro-script.vercel.app",
    imageUrl: "",
    year: "2026",
    context: "Compiler Design",
    isPrivate: false,
    featured: false,
  },
  {
    slug: "text-to-action-llm",
    title: "Text-to-Action LLM",
    tagline: "Natural-language instructions into structured robot action plans",
    description:
      "A research system that converts natural-language instructions into structured JSON action plans for scene manipulation, with chained commands and continuous motion animation. LLaMA 3.1 8B is fine-tuned with QLoRA via Unsloth and served locally through Ollama behind a FastAPI inference server, driving a Three.js scene.",
    highlights: [
      "QLoRA fine-tuning of LLaMA 3.1 8B with Unsloth",
      "Chained multi-step commands parsed into ordered action sequences",
      "FastAPI inference server and Three.js visualiser with eased motion",
    ],
    tech: ["Python", "LLaMA 3.1", "QLoRA", "Unsloth", "FastAPI", "Three.js"],
    category: "Research",
    repoUrl: "https://github.com/Rockstatata/text-to-action-llm",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "Human–robot interaction",
    isPrivate: false,
    featured: false,
  },
  {
    slug: "harmonydb",
    title: "HarmonyDB",
    tagline: "A music streaming platform you can query in plain English",
    description:
      "A Spotify-like music library and player with AI-powered natural-language database querying. MeloAI converts questions into SQL, with real-time query debugging and advanced SQL demonstrations behind a Django REST backend and a React TypeScript frontend.",
    highlights: [
      "Natural-language to SQL with MeloAI (Groq LLMs)",
      "Real-time SQL debugging and execution-time monitoring",
      "Listener and artist roles, playlists and listening history",
    ],
    tech: ["Django REST", "React", "TypeScript", "PostgreSQL", "Groq"],
    category: "Web",
    repoUrl: "https://github.com/Rockstatata/HarmonyDB",
    liveUrl: "",
    imageUrl: "/images/projects/harmonydb.webp",
    year: "2025",
    context: "Database Systems",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "classwiz",
    title: "ClassWiz",
    tagline: "Role-based class routine and attendance platform for iOS",
    description:
      "An iOS-first academic operations app for students, teachers and administrators: routine scheduling, attendance recording, attendance analytics with decision support, offline-first behaviour and optional AI-assisted explanations.",
    highlights: [
      "SwiftUI + MVVM with Combine",
      "Firebase Auth and Cloud Firestore with offline-first sync",
      "Attendance analytics with actionable alerts",
    ],
    tech: ["Swift", "SwiftUI", "Firebase", "Combine"],
    category: "Mobile",
    repoUrl: "https://github.com/Rockstatata/ClassWiz-Swift",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "",
    isPrivate: false,
    featured: false,
  },
  {
    slug: "smartsmash",
    title: "SmartSmash",
    tagline: "Multi-agent AI badminton to compare classical AI algorithms",
    description:
      "A two-player badminton simulation where AI agents compete at discrete rally decision points, built to compare classical AI paradigms (search, adversarial, probabilistic) on decision quality, compute cost and play style under identical constraints.",
    highlights: [
      "Classical AI agents with no ML libraries, fully explainable",
      "Clean separation of AI logic, simulation and visualisation",
      "AI-vs-AI comparative analysis",
    ],
    tech: ["Python", "JavaScript", "Three.js"],
    category: "AI / ML",
    repoUrl: "https://github.com/Rockstatata/Smartsmash",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "CSE 3209 Artificial Intelligence",
    isPrivate: false,
    featured: false,
  },
  {
    slug: "daily-gratitude",
    title: "Daily Gratitude",
    tagline: "A soft, AI-native journaling companion",
    description:
      "An AI-native journaling app built at Algosoft Technologies: mood tracking, affirmations, top priorities, to-dos, gratitude prompts and night reflections, with graceful fallback guidance when live models are unavailable.",
    highlights: [
      "Journal-first reflection flows with mood tracking",
      "AI guidance with graceful offline fallback",
    ],
    tech: ["React Native", "FastAPI", "LLMs"],
    category: "Mobile",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    year: "2025",
    context: "Algosoft Technologies",
    isPrivate: true,
    featured: false,
  },
  {
    slug: "bengali-medical-dialogue",
    title: "Bengali Medical Dialogue Generation",
    tagline: "Doctor-style Bengali responses to patient prompts — 3rd place",
    description:
      "Our entry for the Nascenia AI Hackathon: generating a doctor's response in Bengali to a patient's prompt, scored on similarity to a reference answer and on diagnostic accuracy. We surveyed native Bengali medical datasets (disease–symptom, severity, colloquial complaints, MedER NER, MedQA, MediBeng) and built a generation pipeline around them.",
    highlights: [
      "Placed 3rd at the Nascenia AI Hackathon",
      "Curated Bengali medical and mental-health dialogue corpora",
      "Rulebook audit and data-driven modelling strategy",
    ],
    tech: ["Python", "LLMs", "Bangla NLP", "Jupyter"],
    category: "AI / ML",
    repoUrl: "",
    liveUrl: "",
    imageUrl: "",
    year: "2026",
    context: "Nascenia AI Hackathon (Kaggle) · 3rd place",
    isPrivate: true,
    featured: false,
  },
  {
    slug: "verity",
    title: "Verity",
    tagline: "Tamper-evident loan classification on a BFT ledger",
    description:
      "Bangladesh Bank already requires two named signatures on every loan classification and caps rescheduling. Verity adds no rule: it turns those approvals from a field the bank fills in itself into a condition the code checks, and refuses by name, citing the circular. Built by Team Logarithm for BCOLBD 2026 (Blockchain, Student).",
    highlights: [
      "Hyperledger Fabric v3 BFT network with four modules driven end to end",
      "10/10 red-team attacks refused, 170 unit tests green",
      "Every refusal cites the regulation it enforces",
    ],
    tech: ["Hyperledger Fabric", "TypeScript", "Blockchain"],
    category: "Web",
    repoUrl: "https://github.com/ripWr3ncH/Verity-TeamLogarithm",
    liveUrl: "",
    imageUrl: "/images/projects/verity.webp",
    year: "2026",
    context: "BCOLBD 2026 · Team Logarithm",
    isPrivate: false,
    featured: true,
  },
  {
    slug: "gridwise",
    title: "GridWise",
    tagline: "LLM-assisted smart-campus energy optimiser",
    description:
      "Reads free-text operator notes plus a 24-hour demand, solar, tariff and battery scenario and returns a cost-optimal grid-and-battery dispatch plan. The language model never produces a kilowatt-hour: it only translates notes into a closed, typed directive schema, and every number comes from a deterministic MILP optimiser.",
    highlights: [
      "458 tests passing; 10/10 public cases with a +0.00 cost gap",
      "p95 latency 3.26 s with a real model call on every case",
      "LLM constrained to a typed directive schema; MILP does the maths",
    ],
    tech: ["Python", "MILP", "LLMs", "FastAPI"],
    category: "AI / ML",
    repoUrl: "https://github.com/mayer-doa-coder/BUP-HACKATHON-PRELI",
    liveUrl: "https://bup-hackathon-preli-pearl.vercel.app",
    imageUrl: "",
    year: "2026",
    context: "BUP CSE Fest 2026 Hackathon",
    isPrivate: false,
    featured: false,
  },
  {
    slug: "parabounce",
    title: "ParaBounce",
    tagline: "Projectile motion simulator — ILM AI Hackathon runner-up",
    description:
      "An interactive projectile-motion simulation built with Team Kuet Kobe Khulbe that won 2nd place at the ILM AI Hackathon.",
    highlights: ["2nd place, ILM AI Hackathon"],
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "Space & Science",
    repoUrl:
      "https://github.com/Kuet-Kobe-Khulbe/ParaBounce--Projectile-Motion-Simulation",
    liveUrl: "",
    imageUrl: "",
    year: "2025",
    context: "International 1st runner-up · ILM AI",
    isPrivate: false,
    featured: false,
  },
];

export const seedPublications: Seed<Publication>[] = [
  {
    title:
      "Medora: A Consent-Aware, AI-Native Bilingual Platform for Healthcare Management and Consultation",
    authors: "S. H. Siddiqui, A. Tahsin, K. S. Alam, S. I. Hossain",
    venue: "",
    year: "2026",
    status: "published",
    kind: "Journal",
    abstract:
      "A bilingual healthcare platform for Bangladesh that places a deterministic consent and policy boundary around assistive AI for patient records, clinical drafts and appointment coordination.",
    url: "https://scholar.google.com/citations?user=l_J2QaYAAAAJ&hl=en",
    pdfUrl: "",
  },
  {
    title: "IEEE RO-MAN paper (edit title in admin)",
    authors: "S. H. Siddiqui et al.",
    venue:
      "IEEE International Conference on Robot and Human Interactive Communication (RO-MAN)",
    year: "2026",
    status: "published",
    kind: "Conference",
    abstract: "",
    url: "",
    pdfUrl: "",
  },
  {
    title: "IHCI poster paper (edit title in admin)",
    authors: "S. H. Siddiqui et al.",
    venue:
      "International Conference on Intelligent Human Computer Interaction (IHCI)",
    year: "2026",
    status: "poster",
    kind: "Poster",
    abstract: "",
    url: "",
    pdfUrl: "",
  },
  {
    title: "ICRA 2027 submission (edit title in admin)",
    authors: "S. H. Siddiqui et al.",
    venue:
      "IEEE International Conference on Robotics and Automation (ICRA 2027)",
    year: "2027",
    status: "under_review",
    kind: "Conference",
    abstract: "",
    url: "",
    pdfUrl: "",
  },
  {
    title: "ICCIT 2027 submission (edit title in admin)",
    authors: "S. H. Siddiqui et al.",
    venue:
      "International Conference on Computer and Information Technology (ICCIT 2027)",
    year: "2027",
    status: "under_review",
    kind: "Conference",
    abstract: "",
    url: "",
    pdfUrl: "",
  },
];

export const seedExperiences: Seed<Experience>[] = [
  {
    role: "Undergraduate Researcher",
    org: "Khulna University of Engineering & Technology (KUET)",
    orgUrl: "https://www.kuet.ac.bd",
    period: "2025 — Present",
    kind: "Research",
    description:
      "Research across AI systems, computer vision, HRI and healthcare AI with KUET faculty: a published Medora paper, IEEE RO-MAN and IHCI work, ICRA 2027 and ICCIT submissions, FLAG 2027 (ICASSP Grand Challenge) and an F2HF journal extension.",
  },
  {
    role: "Software Engineer",
    org: "Logarithm Studio",
    orgUrl: "https://github.com/Logarithm-Studio",
    period: "Mar 2026 — Present",
    kind: "Work",
    description:
      "Core engineer on Interlink, an AI automation agent: wrote most of the React Native app and TypeScript backend (≈120 commits), plus product features and iterative delivery across studio apps.",
  },
  {
    role: "Senior Executive",
    org: "Team Durbar · KUET Mars Rover",
    orgUrl: "https://www.linkedin.com/company/kuetmarsrover/",
    period: "Sep 2025 — Present",
    kind: "Research",
    description:
      "Member of KUET's Mars rover team, which designs and builds rovers for international rover challenges.",
  },
  {
    role: "Junior Software Developer (Part-time)",
    org: "AlgoSoft Technologies Limited",
    orgUrl: "https://www.linkedin.com/company/algosoftbd/",
    period: "Oct 2025 — 2026",
    kind: "Work",
    description:
      "Shipped mobile apps and Python services, including the AI-native Daily Gratitude journaling app, after an internship with the same team.",
  },
  {
    role: "Software Developer Intern",
    org: "AlgoSoft Technologies Limited",
    orgUrl: "https://www.linkedin.com/company/algosoftbd/",
    period: "Apr 2025 — Sep 2025",
    kind: "Work",
    description:
      "Product features and UI implementation for mobile and web projects.",
  },
  {
    role: "Assistant Joint Secretary & Group Co-Organizer",
    org: "TEDxKUET 2026",
    orgUrl: "",
    period: "2026",
    kind: "Leadership",
    description:
      "Public Relations team: guest and speaker relations, logistics, and promotional video content for campaigns that reached 50.5K+ views before the event.",
  },
  {
    role: "Secretary of PR",
    org: "KUET Business & Entrepreneurship Club (KBEC)",
    orgUrl: "",
    period: "Jun 2026 — Present",
    kind: "Leadership",
    description:
      "Leads operational planning for club events and workshops; coordinates logistics, communications and member onboarding.",
  },
];

export const seedEducation: Seed<Education>[] = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    school: "Khulna University of Engineering & Technology (KUET)",
    period: "2023 — 2027",
    score: "CGPA 3.77 / 4.00",
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    school: "Notre Dame College, Dhaka",
    period: "2019 — 2021",
    score: "GPA 5.00 / 5.00",
  },
  {
    degree: "Secondary School Certificate (SSC)",
    school: "Adamjee Cantonment Public School, Dhaka",
    period: "2015 — 2019",
    score: "GPA 5.00 / 5.00",
  },
];

export const seedAchievements: Seed<Achievement>[] = [
  {
    title: "Runners-up",
    event: "July Hackathon 2026",
    date: "2026",
    description:
      "Team Protidhwoni built Jagoo Bahee: an anonymous, censorship-resistant social platform with internet-optional chat over the Reticulum network stack. Organised by the July Revolutionary Alliance.",
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7508114038984286209/",
  },
  {
    title: "3rd Place",
    event: "Nascenia AI Hackathon (Kaggle)",
    date: "2026",
    description:
      "Bengali medical dialogue generation: doctor-style responses to patient prompts, scored on similarity and diagnostic accuracy.",
    url: "",
  },
  {
    title: "Dean's List",
    event: "KUET · 2nd year",
    date: "2026",
    description:
      "Placed on the Dean's List for the second year of the B.Sc. in CSE.",
    url: "",
  },
  {
    title: "1st Runner-Up",
    event: "Bridging Engineering & Computer Science Competition 2025",
    date: "2025",
    description:
      "International competition by ILM AI Ltd. and City, St George's, University of London. Team Kuet_Kobe_Khulbe placed with ParaBounce, a Next.js projectile-motion simulator.",
    url: "",
  },
  {
    title: "Dean's List & Dean's Award",
    event: "KUET · 1st year",
    date: "2025",
    description:
      "First-year CGPA of 3.82 across two terms in the B.Sc. in CSE.",
    url: "",
  },
  {
    title: "3rd Runner-Up",
    event: "Case Crack 2.0 · KBEC",
    date: "2025",
    description:
      "Business case competition hosted by the KUET Business & Entrepreneurship Club.",
    url: "",
  },
  {
    title: "2nd Place",
    event: "Spark Fusion 2K21",
    date: "2021",
    description: "Hardware design competition.",
    url: "",
  },
];

const skill = (category: string, names: string[]): Seed<Skill>[] =>
  names.map((name) => ({ name, category }));

export const seedSkills: Seed<Skill>[] = [
  ...skill("AI & Research", [
    "PyTorch",
    "Transformers",
    "Fine-tuning (LoRA / QLoRA)",
    "Computer Vision",
    "NLP & Retrieval",
    "Speech (ASR, diarization)",
    "Reproducible experiments",
  ]),
  ...skill("GPU & Systems", [
    "CUDA",
    "HPC",
    "OpenGL / GLSL",
    "C++20",
    "Compilers (Flex & Bison)",
    "Docker",
    "Linux",
  ]),
  ...skill("Languages", [
    "Python",
    "C++",
    "C",
    "TypeScript",
    "JavaScript",
    "Java",
    "Swift",
    "SQL",
  ]),
  ...skill("Backend & Data", [
    "FastAPI",
    "Django",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
    "Supabase",
    "Firebase",
    "Spring Boot",
  ]),
  ...skill("Product Engineering", [
    "React",
    "Next.js",
    "React Native",
    "SwiftUI",
    "Three.js",
    "Tailwind CSS",
    "AWS",
    "Google Cloud",
  ]),
];

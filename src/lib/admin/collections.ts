/**
 * Describes every editable list on the site. The admin list, form and save
 * action are all generated from these definitions, so adding a field here is
 * the only change needed to expose it in the dashboard.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "image"
  | "tags"
  | "lines"
  | "boolean"
  | "select";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  /** Spans both columns of the form grid. */
  wide?: boolean;
};

export type CollectionKey =
  | "projects"
  | "publications"
  | "experiences"
  | "education"
  | "achievements"
  | "skills"
  | "focusAreas";

export type Collection = {
  key: CollectionKey;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  subtitleField: string;
  fields: Field[];
};

export const PUBLICATION_STATUSES = [
  { value: "published", label: "Published" },
  { value: "accepted", label: "Accepted" },
  { value: "under_review", label: "Under review" },
  { value: "poster", label: "Poster" },
  { value: "preprint", label: "Preprint" },
  { value: "in_preparation", label: "In preparation" },
];

export const PROJECT_CATEGORIES = [
  "Research",
  "AI / ML",
  "Robotics",
  "GPU & Graphics",
  "Space & Science",
  "Web",
  "Mobile",
  "Systems",
  "Hardware",
  "Games",
].map((c) => ({ value: c, label: c }));

const visible: Field = {
  name: "visible",
  label: "Visible on site",
  type: "boolean",
  help: "Hidden items stay in the dashboard but disappear from the public site.",
};

export const collections: Record<CollectionKey, Collection> = {
  focusAreas: {
    key: "focusAreas",
    label: "Research vectors",
    singular: "Research vector",
    description:
      "The research directions highlighted near the top of the site.",
    titleField: "title",
    subtitleField: "status",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "status",
        label: "Status line",
        type: "text",
        placeholder: "Active · ICASSP 2027 Grand Challenge",
      },
      { name: "summary", label: "Summary", type: "textarea", wide: true },
      {
        name: "keywords",
        label: "Keywords",
        type: "tags",
        wide: true,
        help: "Comma separated.",
      },
      visible,
    ],
  },
  projects: {
    key: "projects",
    label: "Projects",
    singular: "Project",
    description:
      "Everything shown in the Explored Worlds section and on project pages.",
    titleField: "title",
    subtitleField: "tagline",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "URL slug",
        type: "text",
        required: true,
        placeholder: "my-project",
        help: "Lowercase, hyphenated. Becomes /projects/<slug>.",
      },
      { name: "tagline", label: "Tagline", type: "text", wide: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        wide: true,
      },
      {
        name: "highlights",
        label: "Highlights",
        type: "lines",
        wide: true,
        help: "One bullet per line.",
      },
      {
        name: "tech",
        label: "Tech stack",
        type: "tags",
        wide: true,
        help: "Comma separated.",
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: PROJECT_CATEGORIES,
      },
      { name: "year", label: "Year", type: "text", placeholder: "2026" },
      {
        name: "context",
        label: "Context",
        type: "text",
        placeholder: "Hackathon, course, company…",
      },
      { name: "repoUrl", label: "Repository URL", type: "url" },
      { name: "liveUrl", label: "Live URL", type: "url" },
      { name: "imageUrl", label: "Cover image", type: "image", wide: true },
      {
        name: "featured",
        label: "Featured",
        type: "boolean",
        help: "Featured projects get large cards at the top.",
      },
      {
        name: "isPrivate",
        label: "Private source",
        type: "boolean",
        help: "Shows a 'private repository' badge instead of a code link.",
      },
      visible,
    ],
  },
  publications: {
    key: "publications",
    label: "Research",
    singular: "Publication",
    description: "Papers, posters and submissions under review.",
    titleField: "title",
    subtitleField: "venue",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        wide: true,
      },
      { name: "authors", label: "Authors", type: "text", wide: true },
      { name: "venue", label: "Venue", type: "text", wide: true },
      { name: "year", label: "Year", type: "text" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: PUBLICATION_STATUSES,
      },
      {
        name: "kind",
        label: "Type",
        type: "select",
        options: [
          "Conference",
          "Journal",
          "Poster",
          "Workshop",
          "Thesis",
          "Preprint",
        ].map((v) => ({ value: v, label: v })),
      },
      { name: "url", label: "Paper URL", type: "url" },
      { name: "pdfUrl", label: "PDF URL", type: "url" },
      { name: "abstract", label: "Abstract", type: "textarea", wide: true },
      visible,
    ],
  },
  experiences: {
    key: "experiences",
    label: "Experience",
    singular: "Experience",
    description:
      "Jobs, leadership roles and volunteering. The Flight Log shows newest start dates first; use Mon YYYY or YYYY for the period start.",
    titleField: "role",
    subtitleField: "org",
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "org", label: "Organisation", type: "text", required: true },
      {
        name: "period",
        label: "Period",
        type: "text",
        placeholder: "2025 — Present",
      },
      {
        name: "kind",
        label: "Type",
        type: "select",
        options: ["Work", "Research", "Leadership", "Volunteer"].map((v) => ({
          value: v,
          label: v,
        })),
      },
      { name: "orgUrl", label: "Organisation URL", type: "url", wide: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        wide: true,
      },
      visible,
    ],
  },
  education: {
    key: "education",
    label: "Education",
    singular: "Education",
    description: "Degrees and schools.",
    titleField: "degree",
    subtitleField: "school",
    fields: [
      {
        name: "degree",
        label: "Degree",
        type: "text",
        required: true,
        wide: true,
      },
      {
        name: "school",
        label: "School",
        type: "text",
        required: true,
        wide: true,
      },
      { name: "period", label: "Period", type: "text" },
      {
        name: "score",
        label: "Result",
        type: "text",
        placeholder: "CGPA 3.78 / 4.00",
      },
      visible,
    ],
  },
  achievements: {
    key: "achievements",
    label: "Honors",
    singular: "Honor",
    description: "Awards, hackathon placements and recognitions.",
    titleField: "title",
    subtitleField: "event",
    fields: [
      {
        name: "title",
        label: "Placement / title",
        type: "text",
        required: true,
      },
      { name: "event", label: "Event", type: "text", required: true },
      { name: "date", label: "Date", type: "text", placeholder: "2026" },
      { name: "url", label: "Link", type: "url" },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        wide: true,
      },
      visible,
    ],
  },
  skills: {
    key: "skills",
    label: "Skills",
    singular: "Skill",
    description: "Grouped by category into the orbital skill map.",
    titleField: "name",
    subtitleField: "category",
    fields: [
      { name: "name", label: "Skill", type: "text", required: true },
      {
        name: "category",
        label: "Category",
        type: "text",
        required: true,
        help: "Skills with the same category share an orbit.",
      },
      visible,
    ],
  },
};

export const collectionList = Object.values(collections);

export function isCollectionKey(value: string): value is CollectionKey {
  return value in collections;
}

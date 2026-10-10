import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { Experience } from "@/components/site/experience";
import { Hero } from "@/components/site/hero";
import { Honors } from "@/components/site/honors";
import { Projects } from "@/components/site/projects";
import { Research } from "@/components/site/research";
import { ResearchFocus } from "@/components/site/research-focus";
import { Skills } from "@/components/site/skills";
import { getContent } from "@/lib/content";
import { initialsOf } from "@/lib/utils";

export default async function Home() {
  const content = await getContent();
  const { profile, experiences } = content;
  const current = experiences.find(
    (e) => /present/i.test(e.period) && e.kind === "Work",
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.roles[0],
    description: profile.headline,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    alumniOf: content.education.map((e) => ({
      "@type": "EducationalOrganization",
      name: e.school,
    })),
    sameAs: profile.socials
      .filter((s) => s.url.startsWith("http"))
      .map((s) => s.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
        }}
      />
      <Hero
        profile={profile}
        currentRole={current ? `${current.role} · ${current.org}` : undefined}
      />
      <About profile={profile} />
      <ResearchFocus index="02" items={content.focusAreas} />
      <Research publications={content.publications} />
      <Projects projects={content.projects} />
      <Experience
        items={[
          ...experiences,
          // The timeline orders roles and schools together by start date.
          ...content.education.map((ed) => ({
            ...ed,
            id: -ed.id,
            role: ed.degree,
            org: ed.school,
            orgUrl: "",
            kind: "Education",
            description: ed.score,
          })),
        ]}
      />
      <Skills skills={content.skills} initials={initialsOf(profile.name)} />
      <Honors items={content.achievements} />
      <Contact profile={profile} />
    </>
  );
}

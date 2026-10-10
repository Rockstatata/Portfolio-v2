import { getProfileRow } from "@/lib/admin/queries";
import { seedProfile } from "@/content/seed";
import { PageHeader } from "@/components/admin/page-header";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function ProfilePage() {
  const profile = (await getProfileRow()) ?? seedProfile;
  return (
    <>
      <PageHeader
        title="Profile"
        description="Hero, about, CV link, socials and the stat counters shown on the site."
      />
      <ProfileForm
        initial={{
          name: profile.name,
          headline: profile.headline,
          roles: profile.roles.join("\n"),
          bio: profile.bio,
          location: profile.location,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          resumeUrl: profile.resumeUrl,
          availability: profile.availability,
          socials: profile.socials
            .map((s) => `${s.label} | ${s.url}`)
            .join("\n"),
          stats: profile.stats.map((s) => `${s.label} | ${s.value}`).join("\n"),
        }}
      />
    </>
  );
}

import { Starfield } from "@/components/space/starfield";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getContent } from "@/lib/content";
import { initialsOf } from "@/lib/utils";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { profile } = await getContent();
  return (
    <SmoothScroll>
      <Starfield />
      <Nav initials={initialsOf(profile.name)} />
      <main>{children}</main>
      <Footer name={profile.name} />
    </SmoothScroll>
  );
}

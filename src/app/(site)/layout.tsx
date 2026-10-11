import { Starfield } from "@/components/space/starfield";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getContent } from "@/lib/content";
import { initialsOf } from "@/lib/utils";
import { VisualProvider } from "@/components/site/visual-provider";
import { Suspense } from "react";
import Link from "next/link";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { profile } = await getContent();
  return (
    <VisualProvider>
      <SmoothScroll>
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-[100] rounded-full bg-white px-5 py-3 text-sm text-void focus:not-sr-only"
        >
          Skip to content
        </a>
        <Starfield />
        <Suspense
          fallback={
            <header className="fixed inset-x-4 top-4 z-50">
              <nav
                aria-label="Primary"
                className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3"
              >
                <Link href="/" className="font-display text-sm text-white">
                  {initialsOf(profile.name)}
                </Link>
                <Link href="/blog" className="text-sm text-plasma">
                  Journal
                </Link>
              </nav>
            </header>
          }
        >
          <Nav initials={initialsOf(profile.name)} />
        </Suspense>
        <main id="main-content">{children}</main>
        <Footer name={profile.name} />
      </SmoothScroll>
    </VisualProvider>
  );
}

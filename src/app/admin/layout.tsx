import type { Metadata } from "next";
import { Toaster } from "sonner";

export const instant = false;

export const metadata: Metadata = {
  title: "Mission Control",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-void bg-[radial-gradient(ellipse_70%_50%_at_80%_-10%,rgb(76_29_149/0.25),transparent_60%)]">
      {children}
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}

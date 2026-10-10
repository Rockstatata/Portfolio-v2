import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sarwad Hasan Siddiqui — AI Systems Researcher & Engineer",
    template: "%s · Sarwad Hasan Siddiqui",
  },
  description:
    "Sarwad Hasan Siddiqui: CS researcher at KUET working on GPU-accelerated AI systems, efficient transformers, computer vision and human-robot interaction.",
  keywords: [
    "Sarwad Hasan Siddiqui",
    "KUET",
    "software engineer",
    "AI",
    "robotics",
    "HRI",
    "CUDA",
    "GPU computing",
    "efficient transformers",
    "computer vision",
    "portfolio",
    "Bangladesh",
  ],
  authors: [{ name: "Sarwad Hasan Siddiqui", url: siteUrl }],
  openGraph: {
    type: "website",
    title: "Sarwad Hasan Siddiqui — AI Systems Researcher & Engineer",
    description:
      "GPU & AI systems research, efficient transformers and computer vision, launched from Khulna.",
    siteName: "Sarwad Hasan Siddiqui",
  },
  twitter: { card: "summary_large_image", creator: "@Shspianto" },
};

export const viewport: Viewport = {
  themeColor: "#03040b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}

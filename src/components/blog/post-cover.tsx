import Image from "next/image";

export function PostCover({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  let optimize = src.startsWith("/");
  try {
    const host = new URL(src).hostname;
    optimize ||=
      host.endsWith(".public.blob.vercel-storage.com") ||
      host === "avatars.githubusercontent.com" ||
      host === "raw.githubusercontent.com";
  } catch {
    /* Relative image URLs are handled above. */
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={1280}
      height={720}
      unoptimized={!optimize}
      sizes="(max-width: 768px) 100vw, 720px"
      className={className}
    />
  );
}

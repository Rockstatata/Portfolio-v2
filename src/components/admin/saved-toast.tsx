"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/** Shows a confirmation after a save redirected here with ?saved=1, then cleans the URL. */
export function SavedToast() {
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (params.get("saved")) {
      toast.success("Saved — live on the site");
      router.replace(window.location.pathname, { scroll: false });
    }
  }, [params, router]);
  return null;
}

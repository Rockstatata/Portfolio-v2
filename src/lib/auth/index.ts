import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
  verifySession,
} from "./session";

export function adminConfigured() {
  return Boolean(
    process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET,
  );
}

export function passwordMatches(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function startSession() {
  (await cookies()).set(SESSION_COOKIE, await signSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Every admin server action and page calls this; proxy.ts is only an early redirect. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

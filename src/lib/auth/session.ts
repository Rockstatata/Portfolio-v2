import { jwtVerify, SignJWT } from "jose";

/** Shared by proxy.ts and server code, so it must stay free of Node-only imports. */
export const SESSION_COOKIE = "mc_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to at least 32 characters.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSession() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

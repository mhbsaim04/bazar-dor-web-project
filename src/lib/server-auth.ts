import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerSession() {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    // A missing local database configuration should not crash a public page.
    return null;
  }
}

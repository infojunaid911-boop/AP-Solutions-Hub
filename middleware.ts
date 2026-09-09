import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Scoped to /admin only — the public marketing site never runs this
  // middleware and is completely unaffected.
  matcher: ["/admin", "/admin/:path*"],
};

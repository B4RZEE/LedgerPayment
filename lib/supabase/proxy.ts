import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PATHS = ["/app/login", "/app/register", "/app/forgot-password", "/app/reset-password"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run logic between createServerClient and getUser() — it invalidates session refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isAppPath = pathname.startsWith("/app/") && !isAuthPath;

  if (isAppPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPath && pathname !== "/app/reset-password" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

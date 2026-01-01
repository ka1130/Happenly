import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Debug: pokaż path i ciasteczka
  console.log("Requested path:", request.nextUrl.pathname);
  console.log("Cookies:", request.cookies.getAll());

  // Tworzymy response, który zwrócimy
  let supabaseResponse = NextResponse.next({ request });

  // Tworzymy klienta Supabase SSR
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // ustawiamy ciasteczka tylko w response, nie w request
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Pobranie claims użytkownika
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Redirect tylko dla niezalogowanych użytkowników na faktycznie chronionych stronach
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth"; // strona logowania
    return NextResponse.redirect(url);
  }

  // Zwracamy response
  return supabaseResponse;
}

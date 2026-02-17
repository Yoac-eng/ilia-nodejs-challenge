import { auth } from "@/auth";
import {
  defaultLocale,
  detectLocaleFromHeaders,
  getLocaleFromPathname,
  localizePath,
  stripLocaleFromPathname,
} from "@/lib/i18n";

// this works as a middleware to protect the routes based on user's session status and assure every page has a valid locale in the path
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const locale = getLocaleFromPathname(pathname);

  // in case there is no locale in the path, we need to detect the locale from the headers
  if (!locale) {
    const detectedLocale = detectLocaleFromHeaders(req.headers) ?? defaultLocale;
    const redirectUrl = new URL(localizePath(pathname, detectedLocale), req.nextUrl);
    redirectUrl.search = req.nextUrl.search;
    return Response.redirect(redirectUrl);
  }

  const pathnameWithoutLocale = stripLocaleFromPathname(pathname);
  const isAuthRoute =
    pathnameWithoutLocale.startsWith("/login") ||
    pathnameWithoutLocale.startsWith("/register");

  if (!isLoggedIn && !isAuthRoute) {
    return Response.redirect(new URL(`/${locale}/login`, req.nextUrl));
  }

  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL(`/${locale}`, req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

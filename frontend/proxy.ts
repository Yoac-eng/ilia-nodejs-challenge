import { auth } from "@/auth";

// this works as a middleware to protect the routes based on user's session status
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

  if (!isLoggedIn && !isAuthRoute) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL('/', req.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

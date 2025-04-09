// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const LOCALES = ["es", "en"] as const;
type ValidLocale = (typeof LOCALES)[number];
const defaultLocale: ValidLocale = "en";

const PUBLIC_PATHS = [
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  "/assets",
] as const;

const IGNORED_PATHS = [
  "/_next",
  "/api",
  "/static",
  "/images",
  "/fonts",
] as const;

function isIgnoredPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) return true;
  if (IGNORED_PATHS.some((path) => pathname.startsWith(path))) return true;
  if (pathname.includes(".")) return true;
  return false;
}

function getPreferredLocale(request: NextRequest): ValidLocale {
  try {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (cookieLocale && LOCALES.includes(cookieLocale as ValidLocale)) {
      return cookieLocale as ValidLocale;
    }

    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({
      headers: negotiatorHeaders,
    }).languages();
    const preferredLocale = matchLocale(languages, LOCALES, defaultLocale);

    return preferredLocale as ValidLocale;
  } catch (error) {
    console.error("Error getting preferred locale:", error);
    return defaultLocale;
  }
}

function hasValidLocale(pathname: string): boolean {
  return LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

function buildLocalizedUrl(request: NextRequest, locale: ValidLocale): URL {
  const pathname = request.nextUrl.pathname;
  // Using the current URL as base to maintain the same domain
  const newUrl = new URL(pathname, request.url);

  if (pathname === "/") {
    newUrl.pathname = `/${locale}`;
  } else {
    newUrl.pathname = `/${locale}${pathname}`;
  }

  // Maintain search parameters
  newUrl.search = request.nextUrl.search;
  return newUrl;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Ignore paths that don't need processing
  if (isIgnoredPath(pathname)) {
    return NextResponse.next();
  }

  // 2. If the path already has a valid locale
  if (hasValidLocale(pathname)) {
    const response = NextResponse.next();

    return response;
  }

  // 4. For paths without locale, redirect to the localized version
  const locale = getPreferredLocale(request);
  const localizedUrl = buildLocalizedUrl(request, locale);
  const response = NextResponse.redirect(localizedUrl);

  // 5. Set locale cookie
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: [
    // Skip static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]*$).*)",
    "/",
  ],
};

// Root redirects live in next.config.ts.
// This file stays so future route guards have a place to live.
// Next.js requires an exported middleware function whenever this file exists.

import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   if (pathname === "/") {
//     return NextResponse.redirect(new URL(systemPaths.home, request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/"],
// };

// Using the next.config.ts file to redirect the root path to the home path
// This file is not used anymore
// But is valid for future references and complex redirects

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { systemPaths } from "@/constants/paths";

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

import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // For admin routes, we'll check auth on the server component level instead
  return NextResponse.next({
    request,
  })
}

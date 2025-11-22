import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("[v0] Admin login error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "Login failed" }, { status: 401 })
    }

    // Set session cookie
    const cookieStore = await cookies()
    if (data.session) {
      cookieStore.set("supabase-auth-token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("[v0] Admin login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

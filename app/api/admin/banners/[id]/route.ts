import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const body = await request.json()
  const { id } = await params
  const { title, type, media_url, position, is_active } = body

  console.log("[v0] PUT Banner ID:", id)

  const { data, error } = await supabase
    .from("banners")
    .update({ title, type, media_url, position, is_active })
    .eq("id", id)
    .select()

  if (error) {
    console.error("[v0] Update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  console.log("[v0] DELETE Banner ID:", id)

  const { error } = await supabase.from("banners").delete().eq("id", id)

  if (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

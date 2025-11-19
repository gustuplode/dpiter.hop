import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  
  const { error, data } = await supabase
    .from("category_products")
    .insert({
      brand: body.brand,
      title: body.title,
      price: body.price,
      image_url: body.image_url,
      affiliate_link: body.affiliate_link,
      category: body.category,
      is_visible: body.is_visible,
      slug: body.title.toLowerCase().replace(/\s+/g, "-"),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

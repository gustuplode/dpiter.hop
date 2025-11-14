import { createClient } from "@/lib/supabase/server"
import { notFound } from 'next/navigation'
import { BottomNav } from "@/components/bottom-nav"
import { FooterLinks } from "@/components/footer-links"
import type { Metadata } from "next"
import { CollectionContent } from "@/components/collection-content"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase.from("collections").select("title, brand").eq("id", id).single()

  if (!collection) {
    return {
      title: "Collection Not Found",
    }
  }

  return {
    title: `${collection.title} - ${collection.brand} | Dpiter`,
    description: `Shop the ${collection.title} collection from ${collection.brand}. Discover curated products and exclusive deals.`,
    openGraph: {
      title: `${collection.title} - ${collection.brand}`,
      description: `Shop the ${collection.title} collection from ${collection.brand}`,
    },
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single()

  if (!collection) {
    notFound()
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("collection_id", collection.id)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] dark:bg-[#1E293B]">
      <CollectionContent collection={collection} products={products || []} />
      <FooterLinks />
      <BottomNav />
    </div>
  )
}

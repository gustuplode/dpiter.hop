import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"

export default async function HomePage() {
  const supabase = await createClient()

  let collections: any[] = []
  let error = null

  try {
    const { data, error: fetchError } = await supabase
      .from("collections")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (fetchError) {
      error = fetchError
    } else {
      collections = data || []
    }
  } catch (e) {
    error = e
  }

  return (
    <div className="mx-auto max-w-sm bg-[#F8FAFC] dark:bg-[#1E293B] shadow-lg min-h-screen flex flex-col">
      <main className="flex-grow pb-20 px-2 pt-2">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400">Unable to load collections</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Please make sure the database tables are created.
            </p>
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`} className="flex flex-col">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    alt={collection.title}
                    className="w-full h-auto aspect-[3/4] object-cover"
                    src={collection.image_url || "/placeholder.svg?height=400&width=300"}
                  />
                  {collection.is_limited_time && (
                    <div className="absolute bottom-2 left-2 bg-[#F97316] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm inline-flex items-center gap-0.5 shadow">
                      <span className="material-symbols-outlined !text-[10px]">schedule</span>
                      LIMITED TIME
                    </div>
                  )}
                </div>
                <div className="pt-2 px-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase">
                        {collection.brand}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{collection.title}</p>
                    </div>
                    <button className="text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400">No collections available yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Collections will appear here once they are published
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

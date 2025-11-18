export function CollectionSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative overflow-hidden rounded-md bg-slate-200 dark:bg-slate-700 aspect-[3/4]">
        <div className="absolute top-1.5 right-1.5">
          <div className="h-6 w-6 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
      </div>
      <div className="pt-1.5 space-y-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
    </div>
  )
}

export function CollectionGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-1 md:gap-x-2 gap-y-2 md:gap-y-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <CollectionSkeleton key={i} />
      ))}
    </div>
  )
}

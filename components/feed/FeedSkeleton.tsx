export default function FeedSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 p-5">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          {/* Body Skeleton */}
          <div className="flex-grow space-y-3 px-5">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Footer Skeleton */}
          <div className="mt-5 flex items-center justify-between border-t border-gray-50 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function ScheduleSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Toolbar Skeleton */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Schedule Grid Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <div className="w-32 p-4">
                <Skeleton className="h-4 w-16" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-1 p-4 border-l border-gray-200">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>

            {/* Time Rows */}
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex border-b border-gray-100">
                <div className="w-32 p-4 border-r border-gray-200">
                  <Skeleton className="h-4 w-12" />
                </div>
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex-1 p-2 border-l border-gray-100"
                  >
                    {Math.random() > 0.6 && (
                      <Skeleton className="h-12 w-full rounded" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

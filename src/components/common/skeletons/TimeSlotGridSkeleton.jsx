import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

export function TimeSlotGridSkeleton({ courtName = "Loading Court..." }) {
  // Simular 7 días de la semana
  const days = Array.from({ length: 7 });
  // Simular ~12 time slots por día
  const timeSlots = Array.from({ length: 12 });

  return (
    <div className="max-w-[90rem] mx-auto">
      {/* Back button skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-gray-300 w-8 h-8" />
            <Skeleton className="h-9 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>

        {/* Time Slot Grid */}
        <div className="flex gap-0 overflow-x-auto pb-4">
          {days.map((_, dayIndex) => (
            <div key={dayIndex} className="min-w-[140px]">
              {/* Date Header Skeleton */}
              <div className="bg-gray-50 text-center p-4 rounded-2xl mb-4">
                <Skeleton className="h-3 w-12 mx-auto mb-2" />
                <Skeleton className="h-8 w-8 mx-auto" />
              </div>

              {/* Time Slots Skeleton */}
              <div className="space-y-2">
                {timeSlots.map((_, slotIndex) => (
                  <Skeleton
                    key={slotIndex}
                    className="w-full h-12 rounded-xl"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Confirm Button Skeleton */}
        <div className="mt-8 flex justify-end">
          <Skeleton className="h-14 w-56 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

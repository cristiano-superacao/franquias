import React from "react";

export function SkeletonBar({ width = "100%", height = 16 }: { width?: string | number; height?: number }) {
  return (
    <div
      className="animate-pulse rounded bg-gray-800"
      style={{ width, height }}
      aria-hidden
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="flex flex-col gap-3">
        <SkeletonBar width={120} height={14} />
        <SkeletonBar width={180} height={24} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="space-y-3">
        <SkeletonBar width={180} height={16} />
        <div className="grid grid-cols-6 gap-2 mt-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <SkeletonBar width={24} height={80 - (i % 4) * 12} />
              <SkeletonBar width={24} height={10} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

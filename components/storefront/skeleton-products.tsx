"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonProductCard() {
  return (
    <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full bg-white border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {/* Image Skeleton */}
          <Skeleton className="w-full h-full" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Discount Badge */}
          <div className="absolute top-3 right-3">
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 flex flex-col items-start space-y-4">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        
        {/* Colors */}
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="h-4 w-16" />
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-4 h-4 rounded-full" />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1 w-full">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-12 rounded-full" />
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-8" />
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between w-full pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16 mt-1" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  )
}
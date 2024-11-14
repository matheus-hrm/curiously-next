import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function MainPageSkeleton() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6 w-24 h-10 bg-gray-200 rounded animate-pulse">
            <ArrowLeft className="text-gray-300 h-4 w-4 ml-3 mt-3" />
          </div>
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            {/* Profile Sidebar Skeleton */}
            <div className="relative">
              <Card className="sticky top-8 backdrop-blur-lg bg-white/80 border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-32 w-32 mb-4 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-3/4 h-6 mb-2 bg-gray-200 rounded animate-pulse" />
                    <div className="w-1/2 h-4 mb-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
  
            {/* Questions Feed Skeleton */}
            <div className="relative">
              <Card className="backdrop-blur-lg bg-white/80 border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="mb-8 last:mb-0">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                          <div className="flex-1">
                            <div className="w-1/4 h-5 mb-1 bg-gray-200 rounded animate-pulse" />
                            <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded animate-pulse" />
                            <div className="flex items-center gap-4 mt-2">
                              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                            </div>
                          </div>
                        </div>
                        <div className="ml-12 pl-4 border-l">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                            <div className="flex-1">
                              <div className="w-1/4 h-5 mb-1 bg-gray-200 rounded animate-pulse" />
                              <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded animate-pulse" />
                              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
  
          {/* Floating Question Input Skeleton */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
            <Card className="backdrop-blur-lg bg-white/90 border-none shadow-lg">
              <CardContent className="p-4">
                <div className="w-full h-12 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
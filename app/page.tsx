"use client";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <InteractiveGridPattern
        width={120}
        height={80}
        squares={[12, 12]}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <Logo height="text-6xl" width="w-auto" />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mt-4">
            AI-Powered Lesson Planning for Modern Educators.
          </h1>
        </div>

        <Link href="/lesson-planner">
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Try Lesson Planner
            </span>
          </ShimmerButton>
        </Link>
      </div>
    </div>
  );
};

export default Home;

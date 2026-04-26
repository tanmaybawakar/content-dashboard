"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const isOnboarding = pathname === "/onboarding";

  useEffect(() => {
    if (isOnboarding) {
      setReady(true);
      return;
    }

    async function check() {
      try {
        const res = await fetch("/api/workspace");
        const data = await res.json();
        if (!data.onboardingComplete) {
          setNeedsOnboarding(true);
          router.replace("/onboarding");
        } else {
          setReady(true);
        }
      } catch {
        // If workspace check fails, assume onboarding needed
        setNeedsOnboarding(true);
        router.replace("/onboarding");
      }
    }
    check();
  }, [isOnboarding, router]);

  // Onboarding page renders without sidebar
  if (isOnboarding) {
    return <>{children}</>;
  }

  // While checking / redirecting, render nothing
  if (!ready || needsOnboarding) {
    return (
      <div className="min-h-screen bg-dreamscape flex items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

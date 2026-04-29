"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Building2, Map, ShieldCheck, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();

  const getStartedHref = session 
    ? (session.user.role === 'ADMIN' ? "/admin" : "/dashboard") 
    : "/register";

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-48 flex justify-center bg-gradient-to-b from-background to-muted/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_20%)] opacity-10"></div>
        <div className="container px-4 md:px-6 text-center flex flex-col items-center space-y-8 relative z-10">
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60 pb-2">
              Smart City Resource & Complaint Tracking
            </h1>
            <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl lg:text-2xl leading-relaxed">
              A modern, data-driven platform empowering citizens and administrators to build better cities together. Report issues, track progress, and analyze urban trends.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="h-14 px-10 text-lg shadow-xl hover:shadow-primary/20 transition-all gap-2" asChild>
              <Link href={getStartedHref}>
                {session ? "Enter Workspace" : "Get Started Now"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg shadow-sm" asChild>
              <Link href={session?.user.role === 'ADMIN' ? "/admin/analytics" : "/dashboard"}>
                View Stats
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 lg:py-32 flex justify-center bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Interactive Mapping</h3>
              <p className="text-muted-foreground">
                Visualize complaints on a real-time interactive heatmap. Pinpoint exact locations using GPS and Google Maps integration.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Secure portal with distinct roles. Citizens can report and track, while Admins manage assignments and status updates.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Powered by robust DBMS concepts. View real-time charts, category distributions, and monthly trends for data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-6 border-t flex justify-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} CityPulse System. All rights reserved. Built for DBMS Academic Project.
        </p>
      </footer>
    </div>
  );
}

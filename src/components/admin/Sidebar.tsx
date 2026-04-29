"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Map as MapIcon, 
  Users, 
  Settings,
  LogOut,
  Building2,
  Database,
  Activity,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const menuItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/admin", description: "System Overview" },
  { icon: FileText, label: "Incident Reports", href: "/admin/complaints", description: "Lifecycle Mgmt" },
  { icon: BarChart3, label: "Intelligence", href: "/admin/analytics", description: "Advanced BI" },
  { icon: MapIcon, label: "Geospatial", href: "/admin/map", description: "City Heatmaps" },
  { icon: Users, label: "Personnel", href: "/admin/users", description: "User Accounts" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-72 border-r bg-slate-950 text-slate-200 min-h-screen shadow-2xl">
      <div className="p-8 flex items-center gap-4 border-b border-white/5">
        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40 rotate-3">
          <Building2 className="h-6 w-6 text-primary-foreground -rotate-3" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-2xl tracking-tighter leading-none">CITYPULSE</span>
          <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mt-1">Admin Intel</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 py-4">
          Strategic Assets
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col gap-1 px-4 py-3 rounded-xl transition-all group relative overflow-hidden",
              pathname === item.href 
                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105 z-10" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  pathname === item.href ? "scale-110" : "group-hover:scale-125"
                )} />
                <span className="font-black text-sm uppercase tracking-tight">{item.label}</span>
              </div>
              <ChevronRight className={cn(
                "h-4 w-4 opacity-0 transition-all",
                pathname === item.href ? "opacity-100 translate-x-0" : "group-hover:opacity-100 -translate-x-2"
              )} />
            </div>
            <span className={cn(
              "text-[10px] font-bold ml-8 opacity-60",
              pathname === item.href ? "text-white" : "text-slate-500"
            )}>{item.description}</span>
            
            {pathname === item.href && (
               <div className="absolute top-0 left-0 w-1 h-full bg-white/40"></div>
            )}
          </Link>
        ))}

        <div className="mt-12 pt-8 border-t border-white/5 px-4 space-y-6">
           <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <span>DB Load</span>
                 <span className="text-primary">Normal</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full w-1/3 bg-primary"></div>
              </div>
           </div>
           <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <span>Uptime</span>
                 <span className="text-green-500">99.99%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full w-[99%] bg-green-500"></div>
              </div>
           </div>
        </div>
      </nav>

      <div className="p-6 border-t border-white/5 space-y-3 bg-white/2">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
          asChild
        >
          <Link href="/admin/settings">
            <Settings className="h-5 w-5" />
            <span className="font-bold text-xs uppercase tracking-widest">Configuration</span>
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-4 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl border border-transparent hover:border-red-400/10"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold text-xs uppercase tracking-widest">Terminate Session</span>
        </Button>
      </div>
    </div>
  );
}

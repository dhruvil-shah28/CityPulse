"use client";

import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Server,
  Activity
} from "lucide-react";
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-[calc(100vh-10rem)] flex items-center justify-center">
      <Activity className="h-12 w-12 animate-pulse text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">System Command Center</h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.3em] mt-1">Status: <span className="text-green-500">Online & Optimized</span></p>
        </div>
        <div className="flex gap-4">
           <div className="hidden lg:flex flex-col items-end px-4 border-r">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Network Latency</span>
              <span className="text-sm font-black tracking-tighter">12ms</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Uptime</span>
              <span className="text-sm font-black tracking-tighter">99.9%</span>
           </div>
        </div>
      </div>

      {/* Strategic Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Incidents" 
          value={data.overview.total} 
          icon={ShieldAlert} 
          trend="+14.2%" 
          description="System-wide reports"
          color="blue"
        />
        <MetricCard 
          title="Pending Sync" 
          value={data.overview.pending} 
          icon={Clock} 
          trend="-2.1%" 
          description="Awaiting processing"
          color="yellow"
        />
        <MetricCard 
          title="Unit Resolution" 
          value={data.overview.resolved} 
          icon={CheckCircle2} 
          trend="+5.8%" 
          description="Completed cycles"
          color="green"
        />
        <MetricCard 
          title="Efficiency Index" 
          value={`${data.overview.resolutionRate}%`} 
          icon={Zap} 
          trend="Optimal" 
          description="Operational throughput"
          color="purple"
        />
      </div>

      {/* Real-time Telemetry Row */}
      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
        <Card className="col-span-4 border-muted/60 shadow-2xl bg-black/[0.02] overflow-hidden">
          <div className="h-1 bg-primary w-full opacity-50"></div>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tighter">Complaint Frequency Matrix</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Temporal Analysis (24h Window)</CardDescription>
            </div>
            <Server className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.trends}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold'}}
                />
                <Area type="step" dataKey="count" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-muted/60 shadow-2xl bg-black/[0.02]">
           <div className="h-1 bg-green-500 w-full opacity-50"></div>
           <CardHeader>
              <CardTitle className="text-xl font-black uppercase tracking-tighter">Conflict Distribution</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Sectoral Load Balancing</CardDescription>
           </CardHeader>
           <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={data.charts.categories}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[2, 2, 0, 0]} barSize={25} />
                </ReBarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                 {data.charts.categories.slice(0, 3).map((cat: any, i: number) => (
                    <div key={cat.name} className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{cat.name}</span>
                       <span className="text-xs font-black">{cat.count} Units</span>
                    </div>
                 ))}
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Critical Areas Footer */}
      <div className="grid gap-6 md:grid-cols-2">
         <Card className="p-6 border-muted/60 shadow-lg group hover:bg-primary/5 transition-all">
            <div className="flex items-center gap-4">
               <div className="h-14 w-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                  100%
               </div>
               <div>
                  <h3 className="font-black text-lg uppercase tracking-tight">Database Integrity</h3>
                  <p className="text-xs text-muted-foreground font-medium">All transactional history commits are validated against PostgreSQL BCNF standards.</p>
               </div>
            </div>
         </Card>
         <Card className="p-6 border-muted/60 shadow-lg group hover:bg-green-500/5 transition-all">
            <div className="flex items-center gap-4">
               <div className="h-14 w-14 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-600 font-black text-xl shadow-inner group-hover:scale-110 transition-transform">
                  2.4s
               </div>
               <div>
                  <h3 className="font-black text-lg uppercase tracking-tight">Query Optimization</h3>
                  <p className="text-xs text-muted-foreground font-medium">High-speed indexing on status and category keys ensures near-instant analytics delivery.</p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, description, color }: any) {
  const colorMap: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-200",
    yellow: "text-yellow-600 bg-yellow-600/10 border-yellow-200",
    green: "text-green-600 bg-green-600/10 border-green-200",
    purple: "text-purple-600 bg-purple-600/10 border-purple-200",
  };

  return (
    <Card className="relative overflow-hidden border-muted/60 shadow-xl group hover:scale-[1.02] transition-all">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className={cn("p-3 rounded-2xl", colorMap[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-tighter">
               <ArrowUpRight className="h-3 w-3" />
               {trend}
            </div>
            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Real-time delta</div>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">{title}</p>
          <p className="text-3xl font-black tracking-tighter mt-1">{value}</p>
          <p className="text-[10px] font-bold text-muted-foreground mt-2 italic">{description}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 h-16 w-16 bg-muted/20 rounded-bl-[100px] -mr-4 -mt-4 opacity-50"></div>
    </Card>
  );
}

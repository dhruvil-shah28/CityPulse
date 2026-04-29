"use client";

import { useEffect, useState } from "react";
import { 
  ComposedChart,
  Area,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, TrendingUp, AlertTriangle, ShieldCheck, Zap, Layers } from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalytics() {
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
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Zap className="h-3 w-3" />
            Live Intelligence
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">System Intelligence Bureau</h1>
          <p className="text-muted-foreground text-lg">Multi-dimensional analysis of urban infrastructure and citizen feedback.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-6 py-2 bg-muted rounded-lg font-bold text-xs uppercase tracking-tighter hover:bg-muted/80 transition-all border shadow-sm">Audit Logs</button>
           <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs uppercase tracking-tighter shadow-xl shadow-primary/20 hover:scale-105 transition-all">Export BI Model</button>
        </div>
      </div>

      {/* Hero Analytics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 shadow-2xl border-muted/60 bg-gradient-to-br from-card to-muted/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black">Spatiotemporal Convergence</CardTitle>
              <CardDescription>Monthly complaint delta vs. Resolution velocity</CardDescription>
            </div>
            <Layers className="h-6 w-6 text-primary opacity-50" />
          </CardHeader>
          <CardContent className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.charts.trends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)'}}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={4} />
                <Bar dataKey="count" barSize={20} fill="#64748b" radius={[4, 4, 0, 0]} opacity={0.2} />
                <Line type="stepAfter" dataKey="count" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-2xl border-muted/60 overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="h-32 w-32" />
           </div>
           <CardHeader>
              <CardTitle className="text-xl font-black">Core KPI Matrix</CardTitle>
           </CardHeader>
           <CardContent className="space-y-8 relative z-10">
              <KPIMetric title="Resolution Velocity" value="84.2%" trend="+4.1%" icon={ShieldCheck} />
              <KPIMetric title="System Reliability" value="99.9%" trend="Stable" icon={Zap} />
              <KPIMetric title="Citizen Sentiment" value="High" trend="+12pts" icon={TrendingUp} />
              <div className="pt-4 border-t">
                 <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">Risk Assessment</p>
                 <div className="flex gap-2">
                    <div className="h-2 flex-1 bg-green-500 rounded-full"></div>
                    <div className="h-2 flex-1 bg-green-500 rounded-full"></div>
                    <div className="h-2 flex-1 bg-yellow-500 rounded-full"></div>
                    <div className="h-2 flex-1 bg-muted rounded-full"></div>
                 </div>
                 <p className="text-[10px] mt-2 text-yellow-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Moderate congestion in infrastructure sector
                 </p>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Advanced Distribution Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2 shadow-2xl border-muted/60">
           <CardHeader>
              <CardTitle className="text-xl font-bold">Category Resonance Profile</CardTitle>
           </CardHeader>
           <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.charts.categories}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar
                      name="Volume"
                      dataKey="count"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                 </RadarChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-2xl border-muted/60">
           <CardHeader>
              <CardTitle className="text-xl font-bold">Inertia Distribution</CardTitle>
           </CardHeader>
           <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={data.charts.status}
                      innerRadius={100}
                      outerRadius={130}
                      paddingAngle={10}
                      dataKey="value"
                      cornerRadius={10}
                    >
                      {data.charts.status.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="middle" align="right" layout="vertical" />
                 </PieChart>
              </ResponsiveContainer>
           </CardContent>
        </Card>
      </div>

      {/* Ranking & Density Row */}
      <Card className="shadow-2xl border-muted/60">
         <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-tighter">Hyper-Local Conflict density (Top problem areas)</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid md:grid-cols-5 gap-6 py-6">
               {data.charts.areas.map((area: any) => (
                 <div key={area.address} className="bg-muted/30 p-6 rounded-2xl border border-muted-foreground/10 hover:bg-primary hover:text-primary-foreground transition-all group">
                    <div className="text-4xl font-black opacity-20 mb-4 group-hover:opacity-40 tracking-tighter">0{area.rank}</div>
                    <div className="text-sm font-black mb-1 line-clamp-1">{area.address}</div>
                    <div className="text-xs opacity-60 mb-4 uppercase font-bold tracking-widest">Active Conflict Zone</div>
                    <div className="flex items-end justify-between">
                       <div className="text-2xl font-black">{area.count}</div>
                       <div className="h-8 w-12 flex items-end gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex-1 bg-current opacity-30" style={{ height: `${Math.random() * 100}%` }}></div>
                          ))}
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

function KPIMetric({ title, value, trend, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center border shadow-inner">
             <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
             <p className="text-xs font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{title}</p>
             <p className="text-2xl font-black tracking-tighter">{value}</p>
          </div>
       </div>
       <div className={`text-xs font-black ${trend.includes('+') ? 'text-green-500' : 'text-muted-foreground'}`}>
          {trend}
       </div>
    </div>
  )
}

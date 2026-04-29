import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { 
  PlusCircle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Activity,
  History
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch personal complaints
  const complaints = await prisma.complaint.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      category: true,
      statusHistory: {
        orderBy: {
          changedAt: 'desc'
        },
        take: 1
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Global counts for "System Sync" verification
  const globalCount = await prisma.complaint.count();
  const globalResolved = await prisma.complaint.count({ where: { status: 'RESOLVED' } });

  const isAdmin = session.user.role === 'ADMIN';

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Citizen Dashboard</h2>
          <p className="text-muted-foreground italic">
            {isAdmin ? "Logged in as Administrator (Personal Mode)" : `Welcome back, ${session.user.name}.`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Go to Command Center
              </Button>
            </Link>
          )}
          <Link href="/dashboard/new">
            <Button className="shadow-lg shadow-primary/20 gap-2">
              <PlusCircle className="h-4 w-4" />
              Report New Issue
            </Button>
          </Link>
        </div>
      </div>

      {isAdmin && (
        <Card className="bg-primary/10 border-primary/20 shadow-none">
          <CardContent className="py-3 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <Activity className="h-4 w-4 animate-pulse" />
              System Data Sync: Active
            </div>
            <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex gap-4">
               <span>Total City Reports: <span className="text-primary">{globalCount}</span></span>
               <span>Resolved City-wide: <span className="text-green-600">{globalResolved}</span></span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Reports" value={stats.total} icon={FileText} color="text-blue-500" />
        <StatCard title="Pending Review" value={stats.pending} icon={Clock} color="text-yellow-500" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Activity} color="text-orange-500" />
        <StatCard title="Resolved Issues" value={stats.resolved} icon={CheckCircle} color="text-green-500" />
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {/* Recent Activity / Complaints List */}
        <Card className="lg:col-span-2 shadow-sm border-muted/60">
          <CardHeader>
            <CardTitle>My Submissions</CardTitle>
            <CardDescription>
              Detailed view of issues you have reported.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {complaints.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
                <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg">No complaints found</h3>
                <p className="text-sm text-muted-foreground mb-6">You haven't reported any issues yet.</p>
                <Link href="/dashboard/new">
                  <Button variant="outline">Create your first report</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {complaints.map((c) => (
                  <div key={c.id} className="group border rounded-xl p-4 hover:border-primary/50 transition-all hover:bg-muted/5">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex gap-4">
                        {c.imageUrl ? (
                          <div className="h-16 w-16 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                            <img src={c.imageUrl} alt="issue" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{c.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">{c.category.name}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.address}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(c.createdAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-tight
                          ${c.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : ''}
                          ${c.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border border-blue-200' : ''}
                          ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-700 border border-green-200' : ''}
                          ${c.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-200' : ''}
                        `}>
                          {c.status.replace('_', ' ')}
                        </span>
                        {c.statusHistory[0]?.notes && (
                          <p className="text-[10px] text-muted-foreground italic text-right max-w-[200px]">
                            Last update: {c.statusHistory[0].notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="shadow-sm border-muted/60 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Track Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                     <History className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-xs">
                     <p className="font-bold mb-1">Live Status History</p>
                     <p className="text-muted-foreground leading-relaxed">The system now tracks every status change made by city administrators in real-time.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                     <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-xs">
                     <p className="font-bold mb-1">Resolution Feedback</p>
                     <p className="text-muted-foreground leading-relaxed">Once an issue is resolved, you will see administrator notes explaining the fix.</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-muted/60 overflow-hidden">
             <div className="h-2 bg-primary"></div>
             <CardHeader>
                <CardTitle className="text-lg">Resolution Efficiency</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Overall Completion</span>
                      <span className="font-bold">{stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(0) : 0}%</span>
                   </div>
                   <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                      ></div>
                   </div>
                   <p className="text-[10px] text-muted-foreground text-center">Data based on your personal submission history.</p>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="shadow-sm border-muted/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

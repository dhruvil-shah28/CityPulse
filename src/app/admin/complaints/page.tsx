"use client";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const STATUS_COLORS: any = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  RESOLVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

export default function ComplaintsManagement() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const res = await fetch("/api/admin/complaints");
    const data = await res.json();
    setComplaints(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/complaints/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.address?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
          <p className="text-muted-foreground">Review, assign, and update status of reported issues.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or area..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
             <select 
               className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
             >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
             </select>
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3">ID / Date</th>
                <th className="px-4 py-3">Complaint Info</th>
                <th className="px-4 py-3">Area / Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center">Loading complaints...</td></tr>
              ) : filteredComplaints.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No complaints found.</td></tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 align-top">
                      <div className="font-mono text-xs text-muted-foreground mb-1">#{c.id.slice(0, 8)}</div>
                      <div className="text-xs">{format(new Date(c.createdAt), "MMM d, yyyy")}</div>
                    </td>
                    <td className="px-4 py-4 align-top max-w-md">
                      <div className="font-semibold mb-1">{c.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{c.description}</div>
                      {c.imageUrl && (
                        <div className="mt-2 h-10 w-16 rounded overflow-hidden border bg-muted flex items-center justify-center">
                           <img src={c.imageUrl} alt="preview" className="object-cover h-full w-full" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 align-top">
                       <div className="text-xs font-medium">{c.address || "Pune City"}</div>
                       <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                       </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                       <div className={`inline-flex items-center px-2 py-1 rounded-full border text-[10px] font-bold uppercase ${STATUS_COLORS[c.status]}`}>
                          {c.status.replace('_', ' ')}
                       </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                       <div className="flex items-center gap-2">
                          <select 
                            className="text-xs font-semibold border rounded-md px-2 py-1 bg-background hover:bg-muted transition-colors focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                            value={c.status}
                            onChange={(e) => updateStatus(c.id, e.target.value)}
                          >
                             <option value="PENDING" className="text-yellow-600 font-bold">Pending</option>
                             <option value="IN_PROGRESS" className="text-blue-600 font-bold">In Progress</option>
                             <option value="RESOLVED" className="text-green-600 font-bold">Resolved</option>
                             <option value="REJECTED" className="text-red-600 font-bold">Rejected</option>
                          </select>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                             <MoreVertical className="h-4 w-4" />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const LeafletMap = dynamic(() => import("@/components/maps/AdminLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted min-h-[600px]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

export default function AdminMapView() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/complaints")
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Geospatial Analytics</h1>
          <p className="text-muted-foreground">Visualize complaint density and distribution across the city.</p>
        </div>
        <div className="flex items-center gap-4 bg-card border px-4 py-2 rounded-lg shadow-sm">
           <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-xs font-medium">Pending</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs font-medium">In Progress</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-xs font-medium">Resolved</span>
           </div>
        </div>
      </div>

      <Card className="overflow-hidden border-muted/60 shadow-lg">
        <div className="h-[700px] w-full relative z-0">
          <LeafletMap complaints={complaints} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
         <Card className="p-4 flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
               <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
               <p className="text-sm font-semibold">Coordinate Precision</p>
               <p className="text-xs text-muted-foreground">Capturing 100% of reported issues with exact GPS coordinates.</p>
            </div>
         </Card>
         <Card className="p-4 flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
               <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
               <p className="text-sm font-semibold">High Density Clusters</p>
               <p className="text-xs text-muted-foreground">Identifying zones with multiple reports for infrastructure optimization.</p>
            </div>
         </Card>
      </div>
    </div>
  );
}

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { format } from "date-fns";

// Custom icons based on status
const createIcon = (color: string) => L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const icons: any = {
  PENDING: createIcon("#f59e0b"),
  IN_PROGRESS: createIcon("#3b82f6"),
  RESOLVED: createIcon("#10b981"),
  REJECTED: createIcon("#ef4444")
};

export default function AdminLeafletMap({ complaints }: { complaints: any[] }) {
  const puneCenter: [number, number] = [18.5204, 73.8567];

  return (
    <MapContainer
      center={puneCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {complaints.map((c) => (
        <Marker 
          key={c.id} 
          position={[c.lat, c.lng]} 
          icon={icons[c.status] || icons.PENDING}
        >
          <Popup className="custom-popup">
            <div className="p-1 space-y-2 w-48">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-bold text-muted-foreground uppercase">{c.category.name}</span>
                 <span className="text-[10px] font-mono">#{c.id.slice(0, 5)}</span>
              </div>
              <h4 className="font-bold text-sm leading-tight">{c.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
              {c.imageUrl && (
                <img src={c.imageUrl} alt="preview" className="w-full h-24 object-cover rounded mt-1" />
              )}
              <div className="pt-2 flex items-center justify-between border-t border-muted">
                 <span className="text-[10px] text-muted-foreground">{format(new Date(c.createdAt), "MMM d")}</span>
                 <span className="text-[10px] font-bold text-primary">{c.status}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

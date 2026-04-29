"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Image as ImageIcon, X, Loader2 } from "lucide-react";

// Dynamically import the map to avoid SSR errors
const LeafletMap = dynamic(() => import("@/components/maps/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

const PUNE_CENTER = {
  lat: 18.5204,
  lng: 73.8567
};

export function ComplaintForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map state
  const [markerPosition, setMarkerPosition] = useState(PUNE_CENTER);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const address = formData.get("address") as string;
    
    try {
      let imageUrl = null;

      // 1. Upload image to local server if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.message || "Failed to upload image");
        }

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // 2. Submit complaint
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          categoryId, 
          description, 
          address, 
          lat: markerPosition.lat, 
          lng: markerPosition.lng,
          imageUrl 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit complaint");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input id="title" name="title" required placeholder="E.g., Large pothole on Main St" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <select 
              id="categoryId" 
              name="categoryId" 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="" disabled selected>Select category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Provide more details about the issue..."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2">
          <Label>Location (Pune)</Label>
          <div className="flex gap-2">
            <Input 
              id="address" 
              name="address" 
              required 
              placeholder="Enter exact address or landmark" 
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">Click on the map to pin the exact location (OSM Leaflet)</p>
          <div className="h-[300px] rounded-lg bg-muted border overflow-hidden mt-2 relative z-0">
            <LeafletMap position={markerPosition} setPosition={setMarkerPosition} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Photo Evidence (Optional)</Label>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
          />
          
          {previewUrl ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <ImageIcon className="h-8 w-8 mb-2" />
              <p className="text-sm font-medium">Click to upload photo locally</p>
              <p className="text-xs">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={loading}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </form>
  );
}

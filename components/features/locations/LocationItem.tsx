"use client";

import { MapPin, Phone } from "lucide-react";
import { VaccineLocation } from "@/lib/amap";

interface LocationItemProps {
  location: VaccineLocation;
  isSelected: boolean;
  onSelect: () => void;
}

export function LocationItem({ location, isSelected, onSelect }: LocationItemProps) {
  // 格式化距离显示
  const formatDistance = (meters: number) => {
    return meters < 1000
      ? `${meters}米`
      : `${(meters / 1000).toFixed(1)}公里`;
  };

  return (
    <div
      className={`p-5 border-b border-slate-100 last:border-0 interactive hover:bg-slate-50/80 cursor-pointer ${
        isSelected ? "bg-sky-50/80 backdrop-blur-sm" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium tracking-tight">{location.name}</h3>
        <span className="text-xs bg-white/70 backdrop-blur-sm text-slate-500 rounded-full px-2.5 py-0.5 border border-slate-100/50">
          {formatDistance(location.distance)}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
        <MapPin size={14} />
        <span className="truncate">{location.address}</span>
      </div>
      
      {location.tel && (
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
          <Phone size={14} />
          <a 
            href={`tel:${location.tel}`} 
            className="text-sky-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {location.tel}
          </a>
        </div>
      )}
    </div>
  );
} 
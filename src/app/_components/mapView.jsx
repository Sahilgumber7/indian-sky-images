"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";

export default function MapView({ dialogOpen, darkMode }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const { data, error } = await supabase.from("images").select("*");
      if (!error) setImages(data);
    }
    fetchImages();
  }, []);

  // Tile URLs for light & dark mode
  const lightMap = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkMap = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className="w-full h-full">
        <TileLayer url={darkMode ? darkMap : lightMap} />

        {images.map((img) => {
          const customIcon = new L.DivIcon({
            className: "custom-marker",
            html: `<div class="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-md">
                     <img src="${img.image_url}" class="w-full h-full object-cover scale-150" />
                   </div>`,
            iconSize: [64, 64],
            iconAnchor: [24, 24],
          });

          return (
            <Marker key={img.id} position={[img.latitude, img.longitude]} icon={customIcon}>
              <Popup className="custom-popup">
                <div
                  className="p-3 rounded-md max-w-xs sm:max-w-sm w-full"
                  style={{
                    backgroundColor: darkMode ? "#1F2937" : "#FFFFFF", // Dark: gray-900, Light: white
                    color: darkMode ? "#FFFFFF" : "#000000", // Dark: white text, Light: black text
                    borderRadius: "8px",
                    boxShadow: "none", // Remove default shadow
                  }}
                >
                  <img
                    src={img.image_url}
                    alt="Sky"
                    className="w-full h-48 sm:h-80 rounded-md object-cover"
                  />
                  <p className="text-xs sm:text-sm mt-2 text-center">
                    📍 {img.latitude}, {img.longitude}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Overlay to disable map interactions when dialog is open */}
      {dialogOpen && <div className="absolute inset-0 bg-black/30 z-20 pointer-events-auto" />}
    </div>
  );
}

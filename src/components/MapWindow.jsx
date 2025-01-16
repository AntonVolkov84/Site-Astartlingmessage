import React, { useState, useCallback } from "react";
import { AdvancedMarker, useAdvancedMarkerRef, APIProvider, Map } from "@vis.gl/react-google-maps";

function MapWindow({ onLocationSelect }) {
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [position, setPosition] = useState({ lat: 44.95, lng: 34.113 });

  const onMapClick = useCallback(
    (event) => {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      onLocationSelect({ lat, lng });
      setPosition({ lat, lng });
    },
    [onLocationSelect]
  );

  return (
    <APIProvider apiKey={googleMapsApiKey}>
      <Map
        style={{ width: "400px", height: "400px" }}
        onClick={onMapClick}
        defaultCenter={position}
        defaultZoom={8}
        gestureHandling={"greedy"}
        mapId="DEMO_MAP_ID"
      >
        <AdvancedMarker position={position} />
      </Map>
    </APIProvider>
  );
}

export default MapWindow;

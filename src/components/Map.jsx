import React, { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function Map({ onLocationSelect }) {
  const [marker, setMarker] = useState(null);

  const center = {
    lat: 44.95,
    lng: 34.113,
  };
  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  const onMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarker({ lat, lng });
      onLocationSelect({ lat, lng });
    },
    [onLocationSelect]
  );
  return (
    <LoadScript googleMapsApiKey="AIzaSyCova5T_D9lpjyeCw3hCef_YEN-oQApr-o">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5} onClick={onMapClick}>
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;

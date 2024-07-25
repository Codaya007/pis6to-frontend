import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import 'leaflet-draw';

function MapWithDrawNodes({ onMarkerDrawn, markerRef, latitude, longitude }) {
  const map = useMap();
  const [currentMarker, setCurrentMarker] = useState(null);
  const markersLayerRef = useRef();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    markersLayerRef.current = drawnItems;

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: true,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        edit: false,
        remove: false,
      },
    });

    map.addControl(drawControl);

    const handleDrawnMarker = (e) => {
      const { layer } = e;

      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      if (currentMarker) {
        map.removeLayer(currentMarker);
      }

      layer.addTo(map);
      setCurrentMarker(layer);
      onMarkerDrawn(layer.toGeoJSON());
    };

    if (latitude !== null && longitude !== null) {
      // If latitude or longitude props change, update the marker position
      if (currentMarker) {
        currentMarker.setLatLng([latitude, longitude]);
      } else {
        const marker = L.marker([latitude, longitude]);

        marker.addTo(map);
        setCurrentMarker(marker);
      }
    }

    map.on(L.Draw.Event.CREATED, handleDrawnMarker);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, handleDrawnMarker);
    };
  }, [map, onMarkerDrawn, currentMarker, latitude, longitude]);

  return null;
}

export default MapWithDrawNodes;

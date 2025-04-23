import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { io } from 'socket.io-client';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const DriverMap = () => {
  const [driverLocations, setDriverLocations] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [map, setMap] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading,setLoading] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCYZRUs6fc11sggOvemaWnhFIdHxu9rpvA",
    libraries: ['places'],
    id: 'google-map-script'
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // Fetch drivers and setup socket listeners
  useEffect(() => {
    if (!socket || !isLoaded) return;

    const fetchOnlineDrivers = async () => {
      try {
        const response = await fetch('/api/location/online');
        const data = await response.json();
        setDriverLocations(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchOnlineDrivers();

    // socket.on('driver:went-offline', () => {
    //     console.log("offline------------user");
        
    //   });

    socket.on('driver:location-updated', (updatedDriver) => {
      setDriverLocations(prev => {
        const existingIndex = prev.findIndex(d => d.driverId === updatedDriver.driverId);
        if (existingIndex >= 0) {
          const newLocations = [...prev];
          newLocations[existingIndex] = updatedDriver;
          return newLocations;
        }
        return [...prev, updatedDriver];
      });
    });

    setLoading(true)

    return () => {
      socket.off('driver:location-updated');
    };
  }, [socket, isLoaded]);

  // Fit bounds when drivers or map changes
  useEffect(() => {
    if (map && driverLocations.length > 0 && isLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      driverLocations.forEach(driver => {
        bounds.extend({
          lat: driver.location.coordinates[1],
          lng: driver.location.coordinates[0]
        });
      });
      map.fitBounds(bounds);
    }
  }, [map, driverLocations, isLoaded]);

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="relative w-full h-full">
      {loading && (<GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={{ lat: 7.016221, lng: 79.954681 }}
        onClick={() => setSelectedDriver(null)}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >

        {/* Dynamic driver markers */}
        {driverLocations.map(driver => (
          <Marker
            key={driver.driverId}
            position={{
              lat: driver.location.coordinates[1],
              lng: driver.location.coordinates[0]
            }}
            onClick={() => setSelectedDriver(driver)}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(32, 32)
            }}
          />
        ))}

        {selectedDriver && (
          <InfoWindow
            position={{
              lat: selectedDriver.location.coordinates[1],
              lng: selectedDriver.location.coordinates[0]
            }}
            onCloseClick={() => setSelectedDriver(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg">{selectedDriver.name}</h3>
              <p className="text-gray-600">Vehicle: {selectedDriver.vehicleType}</p>
              <p className="text-green-500 font-medium">Status: Online</p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(selectedDriver.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>)}
    </div>
  );
};

export default DriverMap;
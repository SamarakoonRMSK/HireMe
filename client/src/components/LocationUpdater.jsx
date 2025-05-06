import { useEffect } from 'react';
import { io } from 'socket.io-client';

const LocationUpdater = ({ driverId, name,role }) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      return;
    }

    const socket = io('http://localhost:3000', {
      query: { driverId }
    });

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('driver:update-location', {
          name,
          lat: latitude,
          lng: longitude,
          role,
        });
      },
      (err) => console.error('Geolocation error:', err),
      { 
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    );

    // Set initial online status
    // socket.emit('driver:update-location', {
    //   name,
    //   lat: 0,
    //   lng: 0
    // });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
    };
  }, [driverId, name]);

  return null;
};

export default LocationUpdater;
import { useState, useEffect, useRef } from 'react';
import { Alert, Button, Textarea, TextInput, Checkbox, Label, Select } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiLocationMarker } from 'react-icons/hi';

export default function CreatePost() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [distance, setDistance] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [mapError, setMapError] = useState(null);
  const { currentUser } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  useEffect(() => {
    // Function to initialize Google Maps
    const initGoogleMaps = () => {
      if (window.google && window.google.maps && mapRef.current) {
        // Initialize Autocomplete
        const fromAutocomplete = new window.google.maps.places.Autocomplete(fromInputRef.current, {
          types: ['geocode'],
        });
        const toAutocomplete = new window.google.maps.places.Autocomplete(toInputRef.current, {
          types: ['geocode'],
        });

        fromAutocomplete.addListener('place_changed', () => {
          const place = fromAutocomplete.getPlace();
          if (place.geometry) {
            setFormData((prev) => ({
              ...prev,
              from: place.formatted_address,
              fromLat: place.geometry.location.lat(),
              fromLng: place.geometry.location.lng(),
            }));
          }
        });

        toAutocomplete.addListener('place_changed', () => {
          const place = toAutocomplete.getPlace();
          if (place.geometry) {
            setFormData((prev) => ({
              ...prev,
              to: place.formatted_address,
              toLat: place.geometry.location.lat(),
              toLng: place.geometry.location.lng(),
            }));
          }
        });

        // Initialize Map
        try {
          googleMapRef.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: 6.9271, lng: 79.8612 }, // Default: Colombo, Sri Lanka
            zoom: 12,
            styles: [
              { featureType: 'all', elementType: 'labels', stylers: [{ visibility: 'on' }] },
              { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#dfe6e9' }] },
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#74b9ff' }] },
            ],
          });

          directionsServiceRef.current = new window.google.maps.DirectionsService();
          directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            map: googleMapRef.current,
            suppressMarkers: false,
            polylineOptions: { strokeColor: '#3b82f6', strokeWeight: 6 },
          });

          setMapError(null);
        } catch (error) {
          setMapError('Failed to initialize map. Please try again.');
        }
      } else {
        setMapError('Google Maps API not loaded. Please check your API key and internet connection.');
      }
    };

    // Check if Google Maps is loaded, retry if not
    if (!window.google || !window.google.maps) {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          initGoogleMaps();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      initGoogleMaps();
    }

    // Set user's current location
    if (currentUser.lat && currentUser.lon) {
      setFormData((prev) => ({
        ...prev,
        from: 'Current Location',
        fromLat: currentUser.lat,
        fromLng: currentUser.lon,
      }));
      fromInputRef.current.value = 'Current Location';
      if (googleMapRef.current) {
        googleMapRef.current.setCenter({ lat: currentUser.lat, lng: currentUser.lon });
      }
    }
  }, []);

  console.log("formdata",formData);
  
  // Trigger distance and route calculation when coordinates change
  useEffect(() => {
    if (formData.fromLat && formData.fromLng && formData.toLat && formData.toLng) {
      calculateDistanceAndRoute();
    }
  }, [formData.fromLat, formData.fromLng, formData.toLat, formData.toLng]);

  const calculateDistanceAndRoute = () => {
    if (formData.fromLat && formData.fromLng && formData.toLat && formData.toLng) {
      const origin = { lat: formData.fromLat, lng: formData.fromLng };
      const destination = { lat: formData.toLat, lng: formData.toLng };

      // Calculate Distance
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
            const distanceText = response.rows[0].elements[0].distance.text;
            const distanceValue = response.rows[0].elements[0].distance.value / 1000; // Convert to km
            setDistance(distanceText);
            setFormData((prev) => ({ ...prev, distance: distanceValue }));
            calculateMinPrice(distanceValue, formData.hiringDays || 0, formData.hiringHours || 0);
          } else {
            setDistance('Unable to calculate distance');
          }
        }
      );

      // Display Route on Map
      if (directionsServiceRef.current && directionsRendererRef.current) {
        directionsServiceRef.current.route(
          {
            origin,
            destination,
            travelMode: 'DRIVING',
          },
          (result, status) => {
            if (status === 'OK') {
              directionsRendererRef.current.setDirections(result);
              googleMapRef.current.fitBounds(result.routes[0].bounds);
            }
          }
        );
      }
    }
  };

  const calculateMinPrice = (distance, days, hours) => {
    const baseFare = 200;
    const perKm = 50;
    const perHour = 100;
    const totalHours = parseInt(days) * 24 + parseInt(hours);
    const price = baseFare + distance * perKm + totalHours * perHour;
    setMinPrice(price.toFixed(2));
    setFormData((prev) => ({ ...prev, minPrice: price.toFixed(2) }));
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, return: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/create/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/vacancy/${data._id}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  }; 

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto min-h-screen ">
      <h1 className="text-center text-4xl font-bold text-gray-800 mb-8">Create Job Vacancy</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Job Details</h2>
          <div className="grid gap-4">
            <TextInput
              type="text"
              placeholder="Job Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              addon={<span className="text-gray-500">Title</span>}
            />
            <Textarea
              id="description"
              placeholder="Job Description"
              rows={4}
              className="resize-none"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Trip Details</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <TextInput
              type="text"
              placeholder="From (e.g., city, address, or Current Location)"
              required
              id="from"
              className="flex-1"
              ref={fromInputRef}
              onChange={(e) => {
                if (e.target.value !== 'Current Location') {
                  setFormData({ ...formData, from: e.target.value });
                }
              }}
              icon={HiLocationMarker}
            />
            <TextInput
              type="text"
              placeholder="To (e.g., city, address)"
              required
              id="to"
              className="flex-1"
              ref={toInputRef}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              icon={HiLocationMarker}
            />
          </div>
          {distance && (
            <div className="text-sm text-gray-600 mb-4">Distance: {distance}</div>
          )}
          {mapError ? (
            <Alert color="failure" className="mb-4">
              {mapError}
            </Alert>
          ) : (
            <div ref={mapRef} id="map"></div>
          )}
          <div className="flex items-center mt-4">
            <Checkbox id="return" onChange={handleCheckboxChange} />
            <Label className="ml-2 text-gray-600">Return to start place</Label>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Schedule & Duration</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput
              type="datetime-local"
              required
              id="bookingDateTime"
              className="flex-1"
              onChange={(e) => setFormData({ ...formData, bookingDateTime: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                type="number"
                placeholder="Hiring Days"
                required
                id="hiringDays"
                min="0"
                className="flex-1"
                onChange={(e) => {
                  setFormData({ ...formData, hiringDays: e.target.value });
                  calculateMinPrice(formData.distance || 0, e.target.value, formData.hiringHours || 0);
                }}
              />
              <TextInput
                type="number"
                placeholder="Hiring Hours"
                required
                id="hiringHours"
                min="0"
                max="23"
                className="flex-1"
                onChange={(e) => {
                  setFormData({ ...formData, hiringHours: e.target.value });
                  calculateMinPrice(formData.distance || 0, formData.hiringDays || 0, e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        {/* Vehicle & Pricing Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Vehicle & Pricing</h2>
          <div className="grid gap-4">
            <Select
              id="vType"
              required
              onChange={(e) => setFormData({ ...formData, vType: e.target.value })}
            >
              <option value="">Select vehicle type</option>
              <option value="Bike">Bike</option>
              <option value="Rickshaw">Rickshaw</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
              <option value="Truck">Truck</option>
            </Select>
            <TextInput
              type="number"
              placeholder="Price (Rs.)"
              required
              id="price"
              min={ parseInt(minPrice)}
              className="flex-1"
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              addon="Rs."
            />
            {minPrice && (
              <div className="text-sm text-blue-600">Minimum Suggested Price: Rs. {minPrice}</div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          size="lg"
          className="w-full sm:w-auto"
        >
          Publish Job
        </Button>
      </form>
      {publishError && (
        <Alert className="mt-6" color="failure">
          {publishError}
        </Alert>
      )}
    </div>
  );
}
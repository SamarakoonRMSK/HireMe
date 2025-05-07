import { Card, Button, Alert, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiLocationMarker, HiClock, HiCurrencyDollar, HiTruck } from 'react-icons/hi';

export default function DashDriverHires() {
  const { currentUser } = useSelector((state) => state.userSlice);
  const [userHires, setUserHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHires = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/hire/getdriverhires/${currentUser._id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch hires');
        }
        setUserHires(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser && currentUser.role === "driver") {
      fetchHires();
    }
  }, [currentUser]);

  const handleNotifyCustomer = async (hireId) => {
    try {
      const res = await fetch(`/api/hire/notify-complete/${hireId}/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to notify customer');
        return;
      }
      setUserHires(userHires.map((hire) =>
        hire._id === hireId ? { ...hire, status: 'Completed' } : hire
      ));
      setError(null);
    } catch (error) {
      setError('Failed to notify customer. Please try again.');
    }
  };

  // Format booking date and time
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  // Calculate duration text
  const getDurationText = (days, hours) => {
    const dayText = days ? `${days} day${days > 1 ? 's' : ''}` : '';
    const hourText = hours ? `${hours} hour${hours > 1 ? 's' : ''}` : '';
    return [dayText, hourText].filter(Boolean).join(' and ');
  };

  return (
    <div className="p-4 sm:p-6 w-full min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Your Hires
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <Alert color="failure" className="mb-6 w-full max-w-4xl mx-auto">
          {error}
        </Alert>
      ) : userHires.length === 0 ? (
        <Card className="border border-gray-200 shadow-sm w-full max-w-4xl mx-auto">
          <p className="text-gray-500 text-center text-sm sm:text-base">
            You have no active hires.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {userHires.map((hire) => (
            <Card key={hire._id} className="border border-gray-200 shadow-sm w-full">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                Trip from {hire.from} to {hire.to}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <HiLocationMarker className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">From</p>
                    <p className="text-gray-600">{hire.from}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiLocationMarker className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">To</p>
                    <p className="text-gray-600">{hire.to}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiClock className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">Start Date & Time</p>
                    <p className="text-gray-600">{formatDateTime(hire.bookingDateTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiClock className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">Duration</p>
                    <p className="text-gray-600">{getDurationText(hire.hiringDays, hire.hiringHours)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiTruck className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">Vehicle Type</p>
                    <p className="text-gray-600">{hire.vType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiCurrencyDollar className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">Price</p>
                    <p className="text-gray-600">Rs. {hire.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiLocationMarker className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">Distance</p>
                    <p className="text-gray-600">{hire.distance.toFixed(1)} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiLocationMarker className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">Return Trip</p>
                    <p className="text-gray-600">{hire.return ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiClock className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">Status</p>
                    <p className="text-gray-600">{hire.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiCurrencyDollar className="text-blue-500 text-lg sm:text-xl" />
                  <div>
                    <p className="font-medium text-gray-700">Payment Status</p>
                    <p className="text-gray-600">{hire.paymentStatus}</p>
                  </div>
                </div>
              </div>
              {hire.status === 'Accepted' && (
                <div className="mt-4">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    onClick={() => handleNotifyCustomer(hire._id)}
                  >
                    Notify Customer (Work Completed)
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
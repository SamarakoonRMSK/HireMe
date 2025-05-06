import { Button, Table, Alert, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiClock, HiLocationMarker, HiCurrencyDollar, HiTruck } from "react-icons/hi";

export default function VacancyPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [applyError, setApplyError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const { currentUser } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          return;
        }
        setPost(data.posts[0]);
      } catch (error) {
        console.error(error);
      }
    };
    getPost();
  }, [postId]);

  const handleApply = async () => {
    const userData = {
      userId: currentUser._id,
      image: currentUser.profilePicture,
      email: currentUser.email,
      username: currentUser.username,
      rating: currentUser?.rate.length>0 ? parseFloat((currentUser?.rate?.reduce((a, b) => a + b) / currentUser.rate?.length).toFixed(2)) : 0.00
};
    try {
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setApplyError(data.message);
        return;
      }
      setPost(data);
      setApplyError(null);
    } catch (error) {
      setApplyError("Failed to apply. Please try again.");
    }
  };

  const hireDriver = async (driverId) => {
    try {
      const hireData = {
        from: post.from,
        to: post.to,
        hiringDays: post.hiringDays,
        hiringHours: post.hiringHours,
        vType: post.vType,
        price: post.price,
        postId: post._id,
        return: post.return,
        bookingDateTime: post.bookingDateTime,
      };
      const res = await fetch(
        `/api/hire/create/${currentUser._id}/${driverId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hireData),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.message);
        return;
      }
      setCreateError(null);
      navigate("/dashboard?tab=jobs");
    } catch (error) {
      setCreateError("Failed to hire driver. Please try again.");
    }
  };

  // Format booking date and time
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Calculate total duration
  const getDurationText = (days, hours) => {
    const dayText = days ? `${days} day${days > 1 ? "s" : ""}` : "";
    const hourText = hours ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
    return [dayText, hourText].filter(Boolean).join(" and ");
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto min-h-screen ">
      {post ? (
        <div className="space-y-6">
          {/* Header Section */}
          <Card className="border border-gray-200 shadow-sm">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {post.title}
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              {post.description}
            </p>
          </Card>

          {/* Hire Details Section */}
          <Card className="border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Job Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <HiLocationMarker className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">From</p>
                  <p className="text-gray-600">{post.from}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">To</p>
                  <p className="text-gray-600">{post.to}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiClock className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Start Date & Time</p>
                  <p className="text-gray-600">{formatDateTime(post.bookingDateTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiClock className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Duration</p>
                  <p className="text-gray-600">{getDurationText(post.hiringDays, post.hiringHours)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiTruck className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Vehicle Type</p>
                  <p className="text-gray-600">{post.vType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiCurrencyDollar className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Price</p>
                  <p className="text-gray-600">Rs. {post.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiCurrencyDollar className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Minimum Price</p>
                  <p className="text-gray-600">Rs. {post.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Distance</p>
                  <p className="text-gray-600">{post.distance.toFixed(1)} km</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-700">Return Trip</p>
                  <p className="text-gray-600">{post.return ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Section for Drivers */}
          {currentUser && currentUser.role === "driver" && (
            <Card className="border border-gray-200 shadow-sm">
              <Button
                gradientDuoTone="purpleToBlue"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleApply}
              >
                Apply for Job
              </Button>
              {applyError && (
                <Alert color="failure" className="mt-4">
                  {applyError}
                </Alert>
              )}
            </Card>
          )}

          {/* Applicants Section */}
          <Card className="border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Applicants</h2>
            {post && post.applicants.length > 0 ? (
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Profile</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Rating</Table.HeadCell>
                  {currentUser && currentUser.role === "customer" && (
                    <>
                    <Table.HeadCell>View</Table.HeadCell>
                    <Table.HeadCell>Action</Table.HeadCell>
                    </>
                  )}
                </Table.Head>
                <Table.Body className="divide-y">
                  {post.applicants.map((user) => (
                    <Table.Row
                      key={user.userId}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell>
                        <img
                          src={user.image}
                          alt={user.username}
                          className="w-10 h-10 object-cover rounded-full bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900">
                        {user.username}
                      </Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{user.rating}</Table.Cell>
                      {currentUser && currentUser.role === "customer" && (
                        <>
                        <Table.Cell>
                          <Link to={`/driver/${user.userId}`} >
                          <Button
                            size="sm"
                            gradientDuoTone="cyanToBlue"
                          >
                            View
                          </Button>
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="sm"
                            gradientDuoTone="cyanToBlue"
                            onClick={() => hireDriver(user.userId)}
                          >
                            Hire
                          </Button>
                        </Table.Cell>
                        </>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <p className="text-gray-500">No applicants yet.</p>
            )}
            {createError && (
              <Alert color="failure" className="mt-4">
                {createError}
              </Alert>
            )}
          </Card>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">
          Loading job details...
        </div>
      )}
    </div>
  );
}
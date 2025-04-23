import { Avatar, Rating, Badge, Tabs, TabItem, Button, Card } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaCar, FaMotorcycle, FaShuttleVan, FaBiking } from 'react-icons/fa';
import { HiDocumentDownload, HiCheckCircle, HiMail, HiLocationMarker, HiCalendar } from 'react-icons/hi';
import { Link, useParams } from 'react-router-dom';




export default function Driver() {
    const { driverId } = useParams();
    const [driver,setDriver] = useState(null);
    const [reviews,setReviews] = useState([]);
    // const [location,setLocation] = useState([]);

    useEffect(()=>{
        const getDriver = async()=>{
            const res = await fetch(`/api/user/driver/${driverId}`);
            const data = await res.json();
            if (!res.ok) {
                return;
              } else {
                setDriver(data);
              }
        }
        const getReviews = async()=>{
            const res = await fetch(`/api/hire/getcompletedriverFeedback/${driverId}`);
            const data = await res.json();
            if (!res.ok) {
                return;
              } else {
                setReviews(data);
              }

        }

        getDriver();
        getReviews();
    },[driverId])



    console.log(location);
    

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      {driver &&
        <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Profile Card */}
          <Card className="w-full md:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col items-center p-6">
              <div className="relative mb-4">
                <Avatar
                  img={driver.profilePicture}
                  alt={driver.fullName}
                  size="xl"
                  rounded
                  bordered
                  className="pt-5"
                />
                {driver.isVerify && (
                  <Badge
                    icon={HiCheckCircle}
                    color="success"
                    className="absolute -bottom-2 -right-2"
                  >
                    Verified
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{driver.fullName}</h2>
              <p className="text-purple-600 font-medium">{driver.role}</p>
              
              <div className="flex items-center mt-2">
                <Rating>
                  <Rating.Star />
                  <p className="ml-2 text-sm font-bold text-gray-900">
                  {driver.rate.length>0 ? parseFloat((driver?.rate?.reduce((a, b) => a + b) / driver.rate?.length).toFixed(2)) :"0.00"}
                  </p>
                  <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500"></span>
                  <p className="text-sm font-medium text-gray-500">
                    {reviews?.length} reviews
                  </p>
                </Rating>
              </div>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {driver?.vType?.map((type, index) => (
                  <Badge key={index} color="purple" className="px-3 py-1 rounded-full">
                    {type === 'Bike' && <FaMotorcycle className="mr-1" />}
                    {type === 'Car' && <FaCar className="mr-1" />}
                    {type === 'Van' && <FaShuttleVan className="mr-1" />}
                    {type === 'Rickshaw' && <FaBiking className="mr-1" />}
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <HiMail className="mt-1 mr-3 h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{driver.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <HiLocationMarker className="mt-1 mr-3 h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{driver.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <HiCalendar className="mt-1 mr-3 h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">
                      {new Date(driver?.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col space-y-3">
                <Link to={`/message?id=${driverId}`}>
                    <Button gradientMonochrome="purple" className="w-full">
                      Message Driver
                    </Button>
                </Link>
                <Link to={`/hire/${driverId}`}>
                    <Button outline gradientDuoTone="purpleToBlue" className="w-full">
                      Book Now
                    </Button>
                </Link>
              </div>
            </div>
          </Card>
          
          {/* Main Content */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* About Section */}
            <Card className="bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">About Me</h3>
              <p className="text-gray-600">{driver.about}</p>
            </Card>
            
            {/* Documents Section */}
            <Card className="bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Documents</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Driver's License</p>
                    <p className="text-sm text-gray-500">{driver.licenceNumber}</p>
                  </div>
                  <Button size="xs" gradientMonochrome="info">
                    <HiDocumentDownload className="mr-2" />
                    View
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">Police Report</p>
                    <p className="text-sm text-gray-500">Verified background check</p>
                  </div>
                  <Button size="xs" gradientMonochrome="purple">
                    <HiDocumentDownload className="mr-2" />
                    View
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
                <p className="text-sm">Total Rides</p>
                <p className="text-2xl font-bold">{reviews?.length}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow">
                <p className="text-sm">Rating</p>
                <p className="text-2xl font-bold">
                    {driver.rate.length>0 ? parseFloat((driver?.rate?.reduce((a, b) => a + b) / driver.rate?.length).toFixed(2)) :"0.00"}
                </p>
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-xl shadow">
                <p className="text-sm">Experience</p>
                <p className="text-2xl font-bold">{new Date().getFullYear() - new Date(driver?.createdAt).getFullYear()} yrs</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow">
                <p className="text-sm">Vehicle Types</p>
                <p className="text-2xl font-bold">{driver?.vType?.length}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <Card className="bg-white rounded-xl shadow-lg mb-8">
          <Tabs
            aria-label="Tabs with underline"
            // style="underline"
          >
            <TabItem active title="Reviews">
              <div className="space-y-6 mt-4">
                {reviews && reviews.map((review) => (
                  <div key={review} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center mb-2">
                      <Avatar
                        img={review.customerId.profilePicture}
                        alt={`User image`}
                        rounded
                        size="sm"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{review.customerId.fullName}</p>
                        <Rating>
                          <Rating.Star />
                          <p className="ml-1 text-sm font-medium text-gray-500">
                            {review.rate} out of 5
                          </p>
                        </Rating>
                      </div>
                    </div>
                    <p className="text-gray-600">
                        {review.feedback}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </TabItem>
            <TabItem title="Pricing">
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">Vehicle Type</th>
                        <th scope="col" className="px-6 py-3">Base Rate</th>
                        <th scope="col" className="px-6 py-3">Per Km</th>
                        <th scope="col" className="px-6 py-3">Per Hour</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium text-gray-900">Bike</td>
                        <td className="px-6 py-4">$2.00</td>
                        <td className="px-6 py-4">$0.50</td>
                        <td className="px-6 py-4">$10.00</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium text-gray-900">Car</td>
                        <td className="px-6 py-4">$5.00</td>
                        <td className="px-6 py-4">$1.20</td>
                        <td className="px-6 py-4">$25.00</td>
                      </tr>
                      <tr className="bg-white border-b">
                        <td className="px-6 py-4 font-medium text-gray-900">Van</td>
                        <td className="px-6 py-4">$8.00</td>
                        <td className="px-6 py-4">$1.80</td>
                        <td className="px-6 py-4">$35.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabItem>
          </Tabs>
        </Card>
      </div>}
    </div>
  )
}

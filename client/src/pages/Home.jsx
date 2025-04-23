import React from "react";
import { Button } from "flowbite-react";
import GoogleMap from "./GoogleMap"; // Assuming your map component is in the same directory
import { useSelector } from "react-redux";

export default function Home() {
  const { currentUser } = useSelector((state) => state.userSlice);
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">
            Book Professional Drivers for <br />
            <span className="text-indigo-400">Your Personal Car</span>
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-8 animate-fade-in-up">
            Trust the leading and most reliable driver hiring service in the US.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 animate-bounce-in">
            Get Started
          </button>
        </div>
      </section>

      {/* Map Section with Service Areas */}
      {currentUser && (
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-10 p-10 lg:mb-0 lg:pr-10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Our Service Areas
              </h2>
              <p className="text-gray-300 mb-6">
                We currently operate in these major cities with plans to expand soon.
                Check if we're available in your area or request service expansion.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                  <span className="text-gray-300">Colombo</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  <span className="text-gray-300">Kandy</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-2"></div>
                  <span className="text-gray-300">Galle</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-gray-300">Jaffna</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <span className="text-gray-300">Kurunegala</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-gray-300">Badulla</span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 h-96 rounded-xl overflow-hidden shadow-2xl border-2 border-indigo-400/20 hover:border-indigo-400/50 transition-all duration-300">
              <GoogleMap />
            </div>
            
          </div>
        </div>
      </section>)}

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-slide-in-left">
            Why Choose HireMe?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl text-indigo-400 mb-4">🚗</div>
                <h3 className="text-xl font-bold text-indigo-400 mb-4">
                  Professional Drivers
                </h3>
                <p className="text-gray-300">
                  Our drivers are highly trained, licensed, and experienced to ensure your safety and comfort.
                </p>
              </div>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl text-purple-400 mb-4">⏰</div>
                <h3 className="text-xl font-bold text-purple-400 mb-4">
                  24/7 Availability
                </h3>
                <p className="text-gray-300">
                  We are available round the clock to serve you whenever you need a driver.
                </p>
              </div>
            </div>

            <div className="bg-gray-700 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl text-pink-400 mb-4">💳</div>
                <h3 className="text-xl font-bold text-pink-400 mb-4">
                  Affordable Rates
                </h3>
                <p className="text-gray-300">
                  Enjoy competitive pricing without compromising on quality or safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-slide-in-right">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl text-indigo-400 mb-4">1️⃣</div>
                <h3 className="text-xl font-bold text-indigo-400 mb-4">
                  Book a Driver
                </h3>
                <p className="text-gray-300">
                  Use our app or website to book a professional driver in just a few clicks.
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl text-purple-400 mb-4">2️⃣</div>
                <h3 className="text-xl font-bold text-purple-400 mb-4">
                  Driver Arrives
                </h3>
                <p className="text-gray-300">
                  Your assigned driver arrives on time, ready to take you to your destination.
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl text-pink-400 mb-4">3️⃣</div>
                <h3 className="text-xl font-bold text-pink-400 mb-4">
                  Enjoy the Ride
                </h3>
                <p className="text-gray-300">
                  Sit back, relax, and enjoy a safe and comfortable journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-in-left">
            Ready to Hire a Professional Driver?
          </h2>
          <p className="text-xl text-gray-300 mb-8 animate-slide-in-right">
            Join thousands of satisfied customers who trust HireMe for their driving needs.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 animate-bounce-in">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
}
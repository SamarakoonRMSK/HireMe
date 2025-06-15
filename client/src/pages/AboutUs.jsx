import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            We are a passionate team dedicated to building innovative solutions that make a difference.
          </p>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-8">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            Our mission is to empower individuals and businesses through cutting-edge technology, fostering creativity, and driving positive impact in the world.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
              <p className="text-gray-600">CEO & Founder</p>
              <p className="text-gray-500 text-center mt-2">
                John leads our vision with over 15 years of experience in tech innovation.
              </p>
            </div>
            {/* Team Member 2 */}
            <div className="flex flex-col items-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">Jane Smith</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
              <p className="text-gray-500 text-center mt-2">
                Jane drives our technical strategy with a passion for scalable solutions.
              </p>
            </div>
            {/* Team Member 3 */}
            <div className="flex flex-col items-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-32 h-32 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">Alex Brown</h3>
              <p className="text-gray-600">Lead Designer</p>
              <p className="text-gray-500 text-center mt-2">
                Alex crafts user-friendly designs that elevate our products.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
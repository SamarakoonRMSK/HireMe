import React from "react";
import { Button, Carousel } from "flowbite-react";
// import image1 from "../assets/home1.jpg";
import image2 from "../assets/home2.jpg";
import image3 from "../assets/home3.jpg";
import image1 from "../assets/driver.jpg";

export default function Home() {
  return (
    <div className="min-h-screen relative top-[-62px]">
      <section className=" text-white">
        <div className="relative ">
          <svg
            className="lg:w-full min-h-screen max-lg:hidden"
            viewBox="0 0 982.471111111111 552.64"
            // style={{ width: "82.471px", height: "552.64px" }} // Updated style prop
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <rect
              className="bg "
              id="bg"
              x="0"
              y="0"
              width="982.471111111111"
              height="552.64"
              fill="#ffffff"
            ></rect>
            <circle
              cx="1375.4595555555554"
              cy="0"
              r="982.471111111111"
              fill="#efef008e"
              stroke="none"
              strokeWidth="10"
            ></circle>
          </svg>

          <div className="lg:absolute max-lg:bg-yellow-200 max-lg:p-20 lg:top-52 lg:right-20 lg:pr-10 relative text-gray-700">
            <div className=" space-y-6 text-center lg:text-left">
              <h1 className="max-lg:text-2xl lg:text-4xl font-bold">
                Book Professional Drivers for <br />
                Your Personal Car
              </h1>
              <p className="text-2xl font-semibold">
                <i className="fas fa-phone-alt">HireMe</i>
              </p>
              <p className="text-lg font-light">
                Trust the leading and the most reliable US taxi operator.
              </p>
            </div>
          </div>
          <div className="lg:w-[40vw] lg:absolute relative lg:top-32 w-[80vW]  mx-auto">
            <div>
              <img src={image1} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

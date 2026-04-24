import React from "react";
import { Link } from "@inertiajs/react";

const Home = () => {
  return (
    <div className="h-full flex xl:flex-row flex-col">
      <div className="xl:w-1/2 bg-primary h-full px-6 py-10 text-text">
        <div className="xl:max-w-2xl ml-auto border-4 border-secondary p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-8">
          <div>
            <h1 className="sm:text-9xl text-7xl font-bold text-surface mb-4 flex flex-wrap">
              BUILD YOUR PC
            </h1>
            <p className="text-xl text-surface">
              Design your PC using our simple builder. Choose from components
              available in the Latvian market, all with live, accurate pricing.
            </p>
          </div>

          <div className="h-full w-full self-end min-w-100 min-h-50 flex">
            <video
              className="my-auto mx-auto"
              src="/videos/build_demo.mp4"
              autoPlay
              loop
              muted
              playsInline
            ></video>
          </div>
        </div>
      </div>

      <div className="xl:w-1/2 h-full px-6 py-10 text-text">
        <div className="xl:max-w-2xl h-full mr-auto border-4 border-secondary-light p-2 overflow-hidden flex xl:flex-col flex-col lg:flex-row gap-4">
          <div className="bg-pink-500 h-full w-full min-w-100 min-h-50"></div>

          <div className="self-end">
            <h1 className="sm:text-9xl text-7xl font-bold text-text mb-4 flex flex-wrap">
              MAKE THE BUILDING EASY
            </h1>
            <p className="text-xl text-text">
              Automatically complete your build at any stage using our smart
              auto-builder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import { Link } from "@inertiajs/react";
import Note from "./Note";

const BuilderSection = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-10">
      <h1 className="text-4xl font-semibold mb-8 text-text">
        Building Your First PC
      </h1>

      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-text">
          Selecting Components
        </h2>

        <p className="text-text">
          1. Go to the{" "}
          <Link className="text-info hover:underline font-medium">Build</Link>{" "}
          page by clicking the <span className="font-medium">Build</span> button
          in the navigation bar.
        </p>

        <p className="text-text">
          2. Find the component list section and click the{" "}
          <button className="bg-surface border border-secondary-light p-1 text-muted hover:bg-secondary-light transition cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>{" "}
          button to add a new component.
        </p>

        <div>
          <p className="text-text">
            3. Use the search bar and filters to browse and find components that
            match your preferences.
          </p>
          <Note>
            All displayed components are supposed to be compatible with your
            current build.
          </Note>
        </div>

        <div>
          <p className="text-text">
            4. Select a component from the list and click{" "}
            <span className="font-medium">Select</span> to add it to your build.
            It will then appear in the build info panel and the component list
            as a card.
          </p>
          <Note>
            You can remove a component or view it in the store using the buttons
            at the bottom of the component card.
          </Note>
        </div>

        <p className="text-text">
          5. Repeat these steps until your build is complete.
        </p>

        <h2 className="text-2xl font-semibold text-text">Saving Your Build</h2>

        <div>
          <p className="text-text">
            6. Once you’ve selected all your components, click the{" "}
            <span className="font-medium">Save Build</span> button in the build
            info panel.
          </p>
          <Note>
            You can clear the entire build or remove individual components by
            clicking the Clear Build button or pressing the{" "}
            <button className="p-1 bg-secondary text-muted hover:bg-danger/20 hover:text-danger cursor-pointer transition border border-secondary-light">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>{" "}
            icon next to each component.
          </Note>
        </div>
      </div>
    </div>
  );
};

export default BuilderSection;

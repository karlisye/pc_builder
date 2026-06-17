import React from "react";
import { Link } from "react-router-dom";
import Note from "./Note";
import { AddIcon, CloseIcon } from "../Common/Icons";

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
          <Link
            className="text-info hover:underline font-medium"
            to="/builder"
          >
            Build
          </Link>{" "}
          page by clicking the <span className="font-medium">Build</span> button
          in the navigation bar.
        </p>

        <p className="text-text">
          2. Find the component list section and click the{" "}
          <button className="bg-surface border border-secondary-light p-1 text-muted hover:bg-secondary-light transition cursor-pointer">
            <AddIcon size={12} />
          </button>{" "}
          button to add a new component.
        </p>

        <div>
          <p className="text-text">
            3. Use the search bar and filters to browse and find components that
            match your preferences.
          </p>
          <Note>
            Incompatible components will be marked with an "Incompatible" flag.
          </Note>
        </div>

        <div>
          <p className="text-text">
            4. Select a component from the list and click{" "}
            <span className="font-medium">Select</span> to add it to your build.
            It will then appear in the build info panel and the component list.
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

        <p className="text-text">
          6. Make sure to name your build and add the optional notes by filling
          out their fields.
        </p>

        <div>
          <p className="text-text">
            7. Once you’ve selected all your components and named your build,
            click the <span className="font-medium">Save Build</span> button in
            the build info panel.
          </p>
          <Note>
            You can clear the entire build or remove individual components by
            clicking the Clear Build button or pressing the{" "}
            <button className="p-1 bg-secondary text-muted hover:bg-danger/20 hover:text-danger cursor-pointer transition border border-secondary-light">
              <CloseIcon size={12} />
            </button>{" "}
            icon next to each component.
          </Note>
        </div>
      </div>
    </div>
  );
};

export default BuilderSection;

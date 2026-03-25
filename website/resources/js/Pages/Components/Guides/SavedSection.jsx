import React from "react";
import { Link } from "@inertiajs/react";

const SavedSection = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-10">
      <h1 className="text-4xl font-semibold mb-8 text-text">
        Managing Your Saved Builds
      </h1>

      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-text">
          Viewing Your Saved Builds
        </h2>

        <p className="text-text">
          1. Go to the{" "}
          <Link
            className="text-info hover:underline font-medium"
            href="/builds"
          >
            Saved
          </Link>{" "}
          page by clicking the <span className="font-medium">Saved</span> button
          in the navigation bar.
        </p>

        <p className="text-text">
          2. Locate the build list and select the build you want to view.
        </p>

        <h2 className="text-2xl font-semibold text-text">
          Viewing Build Components
        </h2>

        <p className="text-text">
          3. Click on any component to view its details and description below.
        </p>

        <p className="text-text">
          4. To view a component in store, click the{" "}
          <span className="font-medium">See In Store</span> button in the
          description or the <span className="font-medium">Buy</span> button
          next to the component in the list.
        </p>

        <h2 className="text-2xl font-semibold text-text">
          Editing Build Information
        </h2>

        <p className="text-text">
          1. Click the <span className="font-medium">Edit</span> button next to
          your build name.
        </p>

        <p className="text-text">
          2. Update the fields as needed. You can leave the notes field empty if
          you prefer.
        </p>

        <p className="text-text">
          3. Click <span className="font-semibold">Save</span> to apply your
          changes or <span className="font-semibold">Cancel</span> to discard
          them.
        </p>

        <h2 className="text-2xl font-semibold text-text">
          Continuing the Build
        </h2>

        <p className="text-text">
          1. Click the <span className="font-semibold">Continue Build</span>{" "}
          button to resume editing your build from where you left off. You will
          be redirected to the build page with your current configuration.
        </p>

        <h2 className="text-2xl font-semibold text-text">Deleting a Build</h2>

        <p className="text-text">
          1. Click the <span className="font-semibold">Delete Build</span>{" "}
          button (or the delete option in the build info panel) to remove the
          selected build.
        </p>

        <p className="text-text">
          2. A confirmation popup will appear. Confirm to permanently delete the
          build.
        </p>
      </div>
    </div>
  );
};

export default SavedSection;

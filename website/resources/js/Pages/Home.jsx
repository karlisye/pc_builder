import React from "react";
import { Link } from "@inertiajs/react";

const Home = () => {
  return (
    <div className="bg-primary h-full">
      <div className="max-w-5xl mx-auto px-6 py-10 text-text">
        <div className="mb-10">
          <h1 className="text-4xl text-white font-bold mb-4">Build Your PC</h1>

          <p className="text-surface max-w-2xl mb-6">
            Create, customize, and manage your PC builds with ease. Select
            compatible components, stay within budget, or generate a full build
            automatically.
          </p>

          <div className="flex gap-4">
            <Link
              href="/builder"
              className="px-8 py-4 bg-secondary text-white hover:bg-secondary-dark transition"
            >
              Start Building
            </Link>

            <Link
              href="/builds"
              className="px-8 py-4 bg-secondary-light hover:bg-secondary-light/50 transition"
            >
              View Saved Builds
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="p-4 border border-muted bg-secondary-light">
            <h2 className="text-lg font-semibold mb-2">Manual Builder</h2>
            <p className="text-primary">
              Choose each component yourself with full control. All parts are
              checked for compatibility.
            </p>
          </div>

          <div className="p-4 border border-muted bg-secondary-light">
            <h2 className="text-lg font-semibold mb-2">Automatic Builder</h2>
            <p className="text-primary">
              Set your budget and generate a complete build with optimized
              component allocation.
            </p>
          </div>

          <div className="p-4 border border-muted bg-secondary-light">
            <h2 className="text-lg font-semibold mb-2">Saved Builds</h2>
            <p className="text-primary">
              Save your builds and return to them anytime to continue editing or
              reviewing components.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-white font-semibold mb-3">
            Get Started
          </h2>

          <p className="text-surface max-w-2xl">
            Start by building your PC manually or use the automatic builder to
            generate a configuration based on your budget. You can edit, save,
            and revisit your builds at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useRef } from "react";
import Note from "./Note";

const AutoSection = () => {
  const tableRef = useRef(null);

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-10">
      <h1 className="text-4xl font-semibold mb-8 text-text">
        Using the Automatic Builder
      </h1>

      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-text">
          Selecting Components
        </h2>

        <div>
          <p className="text-text">
            1. Optionally, start by adding any components you want included in
            your build.
          </p>
          <Note>
            This step is optional. You can skip it to generate a fully automatic
            build.
          </Note>
        </div>

        <h2 className="text-2xl font-semibold text-text">Selecting a Budget</h2>

        <p className="text-text">
          2. Scroll to the bottom of the build information panel and select the{" "}
          <span>Auto Builder</span> option.
        </p>

        <div>
          <p className="text-text">
            3. Set your budget using the slider, or choose the unlimited budget
            option to get the best possible components.
          </p>
          <Note>
            The budget applies to the entire build. If you have already selected
            components, their cost will be deducted from your available budget.
          </Note>
        </div>

        <h2 className="text-2xl font-semibold text-text">
          Generating the Build
        </h2>

        <div>
          <p className="text-text">
            4. Once your budget is set, click the generate button to
            automatically complete your build.
          </p>

          <Note>
            Budget also affects component allocation. For example, lower-budget
            builds (e.g. under 500€) may exclude a GPU and instead select a CPU
            with integrated graphics. The same applies to components like CPU
            coolers.{" "}
            <button
              onClick={scrollToTable}
              className="text-info hover:underline font-medium cursor-pointer"
            >
              See all budget allocations below
            </button>
            .
          </Note>
        </div>

        <div>
          <p className="text-text">
            5. After generating a build we recommend checking the compatability
            for the build manually before purchasing any of the items.
          </p>

          <Note>
            The fan and HDD components are not automatically included, as they
            are optional. If the CPU comes with a built-in cooler and the budget
            is limited, a separate CPU cooler may also be treated as optional.
          </Note>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-text my-5">
          Budget Allocations
        </h2>

        <div className="" ref={tableRef}>
          <table className="w-full text-left text-text">
            <thead className="bg-secondary-light/50">
              <tr>
                <th className="p-2 border border-border">Component</th>
                <th className="p-2 border border-border">
                  Budget build {"(<500€)"}
                </th>
                <th className="p-2 border border-border">
                  Medium build {"(<1500€)"}
                </th>
                <th className="p-2 border border-border">
                  High-end build {"(>1500€)"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-border">GPU</td>
                <td className="p-2 border border-border">—</td>
                <td className="p-2 border border-border">27%</td>
                <td className="p-2 border border-border">27%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">CPU</td>
                <td className="p-2 border border-border">22%</td>
                <td className="p-2 border border-border">14%</td>
                <td className="p-2 border border-border">12%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">Motherboard</td>
                <td className="p-2 border border-border">17%</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">10%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">RAM</td>
                <td className="p-2 border border-border">24%</td>
                <td className="p-2 border border-border">20%</td>
                <td className="p-2 border border-border">23%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">Cooler</td>
                <td className="p-2 border border-border">—</td>
                <td className="p-2 border border-border">3%</td>
                <td className="p-2 border border-border">2%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">Case</td>
                <td className="p-2 border border-border">12%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">6%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">PSU</td>
                <td className="p-2 border border-border">10%</td>
                <td className="p-2 border border-border">7%</td>
                <td className="p-2 border border-border">6%</td>
              </tr>
              <tr>
                <td className="p-2 border border-border">SSD</td>
                <td className="p-2 border border-border">15%</td>
                <td className="p-2 border border-border">12%</td>
                <td className="p-2 border border-border">14%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AutoSection;

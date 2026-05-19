import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { ArrowIcon, CloseIcon } from "../Components/Common/Icons";

const Scraper = () => {
  const { csrf_token } = usePage().props.auth;

  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [expanded, setExpanded] = useState(false);

  const handleScrape = async (category) => {
    setError("");
    setLoading(true);
    setOutput([]);

    try {
      const res = await fetch("/admin/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf_token,
        },
        body: JSON.stringify({ category }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setLoading(false);
          break;
        }
        const lines = decoder
          .decode(value)
          .split("\n")
          .filter((line) => line.trim() !== "");

        setOutput((prev) => [...prev, ...lines]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to scrape.");
    }
  };

  const updateCategories = (category, checked) => {
    if (category === "all") {
      setCategories(checked ? ["all"] : []);
      return;
    }

    if (checked) {
      setCategories((prev) => [...prev.filter((c) => c !== "all"), category]);
    } else {
      setCategories((prev) => prev.filter((c) => c !== category));
    }
  };

  return (
    <div className="h-full flex">
      <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 transition-transform -translate-x-4 hover:translate-x-0">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="bg-primary text-white w-15 px-2 py-8 flex justify-end cursor-pointer hover:bg-primary-light transition"
        >
          <span className="rotate-270">
            <ArrowIcon size={32} />
          </span>
        </button>
      </div>

      <div
        className={`bg-primary flex flex-col fixed top-14 bottom-0 left-0 right-0 overflow-y-auto overscroll-contain transition-transform lg:static lg:w-120.5 lg:translate-x-0
          ${expanded ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {" "}
        <div className="flex justify-between items-center pt-6 px-4">
          <h1 className="text-4xl font-semibold text-white">SCRAPER</h1>
          <button
            className="w-10 h-10 lg:hidden text-secondary-light hover:cursor-pointer bg-primary hover:bg-primary-light transition p-2"
            onClick={() => setExpanded(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="space-y-4 mt-4 px-4">
          <div>
            <span className="text-secondary-light">Categories to scrape</span>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-2 col-span-2 pb-2 border-b border-muted">
                <input
                  className="accent-secondary-light"
                  id="all"
                  type="checkbox"
                  checked={categories.includes("all")}
                  onChange={(e) => updateCategories("all", e.target.checked)}
                />
                <label className="text-sm text-secondary-light" htmlFor="all">
                  All
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light disabled:accent-red-500"
                  id="cpu"
                  type="checkbox"
                  checked={categories.includes("cpu")}
                  onChange={(e) => updateCategories("cpu", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="cpu"
                >
                  CPU
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="motherboard"
                  type="checkbox"
                  checked={categories.includes("motherboard")}
                  onChange={(e) =>
                    updateCategories("motherboard", e.target.checked)
                  }
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="motherboard"
                >
                  Motherboard
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="ram"
                  type="checkbox"
                  checked={categories.includes("ram")}
                  onChange={(e) => updateCategories("ram", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="ram"
                >
                  RAM
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="gpu"
                  type="checkbox"
                  checked={categories.includes("gpu")}
                  onChange={(e) => updateCategories("gpu", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="gpu"
                >
                  GPU
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="ssd"
                  type="checkbox"
                  checked={categories.includes("ssd")}
                  onChange={(e) => updateCategories("ssd", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="ssd"
                >
                  SSD
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="hdd"
                  type="checkbox"
                  checked={categories.includes("hdd")}
                  onChange={(e) => updateCategories("hdd", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="hdd"
                >
                  HDD
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="case"
                  type="checkbox"
                  checked={categories.includes("case")}
                  onChange={(e) => updateCategories("case", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="case"
                >
                  Case
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="fan"
                  type="checkbox"
                  checked={categories.includes("fan")}
                  onChange={(e) => updateCategories("fan", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="fan"
                >
                  Fan
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="psu"
                  type="checkbox"
                  checked={categories.includes("psu")}
                  onChange={(e) => updateCategories("psu", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="psu"
                >
                  PSU
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="accent-secondary-light"
                  id="cooler"
                  type="checkbox"
                  checked={categories.includes("cooler")}
                  onChange={(e) => updateCategories("cooler", e.target.checked)}
                  disabled={categories.includes("all")}
                />
                <label
                  className={`text-sm ${categories.includes("all") ? "text-muted" : "text-secondary-light"}`}
                  htmlFor="cooler"
                >
                  Cooler
                </label>
              </div>
            </div>
          </div>

          <button
            className="p-4 w-full bg-secondary-light text-text cursor-pointer hover:bg-secondary-light/50 transition disabled:opacity-50"
            onClick={() => handleScrape(categories.join(","))}
            disabled={loading}
          >
            {loading ? "Scraping..." : "Scrape"}
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6 min-w-0">
        <div>
          <h2 className="text-2xl font-semibold text-text">Logs</h2>
          <div className="w-full border h-60 border-border p-2 overflow-x-auto overflow-y-auto relative">
            <div className="w-max min-w-full">
              {output.length > 0 &&
                output.map((line, i) => (
                  <p key={i} className="text-secondary-light whitespace-nowrap">
                    {line}
                  </p>
                ))}
            </div>
          </div>
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Scraper;

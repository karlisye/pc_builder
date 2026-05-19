import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

const Scraper = () => {
  const { csrf_token } = usePage().props.auth;

  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async (category) => {
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
        setOutput((prev) => [...prev, decoder.decode(value)]);
        console.log(decoder.decode(value));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button className="p-2 border" onClick={() => handleScrape("cpu")}>
        Scrape
      </button>
    </div>
  );
};

export default Scraper;

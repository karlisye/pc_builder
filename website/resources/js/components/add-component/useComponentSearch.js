import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

export const useComponentSearch = (activePicker, locked) => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const initializedRef = useRef(false);

  const handleScroll = () => {
    setShowScrollTop(scrollRef.current?.scrollTop > 200);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchComponent = useCallback(
    async (searchQuery = "", pageNum = 1) => {
      if (!activePicker) return;

      pageNum === 1 ? setLoading(true) : setLoadingMore(true);
      const component = activePicker.toLowerCase().replace(/\s+/g, "");

      const compatibilityParams = {};

      if (component === "motherboard" && locked.cpu?.id) {
        compatibilityParams.cpu_id = locked.cpu.id;
      }

      if (component === "processor" && locked.motherboard?.id) {
        compatibilityParams.motherboard_id = locked.motherboard.id;
      }

      if (component === "ram" && locked.motherboard?.id) {
        compatibilityParams.motherboard_id = locked.motherboard.id;
      }

      if (component === "case" && locked.motherboard?.id) {
        compatibilityParams.motherboard_id = locked.motherboard.id;
      }

      try {
        const res = await axios.get(`/components/${component}`, {
          params: {
            search: searchQuery,
            page: pageNum,
            ...compatibilityParams,
          },
        });

        const payload = res.data[component];

        setData((prev) =>
          pageNum === 1 ? payload.data : [...prev, ...payload.data],
        );
        setLastPage(payload.last_page);
        setPage(pageNum);
      } catch (error) {
        console.error(`Failed to load ${component}:`, error);
        if (pageNum === 1) setData([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activePicker, locked],
  );

  useEffect(() => {
    if (!activePicker) return;

    initializedRef.current = false;
    setSearch("");
    setPage(1);
    fetchComponent("", 1).then(() => {
      initializedRef.current = true;
    });
  }, [activePicker, fetchComponent]);

  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          initializedRef.current &&
          page < lastPage &&
          !loadingMore &&
          !loading
        ) {
          fetchComponent(search, page + 1);
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [bottomRef, page, lastPage, loadingMore, loading, search, fetchComponent]);

  const handleSearch = () => {
    setPage(1);
    fetchComponent(search, 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return {
    loading,
    loadingMore,
    data,
    search,
    setSearch,
    page,
    lastPage,
    bottomRef,
    scrollRef,
    showScrollTop,
    handleScroll,
    scrollToTop,
    handleSearch,
    handleKeyDown,
  };
};


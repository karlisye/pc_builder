import React, { useRef } from "react";

const HoverVideo = ({ src, className = "", resetOnLeave = true }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
    if (resetOnLeave) videoRef.current.currentTime = 0;
  };

  return (
    <video
      ref={videoRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      src={src}
      loop
      muted
      playsInline
    />
  );
};

export default HoverVideo;

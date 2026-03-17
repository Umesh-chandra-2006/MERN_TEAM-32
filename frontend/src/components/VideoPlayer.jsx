import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoPlayer = ({ src, options }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be initialized with a video element
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        ...options,
        autoplay: options?.autoplay || false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: src,
            type: "application/x-mpegURL", // HLS
          },
        ],
      }, () => {
        // videojs.log("player is ready");
      }));

      // Set up onEnded if provided
      if (options?.onEnded) {
        player.on("ended", options.onEnded);
      }

    } else {
      // Update the player source if the src prop changes
      const player = playerRef.current;
      player.src({ src: src, type: "application/x-mpegURL" });
      
      // Update onEnded handler
      if (options?.onEnded) {
        player.off("ended"); // Remove old listeners
        player.on("ended", options.onEnded);
      }
    }
  }, [src, options]);

  // Dispose the player on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="w-full h-full">
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;

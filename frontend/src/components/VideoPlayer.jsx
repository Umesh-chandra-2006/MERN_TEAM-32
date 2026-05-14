import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.min.css";

export const VideoPlayer = ({ src, options }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) {
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
      }));

      // Set up onEnded if provided
      if (options?.onEnded) {
        player.on("ended", options.onEnded);
      }

    } else {
      const player = playerRef.current;
      player.src({ src: src, type: "application/x-mpegURL" });
      
      if (options?.onEnded) {
        player.off("ended");
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
    <div data-vjs-player className="h-full w-full overflow-hidden rounded-none bg-black">
      <div ref={videoRef} className="h-full w-full" />
    </div>
  );
};

export default VideoPlayer;

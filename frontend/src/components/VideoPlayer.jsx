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
        autoplay: false,
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
        videojs.log("player is ready");
      }));

    } else {
      // Update the player source if the src prop changes
      const player = playerRef.current;
      player.src({ src: src, type: "application/x-mpegURL" });
    }
  }, [src, options, videoRef]);

  // Dispose the player on unmount
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;

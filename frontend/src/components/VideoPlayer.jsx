import React, { useState, useRef } from 'react';
import './videoplayer.css'; // External CSS for styling

const VideoPlayer = ({ post }) => {
  const [showReplayButton, setShowReplayButton] = useState(false); // State for replay button
  const videoRef = useRef(null); // Reference for video

  // Handle video end event
  const handleVideoEnded = () => {
    setShowReplayButton(true); // Show replay button when video ends
  };

  // Handle replay button click
  const handleReplay = () => {
    videoRef.current.currentTime = 0; // Reset video
    videoRef.current.play(); // Play video
    setShowReplayButton(false); // Hide replay button
  };

  return (
    <div className="video-container ">
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay muted
        onEnded={handleVideoEnded} // Show replay button when video ends
        controls={!showReplayButton} // Hide default controls when replay button shows
        className="video-player rounded-sm my-2 w-full aspect-square object-cover"
      >
        <source src={post?.image} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Custom Replay Button */}
      {showReplayButton && (
        <button className="replay-button" onClick={handleReplay}>
          &#x21bb; Replay
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;

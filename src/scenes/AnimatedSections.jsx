import React, { useEffect } from "react";
import gsap from "gsap";
import "./VideoBackground.css";

const VideoBackground = () => {
  useEffect(() => {
    gsap.from(".overlay-text", {
      y: 50,
      opacity: 0,
      duration: 2,
      ease: "power2.out",
    });
  }, []);

  return (
    <div className="video-container">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/videos/video.mp4" type="video/mp4" />   {/* Public folder video */}
        Your browser does not support the video tag.
      </video>

      {/* Semi-transparent overlay */}
      <div className="video-overlay"></div>

      {/* Neon Text */}
      <div className="overlay-text">
        <h1>Welcome to IIT Indore Chatbot</h1>
        <p>Your Smart AI Assistant</p>
      </div>
    </div>
  );
};

export default VideoBackground;

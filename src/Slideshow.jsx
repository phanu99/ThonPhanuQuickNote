import React, { useState, useEffect } from "react";
import "./Slideshow.css";

const Slideshow = ({ images, interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const auto = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(auto);
  }, [images.length, interval]);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="slideshow-container">
      <img src={images[index]} alt={`slide-${index}`} className="slide-image" />
      <button className="slide-btn prev" onClick={prevSlide}>❮</button>
      <button className="slide-btn next" onClick={nextSlide}>❯</button>
    </div>
  );
};

export default Slideshow;

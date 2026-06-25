// src/components/ui/HomeSSBg.jsx
import { useState, useEffect } from "react";
import slide4 from "../../assets/SlideShow/slide_4.jpeg";
import slide5 from "../../assets/SlideShow/slide_5.jpeg";
import slide6 from "../../assets/SlideShow/slide_6.jpeg";
import slide7 from "../../assets/SlideShow/slide_7.jpeg";
import slide8 from "../../assets/SlideShow/slide_8.jpeg";
import slide9 from "../../assets/SlideShow/slide_9.jpeg";

const images = [slide4, slide5, slide6, slide7, slide8, slide9];

export function HomeSSBg() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change slide every 5 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gray-900">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover scale-110 blur-[1px] brightness-75 contrast-110 saturate-110 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Optional subtle dark overlay to guarantee text contrast on top */}
      <div className="absolute inset-0 bg-black/30 transition-opacity duration-1000"></div>
    </div>
  );
}

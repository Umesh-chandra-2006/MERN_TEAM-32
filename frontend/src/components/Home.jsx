import { useState, useEffect } from "react";

function Home() {

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
      title: "Learn Anytime, Anywhere",
      subtitle: "Access high quality courses from expert instructors"
    },
    {
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
      title: "Upgrade Your Skills",
      subtitle: "Build real world knowledge and grow your career"
    },
    {
      image: "https://images.unsplash.com/photo-1498079022511-d15614cb1c02",
      title: "Start Your Learning Journey",
      subtitle: "Join thousands of learners today"
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(slider);
  }, []);

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            className="w-full h-full object-cover"
            alt="learning"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-5">

            <img
              src="https://png.pngtree.com/png-clipart/20220509/original/pngtree-brain-logo-design-for-educational-png-image_7667200.png"
              className="w-20 mb-6"
              alt="logo"
            />

            <h1 className="text-5xl font-bold mb-4">
              {slide.title}
            </h1>

            <p className="text-xl max-w-2xl">
              {slide.subtitle}
            </p>

          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

    </div>
  );
}

export default Home;
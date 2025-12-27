import React, { useState, useEffect } from 'react';

export default function AutoPaginationSlider({
  slides = [
    { id: 1, title: 'Slide 1', color: 'from-blue-400 to-blue-600', content: 'Welcome to our presentation' },
    { id: 2, title: 'Slide 2', color: 'from-purple-400 to-purple-600', content: 'Discover amazing features' },
    { id: 3, title: 'Slide 3', color: 'from-pink-400 to-pink-600', content: 'Build something great' },
    { id: 4, title: 'Slide 4', color: 'from-orange-400 to-orange-600', content: 'Join our community' },
    { id: 5, title: 'Slide 5', color: 'from-green-400 to-green-600', content: 'Start your journey today' },
  ],
  slideDuration = 3000,
  autoPlay = true,
  showControls = true,
  progressColor = 'from-red-500 to-pink-500',
  dotActiveColor = 'bg-gray-300',
  dotCompletedColor = 'bg-gray-500',
  dotInactiveColor = 'bg-gray-300',
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    if (!autoPlay) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (slideDuration / 50));
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [currentSlide, autoPlay, slideDuration]);

  useEffect(() => {
    if (!autoPlay) return;

    if (progress >= 100) {
      // Immediately move to next slide when progress completes
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setProgress(0);
    }
  }, [progress, autoPlay, totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Slider Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Slides */}
          <div className="relative h-96 overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className={`h-full bg-gradient-to-br ${slide.color} flex flex-col items-center justify-center text-white p-8`}>
                  <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-2xl opacity-90">{slide.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Progress Indicators */}
          <div className="flex items-center justify-center gap-2 py-6 px-4 bg-white">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative"
                aria-label={`Go to slide ${index + 1}`}
              >
                {/* Dot for inactive/upcoming slides */}
                {index !== currentSlide && (
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index < currentSlide ? dotCompletedColor : dotInactiveColor
                    }`}
                  />
                )}

                {/* Active slide with progress bar */}
                {index === currentSlide && (
                  <div className={`relative w-12 h-2 ${dotActiveColor} rounded-full overflow-hidden`}>
                    <div
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r ${progressColor} rounded-full transition-all duration-100 ease-linear`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => goToSlide((currentSlide - 1 + totalSlides) % totalSlides)}
              className="px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
            >
              ← Previous
            </button>
            <button
              onClick={() => goToSlide((currentSlide + 1) % totalSlides)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
            >
              Next →
            </button>
          </div>
        )}

        {/* Example Usage Guide */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">📝 How to Use (Props)</h3>
          <div className="space-y-2 text-sm text-gray-600 font-mono">
            <p><strong>slides</strong> - Array of slide objects with id, title, color, content</p>
            <p><strong>slideDuration</strong> - Duration in ms (default: 3000)</p>
            <p><strong>autoPlay</strong> - Enable/disable auto-play (default: true)</p>
            <p><strong>showControls</strong> - Show/hide prev/next buttons (default: true)</p>
            <p><strong>progressColor</strong> - Gradient for progress bar (default: 'from-red-500 to-pink-500')</p>
            <p><strong>dotActiveColor</strong> - Active dot background (default: 'bg-gray-300')</p>
            <p><strong>dotCompletedColor</strong> - Completed dot color (default: 'bg-gray-500')</p>
            <p><strong>dotInactiveColor</strong> - Inactive dot color (default: 'bg-gray-300')</p>
          </div>
        </div>
      </div>
    </div>
  );
}
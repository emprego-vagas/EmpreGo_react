import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderProps {
  slides: Array<{
    empresa: string;
    titulo: string;
    texto: string;
    autor: string;
    data: string;
    background?: string;
    fotoEmpresa?: string;
  }>;
  autoplay?: boolean;
  autoplayInterval?: number;
  infinite?: boolean;
  currentSlide: number;
  setCurrentSlide: (value: number) => void;
  threeContainerRef: React.RefObject<HTMLDivElement>;
  slidesContainerRef: React.RefObject<HTMLDivElement>;
}

const Slider: React.FC<SliderProps> = ({
  slides,
  currentSlide,
  setCurrentSlide,
  threeContainerRef,
  slidesContainerRef,
}) => {
  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      className="relative w-full max-w-8xl mx-auto 
           mt-16 mb-8 
           px-2 sm:px-4 
           rounded-xl overflow-hidden 
           bg-blue-900 text-white"
      aria-label="Recomendações de clientes"
    >
      <div ref={threeContainerRef} className="absolute inset-0 -z-10" />

      <div
        ref={slidesContainerRef}
        className="relative overflow-hidden w-full h-64 sm:h-72 md:h-80 lg:h-96 min-h-0"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-300 rounded-xl overflow-hidden ${
              index === currentSlide
                ? "opacity-100 pointer-events-auto z-20"
                : "opacity-0 pointer-events-none z-10"
            }`}
          >
            <div className="slide-content p-5 sm:p-8 h-full box-border flex flex-col justify-center relative">
              <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-70 mb-1">
                {slide.empresa}
              </p>
              <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 leading-tight">
                {slide.titulo}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90 line-clamp-3 sm:line-clamp-none italic">
                "{slide.texto}"
              </p>
              <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs opacity-70">
                <span className="font-medium">{slide.autor}</span>
                <span>•</span>
                <span>{slide.data}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        aria-label="Slide anterior"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white transition-all hover:bg-white/30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Próximo slide"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white transition-all hover:bg-white/30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Paginação */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Slider;

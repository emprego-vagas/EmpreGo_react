import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Slide {
  empresa: string;
  titulo: string;
  texto: string;
  autor: string;
  data: string;
  fotoEmpresa?: string;
}

interface TestimonialsSliderProps {
  slides: Slide[];
}

const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  if (!slide) return null;

  return (
    <section className="relative mb-8 overflow-hidden rounded-xl bg-primary p-5 sm:p-8 text-primary-foreground">
      <Quote className="absolute top-4 right-4 h-10 w-10 sm:h-16 sm:w-16 opacity-10" />

      <div className="relative z-10 min-h-[140px] sm:min-h-[160px]">
        <div key={current} className="animate-fade-in">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-70 mb-1">
            {slide.empresa}
          </p>
          <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3">{slide.titulo}</h3>
          <p className="text-xs sm:text-sm leading-relaxed opacity-90 line-clamp-3 sm:line-clamp-none">
            {slide.texto}
          </p>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs opacity-70">
            <span className="font-medium">{slide.autor}</span>
            <span>•</span>
            <span>{slide.data}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-primary-foreground' : 'w-1.5 bg-primary-foreground/40'
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={prev}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/30"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/30"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
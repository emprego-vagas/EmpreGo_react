import React, { useEffect, useRef } from 'react';
import { ParticlesBackground } from '../ts/particles';

const ParticlesBackgroundComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticlesBackground | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      particlesRef.current = new ParticlesBackground(canvasRef.current);
    }

    return () => {
      if (particlesRef.current) {
        particlesRef.current.destroy();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0  w-full h-full pointer-events-none z-0"
      // style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #9333EA 100%)' }}
    />
  );
};

export default ParticlesBackgroundComponent;
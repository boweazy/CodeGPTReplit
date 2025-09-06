import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkle: number;
  angle: number;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStar = (): Star => ({
      x: Math.random() * canvas.width,
      y: -10,
      size: Math.random() * 3 + 0.3,
      speed: Math.random() * 0.4 + 0.1, // Even slower falling speed
      opacity: Math.random() * 0.8 + 0.3,
      twinkle: Math.random() * 0.015 + 0.005,
      angle: 0,
    });

    const resetStar = (star: Star) => {
      star.x = Math.random() * canvas.width;
      star.y = -10;
      star.size = Math.random() * 3 + 0.3;
      star.speed = Math.random() * 0.4 + 0.1;
      star.opacity = Math.random() * 0.8 + 0.3;
      star.twinkle = Math.random() * 0.015 + 0.005;
      star.angle = 0;
    };

    const updateStar = (star: Star) => {
      star.y += star.speed;
      star.angle += star.twinkle;
      star.opacity = 0.3 + Math.sin(star.angle) * 0.4;

      if (star.y > canvas.height + 10) {
        resetStar(star);
      }
    };

    const drawStar = (star: Star) => {
      ctx.save();
      ctx.globalAlpha = star.opacity;
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Add subtle star glow
      ctx.shadowColor = 'white';
      ctx.shadowBlur = star.size * 2;
      ctx.fill();

      ctx.restore();
    };

    const initializeStars = () => {
      const starCount = 200; // More stars for better coverage
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        const star = createStar();
        // Start at random position for initial render
        star.y = Math.random() * canvas.height;
        starsRef.current.push(star);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(star => {
        updateStar(star);
        drawStar(star);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initializeStars();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]"
      data-testid="star-field-canvas"
    />
  );
}

import { useEffect, useRef } from 'react';

interface SparklingBorderProps {
  children: React.ReactNode;
}

export default function SparklingBorder({ children }: SparklingBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const numStars = 12; // Number of sparkling stars
    const stars: HTMLDivElement[] = [];

    const createStars = () => {
      // Clear existing stars
      stars.forEach(star => star.remove());
      stars.length = 0;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.background = '#ffd700';
        star.style.borderRadius = '50%';
        star.style.pointerEvents = 'none';
        star.style.zIndex = '10';
        
        const size = Math.random() * 3 + 1; // Star size between 1px and 4px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.boxShadow = `0 0 ${size * 2}px #ffd700`;

        // Position stars around the border perimeter
        const angle = (i / numStars) * Math.PI * 2;
        const radiusX = centerX + (Math.random() * 20 - 10); // Add some randomness
        const radiusY = centerY + (Math.random() * 20 - 10);
        
        const x = centerX + radiusX * Math.cos(angle) - size / 2;
        const y = centerY + radiusY * Math.sin(angle) - size / 2;

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.animation = `sparkle 2s ease-in-out infinite`;
        star.style.animationDelay = `${Math.random() * 2}s`;

        container.appendChild(star);
        stars.push(star);
      }
    };

    // Create stars initially
    createStars();

    // Recreate stars on resize
    const resizeObserver = new ResizeObserver(createStars);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      stars.forEach(star => star.remove());
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {children}
    </div>
  );
}
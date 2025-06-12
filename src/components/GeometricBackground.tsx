
import React from 'react';

const GeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-purple-orange"></div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl transform rotate-12 animate-float"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-white/20 backdrop-blur-sm rounded-xl transform -rotate-45 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-40 w-40 h-40 bg-white/5 backdrop-blur-sm rounded-3xl transform rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/15 backdrop-blur-sm rounded-2xl transform -rotate-12 animate-float" style={{ animationDelay: '3s' }}></div>
      
      {/* 3D-like layered rectangles inspired by the reference image */}
      <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
        <div className="relative">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-20 h-40 bg-gradient-to-r from-purple-400/20 to-orange-400/20 backdrop-blur-sm rounded-lg border border-white/10"
              style={{
                transform: `translateX(${i * 8}px) translateY(${i * 4}px) rotateY(${i * 5}deg)`,
                zIndex: 8 - i,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Another set on the right side */}
      <div className="absolute top-1/3 right-1/4 transform">
        <div className="relative">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-16 h-32 bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm rounded-lg border border-white/10"
              style={{
                transform: `translateX(${-i * 6}px) translateY(${i * 6}px) rotateY(${-i * 8}deg)`,
                zIndex: 6 - i,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 mix-blend-overlay"></div>
    </div>
  );
};

export default GeometricBackground;

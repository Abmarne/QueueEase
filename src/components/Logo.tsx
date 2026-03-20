import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32, showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background "Q" shape */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Main Q Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="12"
            className="text-primary opacity-20"
          />
          
          {/* Progressive Queue Dots forming a circular path */}
          <circle cx="50" cy="18" r="8" fill="currentColor" className="text-primary animate-pulse" />
          <circle cx="82" cy="50" r="8" fill="currentColor" className="text-primary opacity-60" />
          <circle cx="50" cy="82" r="8" fill="currentColor" className="text-primary opacity-30" />
          
          {/* The Checkmark / Tail of the Q */}
          <path
            d="M50 50L75 75M75 75H90M75 75V90"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          />
          
          {/* Central Action Icon (Zap) */}
          <path
            d="M55 35L40 55H50L45 70L60 50H50L55 35Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>
      
      {showText && (
        <span className="font-black tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          QueueEase
        </span>
      )}
    </div>
  );
};

export default Logo;

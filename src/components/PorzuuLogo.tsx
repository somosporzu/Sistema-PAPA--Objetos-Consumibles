import React from 'react';

interface PorzuuLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
  withPaletteBar?: boolean;
  subtitle?: string;
}

export const PorzuuLogo: React.FC<PorzuuLogoProps> = ({
  className = '',
  size = 40,
  withText = false,
  withPaletteBar = false,
  subtitle = 'Sistema P.A.P.A.'
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG rendering of the Porzuu Crown Mascot */}
      <div 
        className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Black Outer Contour */}
          <path
            d="M 50 8 
               C 54 18, 62 26, 68 18 
               C 74 12, 78 18, 80 25 
               C 83 35, 83 45, 87 54 
               C 92 66, 88 84, 76 92 
               C 65 99, 35 99, 24 92 
               C 12 84, 8 66, 13 54 
               C 17 45, 17 35, 20 25 
               C 22 18, 26 12, 32 18 
               C 38 26, 46 18, 50 8 Z"
            fill="#111113"
          />

          {/* White Inner Outline */}
          <path
            d="M 50 14 
               C 53 23, 60 29, 66 22 
               C 71 17, 74 22, 75 28 
               C 78 37, 78 46, 82 54 
               C 86 64, 83 79, 73 86 
               C 63 92, 37 92, 27 86 
               C 17 79, 14 64, 18 54 
               C 22 46, 22 37, 25 28 
               C 26 22, 29 17, 34 22 
               C 40 29, 47 23, 50 14 Z"
            fill="#FFFFFF"
          />

          {/* Vivid Rose Body */}
          <path
            d="M 50 20 
               C 53 27, 58 32, 63 26 
               C 67 22, 69 26, 70 31 
               C 73 39, 73 47, 77 54 
               C 80 63, 78 75, 70 81 
               C 61 87, 39 87, 30 81 
               C 22 75, 20 63, 23 54 
               C 27 47, 27 39, 30 31 
               C 31 26, 33 22, 37 26 
               C 42 32, 47 27, 50 20 Z"
            fill="#DE3468"
          />

          {/* Subtle 3D gradient reflection */}
          <ellipse
            cx="40"
            cy="36"
            rx="12"
            ry="6"
            fill="#FF6492"
            opacity="0.3"
            transform="rotate(-15 40 36)"
          />

          {/* Left White Bean Eye */}
          <ellipse
            cx="41"
            cy="58"
            rx="5"
            ry="10"
            fill="#FFFFFF"
          />

          {/* Right White Bean Eye */}
          <ellipse
            cx="59"
            cy="58"
            rx="5"
            ry="10"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black tracking-wider text-lg text-[#ede8df] flex items-center gap-1.5">
              PORZUU
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#de3468]/20 text-[#de3468] font-sans font-bold border border-[#de3468]/30">
                P.A.P.A.
              </span>
            </span>
          </div>
          <span className="text-xs text-[#a4a7ac] font-medium tracking-wide">
            {subtitle}
          </span>
        </div>
      )}

      {withPaletteBar && (
        <div className="flex items-center ml-auto gap-1 bg-[#18191b] p-1 rounded-md border border-[#36383e]">
          <div 
            title="Terracota Rosa (#C47474)" 
            className="w-4 h-4 rounded-sm bg-[#c47474] shadow-sm cursor-help transition-transform hover:scale-125" 
          />
          <div 
            title="Pergamino Dorado (#E5CF87)" 
            className="w-4 h-4 rounded-sm bg-[#e5cf87] shadow-sm cursor-help transition-transform hover:scale-125" 
          />
          <div 
            title="Obsidiana Negra (#28282A)" 
            className="w-4 h-4 rounded-sm bg-[#28282a] border border-[#444] shadow-sm cursor-help transition-transform hover:scale-125" 
          />
          <div 
            title="Pizarra Gris (#808388)" 
            className="w-4 h-4 rounded-sm bg-[#808388] shadow-sm cursor-help transition-transform hover:scale-125" 
          />
        </div>
      )}
    </div>
  );
};

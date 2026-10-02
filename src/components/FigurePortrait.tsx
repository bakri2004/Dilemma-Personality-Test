import React, { useState } from "react";
import { Figure } from "../data/figures";

interface FigurePortraitProps {
  figure: Figure;
}

export const FigurePortrait: React.FC<FigurePortraitProps> = ({ figure }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const hasImage = Boolean(figure.imageSrc && figure.imageSrc.trim() !== "" && !imageFailed);

  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-60 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_25px_-5px_rgba(217,119,6,0.35)] relative bg-slate-900 group shrink-0">
        {hasImage ? (
          <>
            <img
              src={figure.imageSrc}
              alt={figure.name}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover object-center filter contrast-105 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-center select-none">
            <div className="w-16 h-16 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center mb-3 shadow-[0_0_25px_-5px_rgba(217,119,6,0.35)]">
              <span className="font-cinzel text-2xl font-bold text-amber-400 bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                {figure.initials}
              </span>
            </div>
            <span className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide mb-1 leading-snug">
              {figure.name}
            </span>
            <span className="text-[11px] text-amber-400/90 font-mono px-2 text-center line-clamp-2">
              {figure.era}
            </span>
          </div>
        )}
      </div>

      {hasImage && figure.imageCredit && figure.imageCredit.trim() !== "" && (
        <span className="text-[10px] text-slate-400 mt-2 text-center font-mono">
          {figure.imageCredit}
        </span>
      )}
    </div>
  );
};

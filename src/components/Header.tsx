import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-[0_0_25px_-5px_rgba(217,119,6,0.35)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
          <div>
            <span className="font-cinzel tracking-[0.2em] text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
              {siteConfig.name}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

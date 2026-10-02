import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-20 w-full text-center">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 space-y-4">
        <span className="font-cinzel text-5xl sm:text-6xl font-bold text-amber-500/60">
          404
        </span>
        <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
          Page Not Found
        </h1>
        <p className="text-slate-300 text-base max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
          >
            <span>Back to the quiz</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

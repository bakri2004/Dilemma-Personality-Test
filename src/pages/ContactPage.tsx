import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";

export const ContactPage: React.FC = () => {
  return (
    <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16 w-full">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          <span>← Back to the quiz</span>
        </Link>
      </div>

      <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-white mb-8">
        Contact
      </h1>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
        <p>
          Questions, corrections, or feedback? Email us:
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4 ml-1"
          >
            {siteConfig.contactEmail}
          </a>
        </p>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-800">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          <span>← Back to the quiz</span>
        </Link>
      </div>
    </main>
  );
};

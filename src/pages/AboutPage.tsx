import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";

export const AboutPage: React.FC = () => {
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
        About
      </h1>

      <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <p>
            {siteConfig.name} is an independent project that turns historical decision-making styles into a short, free personality quiz.
          </p>
          <p>
            The goal of this project is to make history approachable and to encourage reading more about these figures.
          </p>
          <p>
            If you spot any historical inaccuracies or have suggestions for corrections, please reach out via our{" "}
            <Link to="/contact" className="text-amber-400 hover:text-amber-300 underline underline-offset-4">
              Contact page
            </Link>.
          </p>
        </section>
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

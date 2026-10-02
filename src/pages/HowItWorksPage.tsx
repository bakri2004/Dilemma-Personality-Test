import React from "react";
import { Link } from "react-router-dom";

export const HowItWorksPage: React.FC = () => {
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
        How It Works
      </h1>

      <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-cinzel text-xl font-bold text-amber-400">
            The Quiz Structure
          </h2>
          <p>
            The quiz consists of a series of scenario questions about how you would handle high-pressure situations.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-cinzel text-xl font-bold text-amber-400">
            Trait Scoring
          </h2>
          <p>
            Each answer adds points to six core traits: <strong className="text-white">strategy</strong>, <strong className="text-white">composure</strong>, <strong className="text-white">inquiry</strong>, <strong className="text-white">creativity</strong>, <strong className="text-white">boldness</strong>, and <strong className="text-white">diplomacy</strong>.
          </p>
          <p>
            Each historical figure on this site has a blend of those traits, assigned by the site's author based on how historical accounts describe their decisions and character. These are editorial judgments, not scientific measurements.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-cinzel text-xl font-bold text-amber-400">
            Matching & Affinity
          </h2>
          <p>
            At the end, your trait mix is compared to every figure's mix, and the closest match is your result. The percentage shows how close the match is.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-cinzel text-xl font-bold text-amber-400">
            Disclaimer
          </h2>
          <p>
            This quiz is for entertainment and reflection, is not a psychological test, has not been scientifically validated, and says nothing about your real abilities or character.
          </p>
          <p className="text-sm text-slate-400">
            Note: Bios are summaries and may simplify complex lives; readers are encouraged to read further.
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

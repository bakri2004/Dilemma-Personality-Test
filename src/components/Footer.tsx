import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-10 mt-16 text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center space-y-4">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium">
          <Link
            to="/how-it-works"
            className="hover:text-amber-400 transition-colors"
          >
            How it works
          </Link>
          <Link
            to="/about"
            className="hover:text-amber-400 transition-colors"
          >
            About
          </Link>
          <Link
            to="/privacy"
            className="hover:text-amber-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/contact"
            className="hover:text-amber-400 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright Line */}
        <p className="text-slate-400 text-xs sm:text-sm">
          © 2026 {siteConfig.name}
        </p>

        {/* Entertainment Disclaimer */}
        <p className="text-slate-500 text-xs max-w-md">
          For entertainment only. Not a psychological assessment.
        </p>
      </div>
    </footer>
  );
};

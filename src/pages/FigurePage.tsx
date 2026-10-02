import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { figures, Figure, Traits } from "../data/figures";
import { BOOKS, isValidAffiliateUrl } from "../data/books";
import { FigurePortrait } from "../components/FigurePortrait";
import { siteConfig } from "../config/site";

const TRAIT_LABELS: Record<keyof Traits, string> = {
  strategy: "Strategic Foresight",
  composure: "Crisis Equanimity",
  inquiry: "Empirical Inquiry",
  creativity: "Interdisciplinary Creativity",
  boldness: "Audacious Momentum",
  diplomacy: "Sovereign Diplomacy",
};

export const FigurePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const figure = figures.find((f) => f.id === id);

  useEffect(() => {
    if (!figure) {
      document.title = `Archetype Not Found | ${siteConfig.name}`;
      return;
    }

    // 1. Title
    const pageTitle = `${figure.name} (${figure.title}) | ${siteConfig.name}`;
    document.title = pageTitle;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    const cleanDesc = `${figure.name} (${figure.title}, ${figure.era}). ${figure.bio}`.slice(0, 155);
    metaDesc.setAttribute("content", cleanDesc);

    // 3. Canonical URL (Ensure exactly one unique canonical link)
    const canonicalUrl = `${siteConfig.url}/figures/${figure.id}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 4. Open Graph
    const setMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMetaTag("og:title", pageTitle);
    setMetaTag("og:description", cleanDesc);
    setMetaTag("og:url", canonicalUrl);
    setMetaTag("og:type", "article");
    setMetaTag("og:site_name", siteConfig.name);

    // 5. Twitter
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setTwitterTag("twitter:title", pageTitle);
    setTwitterTag("twitter:description", cleanDesc);

    // Cleanup on unmount: remove figure-specific canonical to avoid conflicts
    return () => {
      const activeCanonical = document.querySelector('link[rel="canonical"]');
      if (activeCanonical) {
        activeCanonical.remove();
      }
    };
  }, [figure]);

  if (!figure) {
    return (
      <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-20 w-full text-center">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 space-y-4">
          <span className="font-cinzel text-5xl font-bold text-amber-500/60">
            404
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
            Historical Archetype Not Found
          </h1>
          <p className="text-slate-300 text-base max-w-md mx-auto">
            The historical figure profile you requested could not be located in our index.
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
  }

  const figureBooks = BOOKS[figure.id] || [];
  const hasValidAffiliateUrl = figureBooks.some((b) => isValidAffiliateUrl(b.affiliateUrl));
  const otherFigures = figures.filter((f) => f.id !== figure.id).slice(0, 4);

  return (
    <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16 w-full">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
        >
          <span>← Back to the quiz</span>
        </Link>
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
          Historical Archetype Archive
        </span>
      </nav>

      {/* Main Profile Card */}
      <article className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 sm:p-10 shadow-2xl relative space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Portrait */}
          <FigurePortrait figure={figure} />

          {/* Profile Details */}
          <div className="flex-grow space-y-4 text-center md:text-left">
            <div className="text-xs font-mono text-amber-500 uppercase tracking-widest">
              {figure.era} · {figure.domain}
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {figure.name}
            </h1>

            <h2 className="font-cinzel text-lg sm:text-xl text-amber-400 font-semibold">
              {figure.title}
            </h2>

            {/* Quote Block */}
            {figure.quote && figure.quote.trim() !== "" && (
              <blockquote className="border-l-2 border-amber-500 pl-4 py-2 italic text-slate-300 text-sm bg-slate-950/40 rounded-r-lg my-3">
                "{figure.quote}"
              </blockquote>
            )}

            {/* Core Pillars */}
            <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
              {figure.pillars.map((pill) => (
                <span
                  key={pill}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Quick Take-the-Quiz CTA */}
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
              >
                <span>Take the Quiz to Match Your Mindset</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* In-Depth Historical Biography & Analysis */}
        <section className="border-t border-slate-800 pt-8 space-y-4">
          <h3 className="font-cinzel text-xl font-bold text-slate-100">
            Historical Context & Strategic Temperament
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {figure.bio}
          </p>
          {figure.analysis && (
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {figure.analysis}
            </p>
          )}
        </section>

        {/* Trait Profile Spectrum */}
        <section className="border-t border-slate-800 pt-8">
          <h3 className="font-cinzel text-xl font-bold text-slate-100 mb-2">
            Archetype Trait Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Editorial synthesis of {figure.name}'s recorded decision-making style across the six core assessment traits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(figure.traits) as (keyof Traits)[]).map((traitKey) => {
              const weight = figure.traits[traitKey] || 0;
              const pct = Math.round(weight * 100);
              return (
                <div key={traitKey} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-medium text-slate-300">
                      {TRAIT_LABELS[traitKey]}
                    </span>
                    <span className="font-mono text-amber-400 font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Further Reading Section */}
        {figureBooks.length > 0 && (
          <section className="border-t border-slate-800 pt-8 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
                Curated Bibliography
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                Further Reading on {figure.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Authoritative biographies and foundational primary literature related to this archetype.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {figureBooks.map((book) => {
                const canShowAmazon = isValidAffiliateUrl(book.affiliateUrl);
                return (
                  <div
                    key={book.title}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 sm:p-6 transition-colors hover:border-amber-500/40 flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-cinzel text-base sm:text-lg font-bold text-white mb-1">
                        {book.title}
                      </h4>
                      <p className="text-amber-400 text-xs sm:text-sm font-medium mb-2.5">
                        by {book.author}
                      </p>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {book.note}
                      </p>
                    </div>

                    {canShowAmazon && (
                      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                        <a
                          href={book.affiliateUrl}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          <span>View on Amazon</span>
                          <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {hasValidAffiliateUrl && (
              <p className="text-[11px] text-slate-500 italic text-center pt-1">
                As an Amazon Associate we earn from qualifying purchases.
              </p>
            )}
          </section>
        )}
      </article>

      {/* Explore Other Archetypes */}
      <section className="mt-16 pt-10 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 gap-2">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
              Related Figures
            </span>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Explore More Historical Archetypes
            </h3>
          </div>
          <Link
            to="/#archetypes"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            View all 16 figures →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {otherFigures.map((other) => (
            <Link
              key={other.id}
              to={`/figures/${other.id}`}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-amber-500/40 transition-colors group block"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-cinzel font-bold text-xs border border-amber-500/30 mb-2">
                {other.initials}
              </div>
              <h4 className="font-cinzel font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                {other.name}
              </h4>
              <p className="text-xs text-amber-400/90 mb-1">{other.title}</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {other.bio}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

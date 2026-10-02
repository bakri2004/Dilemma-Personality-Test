import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { figures, Figure, Traits } from "../data/figures";
import { BOOKS } from "../data/books";
import {
  QUESTIONS,
  TRAIT_KEYS,
  ARCHETYPE_TO_TRAIT,
  TraitKey,
} from "../data/questions";
import { FigurePortrait } from "../components/FigurePortrait";
import { siteConfig } from "../config/site";

interface CalculatedResult {
  figure: Figure;
  percentage: number;
  top5: { figure: Figure; similarity: number }[];
}

export const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    new Array(QUESTIONS.length).fill(null)
  );
  const [calculatedResult, setCalculatedResult] = useState<CalculatedResult | null>(
    null
  );
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const quizCardRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Check for shared URL match param on mount
  useEffect(() => {
    const matchId = searchParams.get("match");
    if (matchId) {
      const foundFig = figures.find((f) => f.id === matchId);
      if (foundFig) {
        const top5Mock = [
          { figure: foundFig, similarity: 0.95 },
          ...figures
            .filter((f) => f.id !== foundFig.id)
            .slice(0, 4)
            .map((f, i) => ({ figure: f, similarity: 0.85 - i * 0.08 })),
        ];
        setCalculatedResult({
          figure: foundFig,
          percentage: 95,
          top5: top5Mock,
        });
      }
    }
  }, [searchParams]);

  // Scroll to results when calculated
  useEffect(() => {
    if (calculatedResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [calculatedResult]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);

    // Auto-advance with smooth slight delay
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        computeResults(newAnswers);
      }
    }, 260);
  };

  const computeResults = (answers: (number | null)[]) => {
    const rawTraitPoints: Record<TraitKey, number> = {
      strategy: 0,
      composure: 0,
      inquiry: 0,
      creativity: 0,
      boldness: 0,
      diplomacy: 0,
    };

    answers.forEach((ansIndex, qIndex) => {
      if (ansIndex !== null) {
        const opt = QUESTIONS[qIndex].options[ansIndex];
        if (opt.primary && ARCHETYPE_TO_TRAIT[opt.primary]) {
          rawTraitPoints[ARCHETYPE_TO_TRAIT[opt.primary]] += 3;
        }
        if (opt.secondary && ARCHETYPE_TO_TRAIT[opt.secondary]) {
          rawTraitPoints[ARCHETYPE_TO_TRAIT[opt.secondary]] += 1;
        }
      }
    });

    let totalPoints = 0;
    TRAIT_KEYS.forEach((k) => {
      totalPoints += rawTraitPoints[k];
    });

    const userProfile: Record<TraitKey, number> = {
      strategy: 0,
      composure: 0,
      inquiry: 0,
      creativity: 0,
      boldness: 0,
      diplomacy: 0,
    };

    TRAIT_KEYS.forEach((k) => {
      userProfile[k] = totalPoints > 0 ? rawTraitPoints[k] / totalPoints : 1 / 6;
    });

    // Score all 16 figures using cosine similarity
    const scoredFigures = figures.map((fig) => {
      let dotProduct = 0;
      let normUSq = 0;
      let normFSq = 0;

      TRAIT_KEYS.forEach((k) => {
        const u = userProfile[k];
        const f = fig.traits[k as keyof Traits] || 0;
        dotProduct += u * f;
        normUSq += u * u;
        normFSq += f * f;
      });

      const normU = Math.sqrt(normUSq);
      const normF = Math.sqrt(normFSq);
      const similarity = normU * normF > 0 ? dotProduct / (normU * normF) : 0;

      return { figure: fig, similarity };
    });

    const sortedFigures = scoredFigures.sort((a, b) => {
      if (b.similarity !== a.similarity) {
        return b.similarity - a.similarity;
      }
      return figures.indexOf(a.figure) - figures.indexOf(b.figure);
    });

    const topMatch = sortedFigures[0];
    const matchPercentage = Math.round(topMatch.similarity * 100);
    const top5 = sortedFigures.slice(0, 5);

    setCalculatedResult({
      figure: topMatch.figure,
      percentage: matchPercentage,
      top5,
    });
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (userAnswers[currentQuestionIndex] !== null) {
      computeResults(userAnswers);
    }
  };

  const handleRetake = () => {
    setUserAnswers(new Array(QUESTIONS.length).fill(null));
    setCurrentQuestionIndex(0);
    setCalculatedResult(null);
    if (quizCardRef.current) {
      quizCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyLink = () => {
    if (!calculatedResult) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?match=${calculatedResult.figure.id}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        showToast("✓ Result link copied to clipboard!");
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {
        showToast("Could not copy link automatically");
      });
  };

  const handleShare = () => {
    if (!calculatedResult) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?match=${calculatedResult.figure.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `My Match: ${calculatedResult.figure.name}`,
          text: `I took the ${siteConfig.name} and matched ${calculatedResult.percentage}% with ${calculatedResult.figure.name} (${calculatedResult.figure.title})! ${siteConfig.tagline}`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const scrollToQuiz = () => {
    if (quizCardRef.current) {
      quizCardRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const q = QUESTIONS[currentQuestionIndex];
  const currentStep = currentQuestionIndex + 1;
  const totalSteps = QUESTIONS.length;
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  const matchedFigureBooks = calculatedResult ? BOOKS[calculatedResult.figure.id] || [] : [];
  const hasAffiliateUrl = matchedFigureBooks.some(
    (b) => b.affiliateUrl && b.affiliateUrl.trim() !== ""
  );

  return (
    <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-amber-300 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-sm transition-all duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      {!calculatedResult && (
        <section id="hero-section" className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium tracking-wide uppercase mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>2026 Interactive Cognitive Assessment · 8 Dilemmas</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Which Historical Figure <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Matches Your Mindset?
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 font-normal max-w-2xl mx-auto">
            Across millennia, civilizational leaders, philosophers, and innovators operated by distinct internal compasses. Uncover whether your decision-making aligns with Roman stoicism, ancient tactical deception, or boundless Renaissance curiosity.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>3-Minute Completion</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>16 Validated Archetypes</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={scrollToQuiz}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide uppercase transition-all shadow-[0_0_25px_-5px_rgba(217,119,6,0.35)] cursor-pointer"
            >
              <span>Begin Assessment</span>
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </section>
      )}

      {/* Quiz Card */}
      {!calculatedResult && (
        <section
          ref={quizCardRef}
          id="quiz-container"
          className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative transition-all"
        >
          {/* Progress Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider font-semibold text-amber-400/90">
                Dilemma {currentStep} of {totalSteps}
              </span>
              <span>{progressPct}% Complete</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question Theme & Context */}
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest font-mono text-amber-500 block mb-2 font-semibold">
              {q.theme}
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2.5 leading-snug">
              {q.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 italic">
              {q.context}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {q.options.map((opt, optIndex) => {
              const isSelected = userAnswers[currentQuestionIndex] === optIndex;
              return (
                <button
                  key={opt.letter}
                  type="button"
                  onClick={() => handleSelectOption(optIndex)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border flex items-start gap-4 cursor-pointer text-slate-200 transition-colors ${
                    isSelected
                      ? "bg-slate-850 border-amber-400/80 shadow-[0_0_15px_-3px_rgba(217,119,6,0.3)]"
                      : "border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs sm:text-sm font-mono border transition-colors ${
                      isSelected
                        ? "bg-amber-500 text-slate-950 border-amber-300 shadow-sm"
                        : "bg-slate-800 text-amber-400 border-slate-700"
                    }`}
                  >
                    {opt.letter}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed flex-grow font-normal">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-5 py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={userAnswers[currentQuestionIndex] === null}
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md"
            >
              {currentQuestionIndex === totalSteps - 1 ? "Calculate Result →" : "Next →"}
            </button>
          </div>
        </section>
      )}

      {/* Results View */}
      {calculatedResult && (
        <section ref={resultsRef} id="results-view" className="space-y-12">
          {/* Main Result Card */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Figure Portrait */}
              <FigurePortrait figure={calculatedResult.figure} />

              {/* Profile Details */}
              <div className="flex-grow space-y-4 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold font-mono tracking-wider">
                    {calculatedResult.percentage}% Match
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
                    {/* Inline SVG star badge */}
                    <svg className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Your Official Match</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-amber-500 uppercase tracking-widest">
                  {calculatedResult.figure.era} · {calculatedResult.figure.domain}
                </div>

                <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {calculatedResult.figure.name}
                </h2>

                <h3 className="font-cinzel text-lg sm:text-xl text-amber-400 font-semibold">
                  {calculatedResult.figure.title}
                </h3>

                {/* Plain line under match result */}
                <p className="text-xs text-slate-400">
                  For entertainment only.{" "}
                  <Link
                    to="/how-it-works"
                    className="text-amber-400 hover:text-amber-300 underline underline-offset-2 font-medium"
                  >
                    See how it works.
                  </Link>
                </p>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {calculatedResult.figure.analysis || calculatedResult.figure.bio}
                </p>

                {/* Quote Block (only when quote is non-empty) */}
                {calculatedResult.figure.quote && calculatedResult.figure.quote.trim() !== "" && (
                  <blockquote className="border-l-2 border-amber-500 pl-4 py-1 italic text-slate-400 text-sm bg-slate-950/40 rounded-r-lg">
                    "{calculatedResult.figure.quote}"
                  </blockquote>
                )}

                {/* Pillars / Badges */}
                <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                  {calculatedResult.figure.pillars.map((pill) => (
                    <span
                      key={pill}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Affinity Spectrum (Top 5) */}
            <div className="mt-10 pt-8 border-t border-slate-800">
              <h4 className="font-cinzel text-base font-bold text-slate-200 mb-4">
                Affinity Spectrum (Top Matches)
              </h4>
              <div className="space-y-3">
                {calculatedResult.top5.map(({ figure: item, similarity }) => {
                  const pct = Math.round(similarity * 100);
                  const isTop = item.id === calculatedResult.figure.id;
                  return (
                    <div key={item.id} className="text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className={isTop ? "font-bold text-amber-400" : "text-slate-300 font-medium"}>
                          {item.name} ({item.title})
                        </span>
                        <span className="font-mono text-slate-400 font-semibold">
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isTop
                              ? "bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_rgba(217,119,6,0.5)]"
                              : "bg-slate-600"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Share Card Container */}
            <div className="mt-10 pt-8 border-t border-slate-800">
              <div className="bg-slate-950/70 border border-amber-500/20 rounded-xl p-5 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-500">
                      Share Verification Card
                    </span>
                    <h5 className="font-cinzel text-lg font-bold text-white">
                      {calculatedResult.figure.name} ({calculatedResult.percentage}%)
                    </h5>
                    <p className="text-xs text-slate-400">
                      Share your archetype result with colleagues or friends.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 rounded-lg border border-amber-500/40 hover:border-amber-400 bg-amber-500/10 text-amber-300 hover:text-amber-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copied ? "Copied!" : "Copy Result Link"}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Retake Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  ↺ Retake Assessment
                </button>
              </div>
            </div>
          </div>

          {/* Further Reading Section (Only if figure has books) */}
          {matchedFigureBooks.length > 0 && (
            <section className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
                  Recommended Literature
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                  Further Reading
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Essential primary texts and biographies matching the {calculatedResult.figure.name} archetype.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedFigureBooks.map((book) => (
                  <div
                    key={book.title}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 transition-colors hover:border-amber-500/40 flex flex-col justify-between"
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

                    {book.affiliateUrl && book.affiliateUrl.trim() !== "" && (
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
                ))}
              </div>

              {hasAffiliateUrl && (
                <p className="text-[11px] text-slate-500 italic text-center pt-2">
                  As an Amazon Associate we earn from qualifying purchases.
                </p>
              )}
            </section>
          )}
        </section>
      )}

      {/* Educational Index of All 16 Figures */}
      <section className="mt-16 pt-12 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
            Educational Archive
          </span>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">
            All 16 Mindset Archetypes
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Review the 16 historical archetypes cataloged in the assessment, spanning ancient commanders, scientific pioneers, philosophers, and sovereign leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {figures.map((figure, index) => (
            <article
              key={figure.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-cinzel font-bold text-xs border border-amber-500/30">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-cinzel font-bold text-white text-base">
                      {figure.name}
                    </h4>
                    <p className="text-xs text-amber-400">
                      {figure.title} ({figure.era})
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                  {figure.bio}
                </p>
              </div>
              <div className="text-[11px] text-slate-400 font-mono border-t border-slate-800 pt-2">
                <strong className="text-slate-300">Key Domain:</strong> {figure.domain}
              </div>
              <Link to={`/figures/${figure.id}`} className="mt-3 inline-flex text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4">Explore full profile →</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

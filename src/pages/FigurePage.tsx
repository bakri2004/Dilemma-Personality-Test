import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { figures } from "../data/figures";
import { FigurePortrait } from "../components/FigurePortrait";
import { siteConfig } from "../config/site";
import { BOOKS } from "../data/books";

export const FigurePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const figure = figures.find((item) => item.id === id);

  useEffect(() => {
    if (!figure) return;
    const title = `${figure.name}: Mindset Profile | ${siteConfig.name}`;
    const description = `Explore ${figure.name}'s historical mindset, defining traits, and leadership approach. Discover the archetype behind your quiz result.`;
    document.title = title;
    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        if (selector.startsWith('meta[property=')) element.setAttribute("property", selector.slice(14, -2));
        else element.setAttribute("name", selector.slice(11, -2));
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/figures/${figure.id}`;
    return () => { document.title = "Which Historical Figure Are You? Free Personality Quiz | Dilemma Personality Test"; };
  }, [figure]);

  if (!figure) {
    return (
      <main className="flex-grow max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-cinzel text-3xl text-white mb-4">Figure not found</h1>
        <Link to="/" className="text-amber-400 underline">Take the quiz</Link>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
      <Link to="/" className="text-sm text-amber-400 hover:text-amber-300 underline underline-offset-4">← Back to the quiz</Link>
      <article className="mt-8 bg-slate-900/70 border border-amber-500/20 rounded-2xl p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          <FigurePortrait figure={figure} />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-mono uppercase tracking-widest text-amber-500 mb-3">{figure.era} · {figure.domain}</p>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-2">{figure.name}</h1>
            <h2 className="font-cinzel text-lg text-amber-400 mb-5">{figure.title}</h2>
            <p className="text-slate-300 leading-relaxed">{figure.bio}</p>
          </div>
        </div>
        <section className="mt-10 pt-8 border-t border-slate-800">
          <h2 className="font-cinzel text-xl font-bold text-white mb-4">Defining principles</h2>
          <ul className="flex flex-wrap gap-2">
            {figure.pillars.map((pillar) => <li key={pillar} className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-200">{pillar}</li>)}
          </ul>
        </section>
        {figure.analysis && (
          <section className="mt-8">
            <h2 className="font-cinzel text-xl font-bold text-white mb-3">The mindset</h2>
            <p className="text-slate-300 leading-relaxed">{figure.analysis}</p>
          </section>
        )}
        {figure.quote && (
          <blockquote className="mt-8 border-l-2 border-amber-500 pl-4 italic text-slate-400">“{figure.quote}”</blockquote>
        )}
        {BOOKS[figure.id]?.length ? (
          <section className="mt-8 pt-8 border-t border-slate-800">
            <h2 className="font-cinzel text-xl font-bold text-white mb-4">Further reading</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {BOOKS[figure.id].map((book) => (
                <div key={book.title} className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
                  <h3 className="font-cinzel font-bold text-white">{book.title}</h3>
                  <p className="text-amber-400 text-sm mt-1">by {book.author}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-2">{book.note}</p>
                  {book.affiliateUrl && (
                    <a href={book.affiliateUrl} target="_blank" rel="sponsored noopener noreferrer"
                      className="inline-flex mt-4 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400">
                      View book
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </article>
      <div className="text-center mt-10">
        <p className="text-slate-300 mb-4">Which historical figure matches your own decision-making style?</p>
        <Link to="/" className="inline-flex rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3 font-bold text-slate-950 transition-colors">Take the free personality quiz</Link>
      </div>
    </main>
  );
};

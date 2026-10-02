import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";

export const PrivacyPage: React.FC = () => {
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

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8 border-b border-slate-800 pb-4">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Privacy Policy
        </h1>
        <span className="text-xs text-slate-400 font-mono">
          Last updated: {siteConfig.lastUpdated}
        </span>
      </div>

      <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
            What this site does
          </h2>
          <p>
            {siteConfig.name} is a free interactive web application that provides a historical personality quiz exploring leadership styles, philosophies, and decision-making temperaments.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
            Information we collect
          </h2>
          <p>
            <strong className="text-white">Accounts:</strong> None required. You can access and complete the entire quiz without creating an account, registering, or providing any personally identifiable information.
          </p>
          <p>
            <strong className="text-white">Quiz Answers:</strong> All quiz responses and match calculations are processed entirely on your device within your web browser's temporary memory. Your quiz answers do not leave your browser, are never transmitted to our servers, and are never saved to a database or linked to your identity.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
            Cookies and local storage
          </h2>
          <p>
            The core application does not store quiz answers or personal information in <code className="text-amber-300 text-xs px-1.5 py-0.5 rounded bg-slate-800">localStorage</code> or <code className="text-amber-300 text-xs px-1.5 py-0.5 rounded bg-slate-800">sessionStorage</code>. The site does not set first-party cookies to identify or track individual users.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
            Advertising and affiliate links
          </h2>
          <p>
            This site may show ads from Google AdSense and may contain affiliate links (such as Amazon Associates links).
          </p>
          <p>
            Google and its third-party advertising partners may use cookies to serve ads based on a user's prior visits to this website or other websites on the internet.
          </p>
          <p>
            You can learn how Google manages data in its ad products by visiting{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              How Google uses information from sites or apps that use our services
            </a>.
          </p>
          <p>
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              Google Ads Settings
            </a>.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
            Third-party links
          </h2>
          <p>
            This site may contain links to external third-party websites, such as book recommendations or reference material. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
            Children
          </h2>
          <p>
            This site is not directed to children under 13, and we do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
            Changes to this policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
            Contact
          </h2>
          <p>
            If you have questions about this privacy policy, please contact us at:{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>
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

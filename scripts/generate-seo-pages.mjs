import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Helper to safely load TypeScript modules across Node 18, Node 20, Node 22, and Bun
// without relying on runtime experimental type-stripping flags.
function loadTsModule(relPath) {
  const filePath = path.resolve(rootDir, relPath);
  const code = fs.readFileSync(filePath, "utf-8");
  const transformed = esbuild.transformSync(code, {
    loader: "ts",
    format: "cjs",
  });
  const moduleObj = { exports: {} };
  const fn = new Function("module", "exports", "require", transformed.code);
  fn(moduleObj, moduleObj.exports, (id) => {
    if (id.startsWith(".")) {
      const resolved = path.resolve(path.dirname(filePath), id.endsWith(".ts") ? id : id + ".ts");
      return loadTsModule(resolved);
    }
    return null;
  });
  return moduleObj.exports;
}

// Load source-of-truth data from src/
const { figures } = loadTsModule("src/data/figures.ts");
const { BOOKS, isValidAffiliateUrl } = loadTsModule("src/data/books.ts");
const { siteConfig } = loadTsModule("src/config/site.ts");

const TRAIT_LABELS = {
  strategy: "Strategic Foresight",
  composure: "Crisis Equanimity",
  inquiry: "Empirical Inquiry",
  creativity: "Interdisciplinary Creativity",
  boldness: "Audacious Momentum",
  diplomacy: "Sovereign Diplomacy",
};

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getAssetTags() {
  const distIndexPath = path.join(rootDir, "dist", "index.html");
  let cssTag = "";
  let jsTag = "";

  if (fs.existsSync(distIndexPath)) {
    const distHtml = fs.readFileSync(distIndexPath, "utf-8");
    const cssMatch = distHtml.match(/<link[^>]*rel="stylesheet"[^>]*href="\/assets\/[^"]+"[^>]*>/);
    const jsMatch = distHtml.match(/<script[^>]*type="module"[^>]*src="\/assets\/[^"]+"[^>]*><\/script>/);
    if (cssMatch) cssTag = cssMatch[0];
    if (jsMatch) jsTag = jsMatch[0];
  }

  return { cssTag, jsTag };
}

function generateFigureHtml(figure, { cssTag, jsTag }) {
  const pageTitle = `${figure.name} (${figure.title}) | ${siteConfig.name}`;
  const rawDesc = `${figure.name} (${figure.title}, ${figure.era}). ${figure.bio}`;
  const cleanDesc = rawDesc.length > 155 ? rawDesc.slice(0, 152) + "..." : rawDesc;
  const canonicalUrl = `${siteConfig.url}/figures/${figure.id}`;

  const figureBooks = BOOKS[figure.id] || [];
  const hasValidAffiliate = figureBooks.some((b) => isValidAffiliateUrl(b.affiliateUrl));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": figure.name,
      "description": figure.bio,
      "jobTitle": figure.title,
      "knowsAbout": figure.pillars,
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": siteConfig.url,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Archetypes",
          "item": `${siteConfig.url}/#archetypes`,
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": figure.name,
          "item": canonicalUrl,
        },
      ],
    },
  };

  const traitEntries = Object.keys(figure.traits || {});
  const traitsHtml = traitEntries
    .map((traitKey) => {
      const weight = figure.traits[traitKey] || 0;
      const pct = Math.round(weight * 100);
      return `
        <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          <div class="flex justify-between items-center text-xs mb-1.5">
            <span class="font-medium text-slate-300">${TRAIT_LABELS[traitKey] || traitKey}</span>
            <span class="font-mono text-amber-400 font-semibold">${pct}%</span>
          </div>
          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    })
    .join("\n");

  const pillarsHtml = figure.pillars
    .map(
      (pill) =>
        `<span class="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">${escapeHtml(pill)}</span>`
    )
    .join("\n");

  const quoteHtml =
    figure.quote && figure.quote.trim() !== ""
      ? `<blockquote class="border-l-2 border-amber-500 pl-4 py-2 italic text-slate-300 text-sm bg-slate-950/40 rounded-r-lg my-3">"${escapeHtml(figure.quote)}"</blockquote>`
      : "";

  let booksHtml = "";
  if (figureBooks.length > 0) {
    const bookCards = figureBooks
      .map((book) => {
        const canShowAmazon = isValidAffiliateUrl(book.affiliateUrl);
        const amazonBtn = canShowAmazon
          ? `
            <div class="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <a href="${escapeHtml(book.affiliateUrl)}" target="_blank" rel="sponsored noopener noreferrer" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors">
                <span>View on Amazon</span>
                <svg class="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          `
          : "";

        return `
          <div class="bg-slate-950/70 border border-slate-800 rounded-xl p-5 sm:p-6 transition-colors hover:border-amber-500/40 flex flex-col justify-between">
            <div>
              <h4 class="font-cinzel text-base sm:text-lg font-bold text-white mb-1">${escapeHtml(book.title)}</h4>
              <p class="text-amber-400 text-xs sm:text-sm font-medium mb-2.5">by ${escapeHtml(book.author)}</p>
              <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">${escapeHtml(book.note)}</p>
            </div>
            ${amazonBtn}
          </div>
        `;
      })
      .join("\n");

    const disclosure = hasValidAffiliate
      ? `<p class="text-[11px] text-slate-500 italic text-center pt-1">As an Amazon Associate we earn from qualifying purchases.</p>`
      : "";

    booksHtml = `
      <section class="border-t border-slate-800 pt-8 space-y-6">
        <div>
          <span class="text-xs font-mono uppercase tracking-widest text-amber-500">Curated Bibliography</span>
          <h3 class="font-cinzel text-2xl font-bold text-white mt-1">Further Reading on ${escapeHtml(figure.name)}</h3>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">Authoritative biographies and foundational primary literature related to this archetype.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${bookCards}
        </div>
        ${disclosure}
      </section>
    `;
  }

  const otherFigures = figures.filter((f) => f.id !== figure.id).slice(0, 4);
  const otherFiguresHtml = otherFigures
    .map(
      (other) => `
      <a href="/figures/${escapeHtml(other.id)}" class="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-amber-500/40 transition-colors group block">
        <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-cinzel font-bold text-xs border border-amber-500/30 mb-2">
          ${escapeHtml(other.initials)}
        </div>
        <h4 class="font-cinzel font-bold text-white text-sm group-hover:text-amber-400 transition-colors">${escapeHtml(other.name)}</h4>
        <p class="text-xs text-amber-400/90 mb-1">${escapeHtml(other.title)}</p>
        <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">${escapeHtml(other.bio)}</p>
      </a>
    `
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageTitle)}</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${escapeHtml(pageTitle)}" />
  <meta name="description" content="${escapeHtml(cleanDesc)}" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#0f172a" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${escapeHtml(siteConfig.name)}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(cleanDesc)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(cleanDesc)}" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Cinzel+Decorative:wght@700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

  <!-- Structured Data (JSON-LD) -->
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>

  ${cssTag}
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 bg-[#090d16] text-[#e2e8f0]">
  <div id="root">
    <header class="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <a href="/" class="flex items-center space-x-3 group">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-[0_0_25px_-5px_rgba(217,119,6,0.35)] flex items-center justify-center">
            <div class="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
            </div>
          </div>
          <div>
            <span class="font-cinzel tracking-[0.2em] text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">${escapeHtml(siteConfig.name)}</span>
          </div>
        </a>
      </div>
    </header>

    <main class="flex-grow max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16 w-full">
      <nav class="mb-6 flex items-center justify-between">
        <a href="/" class="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors">
          <span>← Back to the quiz</span>
        </a>
        <span class="text-xs font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">Historical Archetype Archive</span>
      </nav>

      <article class="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-6 sm:p-10 shadow-2xl relative space-y-8">
        <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div class="flex flex-col items-center">
            <div class="w-48 h-60 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_25px_-5px_rgba(217,119,6,0.35)] relative bg-slate-900 group shrink-0">
              <div class="w-full h-full flex flex-col items-center justify-center p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-center select-none">
                <div class="w-16 h-16 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center mb-3 shadow-[0_0_25px_-5px_rgba(217,119,6,0.35)]">
                  <span class="font-cinzel text-2xl font-bold text-amber-400 bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">${escapeHtml(figure.initials)}</span>
                </div>
                <span class="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide mb-1 leading-snug">${escapeHtml(figure.name)}</span>
                <span class="text-[11px] text-amber-400/90 font-mono px-2 text-center line-clamp-2">${escapeHtml(figure.era)}</span>
              </div>
            </div>
          </div>

          <div class="flex-grow space-y-4 text-center md:text-left">
            <div class="text-xs font-mono text-amber-500 uppercase tracking-widest">${escapeHtml(figure.era)} · ${escapeHtml(figure.domain)}</div>
            <h1 class="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">${escapeHtml(figure.name)}</h1>
            <h2 class="font-cinzel text-lg sm:text-xl text-amber-400 font-semibold">${escapeHtml(figure.title)}</h2>
            ${quoteHtml}
            <div class="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
              ${pillarsHtml}
            </div>
            <div class="pt-2">
              <a href="/" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer">
                <span>Take the Quiz to Match Your Mindset</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        <section class="border-t border-slate-800 pt-8 space-y-4">
          <h3 class="font-cinzel text-xl font-bold text-slate-100">Historical Context &amp; Strategic Temperament</h3>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">${escapeHtml(figure.bio)}</p>
          ${figure.analysis ? `<p class="text-slate-300 text-sm sm:text-base leading-relaxed">${escapeHtml(figure.analysis)}</p>` : ""}
        </section>

        <section class="border-t border-slate-800 pt-8">
          <h3 class="font-cinzel text-xl font-bold text-slate-100 mb-2">Archetype Trait Distribution</h3>
          <p class="text-xs text-slate-400 mb-6">Editorial synthesis of ${escapeHtml(figure.name)}'s recorded decision-making style across the six core assessment traits.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${traitsHtml}
          </div>
        </section>

        ${booksHtml}
      </article>

      <section class="mt-16 pt-10 border-t border-slate-800/80">
        <div class="flex flex-col sm:flex-row justify-between items-baseline mb-6 gap-2">
          <div>
            <span class="text-xs font-mono uppercase tracking-widest text-amber-500">Related Figures</span>
            <h3 class="font-cinzel text-2xl font-bold text-white">Explore More Historical Archetypes</h3>
          </div>
          <a href="/#archetypes" class="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">View all 16 figures →</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          ${otherFiguresHtml}
        </div>
      </section>
    </main>

    <footer class="w-full border-t border-slate-800/80 bg-slate-950 py-10 mt-16 text-slate-400 text-sm">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center space-y-4">
        <nav class="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium">
          <a href="/how-it-works" class="hover:text-amber-400 transition-colors">How it works</a>
          <a href="/about" class="hover:text-amber-400 transition-colors">About</a>
          <a href="/privacy" class="hover:text-amber-400 transition-colors">Privacy Policy</a>
          <a href="/contact" class="hover:text-amber-400 transition-colors">Contact</a>
        </nav>
        <p class="text-slate-400 text-xs sm:text-sm">© 2026 ${escapeHtml(siteConfig.name)}</p>
        <p class="text-slate-500 text-xs max-w-md">For entertainment only. Not a psychological assessment.</p>
      </div>
    </footer>
  </div>
  ${jsTag}
</body>
</html>
`;
}

function generateSitemap() {
  const staticRoutes = [
    { path: "", changefreq: "weekly", priority: "1.0" },
    { path: "how-it-works", changefreq: "monthly", priority: "0.8" },
    { path: "about", changefreq: "monthly", priority: "0.7" },
    { path: "privacy", changefreq: "monthly", priority: "0.5" },
    { path: "contact", changefreq: "monthly", priority: "0.5" },
  ];

  const figureRoutes = figures.map((f) => ({
    path: `figures/${f.id}`,
    changefreq: "monthly",
    priority: "0.8",
  }));

  const allRoutes = [...staticRoutes, ...figureRoutes];

  const xmlEntries = allRoutes
    .map(
      (r) => `  <url>
    <loc>${siteConfig.url}/${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml
`;
}

export function main() {
  console.log("Generating static SEO pages, sitemap, and robots.txt...");

  const { cssTag, jsTag } = getAssetTags();
  if (cssTag && jsTag) {
    console.log("Found production Vite assets in dist/index.html. Injecting production bundles.");
  } else {
    console.log("Running in pre-build mode. Generating clean standalone HTML without dev-only scripts.");
  }

  // 1. Generate figure static pages in public/figures/<id>/index.html
  const publicDir = path.join(rootDir, "public");
  const distDir = path.join(rootDir, "dist");
  const distExists = fs.existsSync(distDir);

  figures.forEach((figure) => {
    const htmlContent = generateFigureHtml(figure, { cssTag, jsTag });

    // Write to public/
    const publicFigureDir = path.join(publicDir, "figures", figure.id);
    fs.mkdirSync(publicFigureDir, { recursive: true });
    fs.writeFileSync(path.join(publicFigureDir, "index.html"), htmlContent, "utf-8");

    // Also write to dist/ if dist exists (post-build)
    if (distExists) {
      const distFigureDir = path.join(distDir, "figures", figure.id);
      fs.mkdirSync(distFigureDir, { recursive: true });
      fs.writeFileSync(path.join(distFigureDir, "index.html"), htmlContent, "utf-8");
    }
  });

  console.log(`Generated ${figures.length} static figure pages.`);

  // 2. Generate sitemap.xml
  const sitemapContent = generateSitemap();
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapContent, "utf-8");
  if (distExists) {
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapContent, "utf-8");
  }
  console.log("Generated sitemap.xml.");

  // 3. Generate robots.txt
  const robotsContent = generateRobotsTxt();
  fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsContent, "utf-8");
  if (distExists) {
    fs.writeFileSync(path.join(distDir, "robots.txt"), robotsContent, "utf-8");
  }
  console.log("Generated robots.txt.");

  console.log("SEO generation complete.");
  process.exit(0);
}

// Execute if run directly
main();

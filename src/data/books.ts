export interface BookEntry {
  title: string;
  author: string;
  note: string;
  affiliateUrl: string;
}

/**
 * Validates that an affiliate URL is safe, valid, non-empty, and not a placeholder.
 */
export function isValidAffiliateUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (
    trimmed === "" ||
    trimmed.includes("YOURTAG-20") ||
    trimmed.includes("/dp/ASIN") ||
    trimmed.includes("example.com")
  ) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const BOOKS: Record<string, BookEntry[]> = {
  suntzu: [
    {
      title: "The Art of War",
      author: "Sun Tzu",
      note: "The foundational military strategy treatise exploring strategic positioning, psychological advantage, and winning without direct conflict.",
      affiliateUrl: "",
    },
  ],
  marcus: [
    {
      title: "Meditations",
      author: "Marcus Aurelius",
      note: "Private spiritual and philosophical journals detailing daily Stoic reflections on duty, resilience, and emotional self-command.",
      affiliateUrl: "",
    },
  ],
  curie: [
    {
      title: "Madame Curie",
      author: "Eve Curie",
      note: "A definitive biography recounting Marie Curie's groundbreaking scientific discoveries, relentless laboratory work, and extraordinary perseverance.",
      affiliateUrl: "",
    },
  ],
  leonardo: [
    {
      title: "Leonardo da Vinci",
      author: "Walter Isaacson",
      note: "An acclaimed examination of Leonardo's cross-disciplinary genius, connecting his artistic masterworks to his scientific notebooks.",
      affiliateUrl: "",
    },
  ],
  alexander: [
    {
      title: "Alexander the Great",
      author: "Robin Lane Fox",
      note: "A comprehensive historical study analyzing Alexander's strategic campaigns, battlefield leadership, and boundless ambition.",
      affiliateUrl: "",
    },
  ],
  cleopatra: [
    {
      title: "Cleopatra: A Life",
      author: "Stacy Schiff",
      note: "A Pulitzer Prize-winning historical biography exploring Cleopatra's astute political statecraft, diplomacy, and sovereign leadership.",
      affiliateUrl: "",
    },
  ],
};

/** Address-based portal hops. Commercial listings rarely resolve 1:1; treat as discovery, not underwriting. */

export type ExternalListingHref = {
  label: string;
  href: string;
};

export type MinimalAddressFields = Pick<
  { addressLine: string; city: string; state: string; zip: string },
  "addressLine" | "city" | "state" | "zip"
>;

function mapsSearchUrl(term: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(term)}`;
}

function zillowRentSearchUrl(term: string): string {
  const searchQueryState = JSON.stringify({
    pagination: {},
    usersSearchTerm: term,
  });
  return `https://www.zillow.com/homes/for_rent/?searchQueryState=${encodeURIComponent(searchQueryState)}`;
}

/** Redfin ZIP landing page (area comps and nearby transactions). */
export function redfinZipUrl(zip: string): string {
  const z = zip.trim();
  return `https://www.redfin.com/zipcode/${encodeURIComponent(z)}`;
}

export function buildFallbackPortalLinks(
  row: MinimalAddressFields,
): ExternalListingHref[] {
  const term = `${row.addressLine}, ${row.city}, ${row.state} ${row.zip}`;
  return [
    { label: "Open in Google Maps", href: mapsSearchUrl(term) },
    { label: "Search on Zillow", href: zillowRentSearchUrl(term) },
    {
      label: `Area context (ZIP ${row.zip})`,
      href: redfinZipUrl(row.zip),
    },
  ];
}

/** Explicit manifest links first; append fallbacks that are not duplicate hrefs. */
export function mergeListingLinks(
  explicit: ExternalListingHref[] | undefined,
  fallbacks: ExternalListingHref[],
): ExternalListingHref[] {
  const out: ExternalListingHref[] = [...(explicit ?? [])];
  const seen = new Set(out.map((l) => l.href));
  for (const link of fallbacks) {
    if (!seen.has(link.href)) {
      seen.add(link.href);
      out.push(link);
    }
  }
  return out;
}
